import { useEffect, useState } from "react";
import type { chatType, Msg } from "../../types/chat";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";

interface GetMsgHookTypes {
    setMessages: React.Dispatch<React.SetStateAction<Msg[]>>;
    userId: string | undefined;
    chatId: string | undefined;
}

const useGetMsg = ({ setMessages, userId, chatId }: GetMsgHookTypes) => {
    const { socket } = useAppContext();
    const apiUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        socket.on("chat message", (msg: any) => {
            if (msg.tosChat === chatId) {
                setMessages((prev) => [msg, ...prev]);
            }
        });
        return () => {
            socket.off("chat message");
        };
    }, [chatId, socket]);

    const [chat, setChat] = useState<chatType>();
    const set = new Set();

    // Fetch initial messages
    useEffect(() => {
        setMessages([]);

        axios
            .get(`${apiUrl}/api/message/getmessages?chatId=${chatId}&userId=${userId}`)
            .then((res) => {
                const result = res.data.chat.members.filter(
                    (user: any) => user.userId._id !== userId
                )[0];
                setChat(result.userId);
                for (let data of res.data.messages) {
                    if (!set.has(data._id)) {
                        setMessages((prev) => [data, ...prev]);
                        set.add(data._id);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [chatId, apiUrl, userId]);

    return { chat };
};

export default useGetMsg;
