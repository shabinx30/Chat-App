import axios from "axios";
import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import type { ctcType } from "../../types/contacts";

interface CtcHookTypes {
    setCtc: React.Dispatch<React.SetStateAction<ctcType[]>>;
    userId: string | undefined;
    change: string;
}

const useContacts = ({ setCtc, userId, change }: CtcHookTypes) => {
    const [onUsers, setOnUsers] = useState<Set<string>>(new Set());
    const { socket } = useAppContext();
    const { VITE_BASE_URL } = import.meta.env;
    const [chatMsg, setChatMsg] = useState<string>("");

    useEffect(() => {
        setCtc([]);
        const getContacts = () => {
            axios
                .get(`${VITE_BASE_URL}/api/chat/getcontacts?userId=${userId}`)
                .then((res) => {
                    for (let con of res.data.chat) {
                        setCtc((p) => [con, ...p]);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        };
        getContacts();
        socket.on("online", (res) => {
            setOnUsers(new Set(res));
        });
        socket.on("chat message", (message) => {
            setChatMsg(message.tosChat);
        });
    }, [change]);

    return {onUsers, chatMsg};
};

export default useContacts;
