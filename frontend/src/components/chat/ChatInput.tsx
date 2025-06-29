import InputPreview from "./InputPreview";
import { ImAttachment } from "react-icons/im";
import { motion } from "framer-motion";
import { useAppContext } from "../../context/AppContext";
import { LuSendHorizontal } from "react-icons/lu";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import debounce from "../../libs/debouncer";
import { type chatType } from "../../types/chat";

interface CIType {
    rotate: number;
    attachRef: React.RefObject<HTMLInputElement | null>;
    msgRef: React.RefObject<HTMLTextAreaElement | null>;
    sendMessage: (e?: FormEvent<HTMLFormElement> | null) => Promise<void>;
    chatId: string | undefined;
    chat: chatType | undefined;
}

const ChatInput = ({ rotate, attachRef, msgRef, sendMessage, chatId, chat }: CIType) => {
    const { socket, preview, setPreview } = useAppContext();

    const [typing, setTyping] = useState<boolean>();
    const debouncedSearch = useCallback(
        debounce(() => setTyping(false), 500),
        []
    );

    const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (e.target.value.trim()) {
            setTyping(true);
            debouncedSearch();
        }
    };

    useEffect(() => {
        if (typeof typing === "boolean") {
            socket.emit("typing", { typing, chatId, to: chat?._id });
        }
    }, [typing, chatId, chat?._id, socket]);

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 pb-4 flex justify-center bg-gradient-to-t from-[#e6ffcb]/75 dark:from-black/75 to-transparent w-full"
        >
            <div className="flex dark:border border-[#2b2b2b] bg-[#fff] dark:bg-[#1b1b1b] dark:shadow-none shadow-[0_1px_10px] shadow-black/50 rounded-2xl text-black justify-between pr-2 pl-5 gap-1 items-center w-[80%]">
                {/* file input preview */}
                <InputPreview preview={preview} setPreview={setPreview} />
                <div className="relative w-[18px] flex items-center cursor-pointer">
                    <ImAttachment
                        size={18}
                        className="z-10 absolute dark:text-[#b0ff62]"
                    />
                    <input
                        ref={attachRef}
                        className="absolute z-20 w-[18px] opacity-0"
                        type="file"
                        onChange={(e) => {
                            const file = e.target.files && e.target.files[0];
                            if (!file) {
                                setPreview("");
                                return;
                            }
                            if (file.type.slice(0, 5) != "image") {
                                e.target.value = "";
                                return;
                            }
                            const reader = new FileReader();
                            reader.onload = () => {
                                setPreview(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                        }}
                        // accept="image/*, video/*"
                        accept="image/*"
                    />
                </div>
                <form className="w-full items-center" onSubmit={sendMessage}>
                    <textarea
                        ref={msgRef}
                        className="resize-none scrollable pt-4 dark:text-white w-full outline-none h-[3.4em] placeholder:text-gray-600 dark:placeholder:text-gray-400 px-2"
                        onChange={handleTyping}
                        placeholder="Type a message"
                        onKeyDown={(e) => {
                            if (e.key == "Enter") {
                                if (e.shiftKey) {
                                    return;
                                }
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                    ></textarea>
                </form>
                <div
                    onClick={() => sendMessage()}
                    className="bg-[#b0ff62] dark:text-black cursor-pointer py-2 pl-2.5 pr-1.5 rounded-[12px]"
                >
                    <motion.div
                        animate={{ rotateY: rotate }}
                        transition={{
                            type: "spring",
                            stiffness: 120,
                            damping: 25,
                            duration: 1,
                        }}
                        className="transform-3d"
                    >
                        <LuSendHorizontal
                            className="translate-z-[4em]"
                            size={22}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ChatInput;