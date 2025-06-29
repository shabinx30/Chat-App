import Message from "./Message";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState } from "../../redux/store";
import { useAppContext } from "../../context/AppContext";
import { AnimatePresence, motion } from "framer-motion";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import useTyping from "../../hooks/useTyping";
import type { Msg, chatType } from "../../types/chat";

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;


const Chat = () => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const endDiv = useRef<HTMLDivElement>(null);
    const state = useTypedSelector((state) => state);
    const [messages, setMessages] = useState<Msg[]>([]);
    const [isInView, setIsInView] = useState<boolean>(false);
    const { socket, preview, setPreview } = useAppContext();
    const navigate = useNavigate();
    const msgRef = useRef<HTMLTextAreaElement>(null);
    const { chatId } = useParams();
    const attachRef = useRef<HTMLInputElement>(null);

    const apiUrl = import.meta.env.VITE_BASE_URL;

    // Socket listener for new messages
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
            .get(`${apiUrl}/api/message/getmessages?chatId=${chatId}`)
            .then((res) => {
                const result = res.data.chat.members.filter(
                    (user: any) => user.userId._id !== state.auth?.user?.userId
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
    }, [chatId, apiUrl, state.auth?.user?.userId]);

    const [rotate, setRotate] = useState(0);

    const hello = useRef<boolean>(null);

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
            from: state.auth?.user?.userId,
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

    const { isTyping } = useTyping()

    useEffect(() => {
        if (!preview) {
            if (attachRef.current) {
                attachRef.current.value = "";
            }
        }
    }, [preview]);

    useEffect(() => {
        const isAtBottom = () => {
            if(scrollRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
                return scrollTop + clientHeight >= scrollHeight - 1;
            }
        };

        const checkScrollPosition = () => {
            if (isAtBottom()) {
                setIsInView(false)
            } else {
                setIsInView(true)
            }
        };

        checkScrollPosition()

        // Add scroll event listener
        scrollRef.current?.addEventListener("scroll", checkScrollPosition);
        
        return () => {
            scrollRef.current?.removeEventListener("scroll", checkScrollPosition);
        }
    }, []);

    return (
        <div className="absolute md:relative md:flex-[calc(1/2.6*100%)] w-full max-h-[100vh] z-50">
            <motion.section
                initial={window.innerWidth <= 768 && { x: 400, opacity: 0 }}
                animate={window.innerWidth <= 768 && { x: 0, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 25,
                    duration: 1,
                }}
                className={`${
                    chatId ? "flex-[calc(1/2.6*100%)]" : "hidden"
                } relative h-[100dvh] pattern`}
            >
                {/* chat info section  */}
                <ChatHeader chat={chat} navigate={navigate} />
                <div
                    ref={scrollRef}
                    className="h-full py-[5.25em] scroll-smooth flex flex-col-reverse overflow-y-auto scrollable px-2 md:px-4"
                >
                    {!messages.length ? (
                        <div className="flex justify-center items-center h-full">
                            <div
                                onClick={() => {
                                    hello.current = true;
                                    sendMessage();
                                }}
                                className="cursor-pointer border border-[#b0ff62] border-dashed rounded-3xl pt-1 pb-1.5 pl-3 pr-2"
                            >
                                Say Hello👋
                            </div>
                        </div>
                    ) : (
                        <>
                            {messages.map((message, i) => (
                                <Message
                                    key={i}
                                    message={message}
                                    user={state.auth?.user?.userId}
                                    endDiv={0 == i ? endDiv : null}
                                />
                            ))}
                        </>
                    )}
                    <AnimatePresence>
                        {isTyping?.isTyping && chatId === isTyping.chatId && (
                            <motion.div className="hidden md:block text-white w-[3em] rounded-lg bg-[#fff] dark:bg-[#1b1b1b] ml-2 mt-0.5">
                                <img
                                    className="object-cover"
                                    src="/icons/5V1YDdBVLZ.gif"
                                    alt="typing"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                {/* chat input section */}
                <ChatInput
                    rotate={rotate}
                    attachRef={attachRef}
                    msgRef={msgRef}
                    sendMessage={sendMessage}
                    chatId={chatId}
                    chat={chat}
                />
                {/* scroll to bottom button */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: !isInView ? 0 : 1 }}
                    onClick={() =>
                        endDiv.current?.scrollIntoView({ behavior: "instant" })
                    }
                    className="absolute cursor-pointer bg-white dark:bg-[#2b2b2b] dark:text-[#b0ff62] bottom-[6em] md:bottom-[5em] rounded-2xl shadow-[0_2px_10px] shadow-black/50 right-5 md:right-10 p-2"
                >
                    <MdKeyboardDoubleArrowDown size={26} />
                </motion.div>
            </motion.section>
        </div>
    );
};

export default Chat;
