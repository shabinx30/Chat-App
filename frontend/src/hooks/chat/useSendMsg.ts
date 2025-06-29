import { useState, type FormEvent } from "react";
import { useAppContext } from "../../context/AppContext";
import type { chatType, Msg } from "../../types/chat";
import { useSelector, type TypedUseSelectorHook } from "react-redux";
import { useParams } from "react-router-dom";
import type { RootState } from "../../redux/store";

interface SendMsgHookTypes {
    setMessages: React.Dispatch<React.SetStateAction<Msg[]>>;
    msgRef: React.RefObject<HTMLTextAreaElement | null>;
    attachRef: React.RefObject<HTMLInputElement | null>;
    hello: React.RefObject<boolean | null>;
    chat: chatType | undefined
}

const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const useSendMsg = ({setMessages, msgRef, attachRef, hello, chat}: SendMsgHookTypes) => {
    const state = useTypedSelector((state) => state)
    const { socket, setPreview } = useAppContext();
    const [rotate, setRotate] = useState(0);
    const { chatId } = useParams();

    const sendMessage = async (e: FormEvent<HTMLFormElement> | null = null) => {
            if (e) e.preventDefault();
    
            const text = msgRef.current?.value.trim();
            const file = attachRef.current?.files?.[0];
    
            const shouldSend = text || hello.current || file;
    
            if (!shouldSend) return;
    
            let media: string | undefined;
    
            if (file) {
                media = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        resolve(reader.result as string);
                    };
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            }
            // console.log(media)
    
            setRotate((prev) => prev + 360);
            const myMsg: Msg = {
                body: hello.current ? "Hello👋" : text || "",
                createdAt: Date.now(),
                from: state.auth.user?.userId,
                hasMedia: !!media,
                media,
                mediaType: file ? file.type.slice(0, 5) : undefined,
            };
    
            socket.emit("chat message", {
                ...myMsg,
                chatId,
                to: chat?._id,
            });
    
            setMessages((p) => [myMsg, ...p]);
    
            if (msgRef.current) {
                msgRef.current.value = "";
            }
            if (hello.current) {
                hello.current = false;
            }
            if (attachRef.current) {
                setPreview("");
            }
        };
    return { sendMessage, rotate}
};

export default useSendMsg;
