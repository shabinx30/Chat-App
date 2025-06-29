import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";

interface typing {
    isTyping: boolean;
    chatId: string;
}

const useTyping = () => {
    const [isTyping, setTyping] = useState<typing>();
    const { socket } = useAppContext();

    useEffect(() => {
        socket.on("typing", (res) => {
            setTyping({ isTyping: res.typing, chatId: res.chatId });
        });

        return () => {
            socket.off("typing");
        };
    });

    return isTyping;
};

export default useTyping;
