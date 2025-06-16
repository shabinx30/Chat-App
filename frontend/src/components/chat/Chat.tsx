import Message from "./Message";
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type FormEvent,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState } from "../../redux/store";
import { useAppContext } from "../../context/AppContext";
import { AnimatePresence, motion } from "framer-motion";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
import { VariableSizeList as List } from "react-window";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export interface chatType {
    _id: string;
    name: string;
    profile: string;
}

export interface Msg {
    body: string;
    createdAt: number;
    from: string;
    hasMedia: boolean;
    media: string | undefined;
    mediaType: string | undefined;
}

interface typing {
    isTyping: boolean;
    chatId: string;
}

const Chat = () => {
    const scrollRef = useRef<any>(null);
    const scrollRef2 = useRef<any>(null);
    const shouldScrollToBottom = useRef(false);
    const state = useTypedSelector((state) => state);
    const [messages, setMessages] = useState<Msg[]>([]);
    const { socket, preview, setPreview } = useAppContext();
    const navigate = useNavigate();
    const msgRef = useRef<HTMLTextAreaElement>(null);
    const { chatId } = useParams();
    const attachRef = useRef<HTMLInputElement>(null);

    const apiUrl = import.meta.env.VITE_BASE_URL;

    const [isLastMessageInView, setIsLastMessageInView] = useState(true);

    // Socket listener for new messages
    useEffect(() => {
        socket.on("chat message", (msg: any) => {
            if (msg.tosChat === chatId) {
                if (isLastMessageInView) {
                    shouldScrollToBottom.current = true;
                }
                setMessages((prev) => [...prev, msg]);
            }
        });
        return () => {
            socket.off("chat message");
        };
    }, [chatId, socket, isLastMessageInView]);

    const [chat, setChat] = useState<chatType>();
    const set = new Set();

    // Fetch initial messages
    useEffect(() => {
        setMessages([]);
        // Clear the item size map when switching chats
        itemSizeMap.current = {};

        axios
            .get(`${apiUrl}/api/message/getmessages?chatId=${chatId}`)
            .then((res) => {
                const result = res.data.chat.members.filter(
                    (user: any) => user.userId._id !== state.auth.user.userId
                )[0];
                setChat(result.userId);
                const fetchedMessages = [];
                for (let data of res.data.messages) {
                    if (!set.has(data._id)) {
                        fetchedMessages.push(data);
                        set.add(data._id);
                    }
                }
                setMessages(fetchedMessages);
                shouldScrollToBottom.current = true;
            })
            .catch((error) => {
                console.log(error);
            });
    }, [chatId, apiUrl, state.auth.user.userId]);

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
            from: state.auth.user.userId,
            hasMedia: !!media,
            media,
            mediaType: file ? file.type.slice(0, 5) : undefined,
        };

        socket.emit("chat message", {
            ...myMsg,
            chatId,
            to: chat?._id,
        });

        shouldScrollToBottom.current = true;
        setMessages((p) => [...p, myMsg]);

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

    // Scroll to bottom when messages change and shouldScrollToBottom is true
    useEffect(() => {
        if (
            shouldScrollToBottom.current &&
            scrollRef2.current &&
            messages.length > 0
        ) {
            scrollRef2.current?.scrollToItem(messages.length - 1, "end");
            setIsLastMessageInView(true);
            shouldScrollToBottom.current = false;
        }
    }, [messages]);

    const [isTyping, setIsTyping] = useState<typing>();
    const scrollToBottom = () => {
        if (scrollRef2.current && messages.length > 0) {
            // scrollRef2.current.scrollToItem(messages.length - 1, "end");
            scrollRef2.current.scrollToItem(messages.length - 1, "end");
            setIsLastMessageInView(true);
        }
    };

    useEffect(() => {
        socket.on("typing", (res) => {
            setIsTyping({ isTyping: res.typing, chatId: res.chatId });
        });
        return () => {
            socket.off("typing");
        };
    }, [socket]);

    const [size, setSize] = useState(0);

    useEffect(() => {
        const handleResize = () => {
            const height = scrollRef.current?.clientHeight || 0;
            setSize(height);
            // Reset the list on resize to recalculate all visible item sizes
            scrollRef2.current?.resetAfterIndex(0);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const itemSizeMap = useRef<{ [index: number]: number }>({});

    // Improved getItemSize with better default height estimation
    const getItemSize = (index: number) => {
        if (itemSizeMap.current[index]) {
            return itemSizeMap.current[index];
        }

        // Better default height estimation based on message length
        const message = messages[index];
        if (message) {
            const textLength = message.body.length;
            let width = 0;
            if (message.hasMedia && message.media) {
                const img = new Image();
                img.onload = function () {
                    width = img.width;
                };
                img.src = message.media;
            }
            // Estimate height based on text length (rough calculation)
            const estimatedLines = Math.ceil(textLength / 35); // ~35 chars per line
            const baseHeight = 60; // Base height for message bubble
            const lineHeight = 20; // Height per line of text
            return baseHeight + estimatedLines * (lineHeight+width);
        }

        return 80; // Fallback default
    };

    const setSizeForIndex = useCallback((index: number, size: number) => {
        // Add a small buffer to prevent cutting off
        const adjustedSize = size + 2;

        if (itemSizeMap.current[index] !== adjustedSize) {
            itemSizeMap.current[index] = adjustedSize;
            // Use requestAnimationFrame to ensure smooth updates
            requestAnimationFrame(() => {
                scrollRef2.current?.resetAfterIndex(index);
            });
        }
    }, []);

    useEffect(() => {
        if (!preview) {
            if (attachRef.current) {
                attachRef.current.value = "";
            }
        }
    }, [preview]);

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
                } relative h-[100dvh] bg-[#e6ffcb] dark:bg-black`}
            >
                {/* chat info section  */}
                <ChatHeader chat={chat} navigate={navigate} />
                <div ref={scrollRef} className="h-[78.5vh] mt-2 px-2 md:px-4">
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
                        <List
                            ref={scrollRef2}
                            className="bg-[#e6ffcb] dark:bg-black scrollable"
                            height={size}
                            itemCount={messages.length}
                            itemSize={getItemSize}
                            width="100%"
                            itemData={{
                                messages,
                                user: state.auth.user.userId,
                                setSizeForIndex,
                            }}
                            onScroll={({ scrollOffset }) => {
                                if (scrollRef.current) {
                                    const totalHeight = messages
                                        .map((_, i) => getItemSize(i))
                                        .reduce((a, b) => a + b, 0);
                                    const viewportHeight =
                                        scrollRef.current.clientHeight;
                                    const isAtBottom =
                                        scrollOffset + viewportHeight >=
                                        totalHeight - 100; // Small buffer for better detection
                                    setIsLastMessageInView(isAtBottom);
                                }
                            }}
                            // Add overscan to improve performance and height calculation
                            overscanCount={2}
                        >
                            {Message}
                        </List>
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
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: isLastMessageInView ? 0 : 1 }}
                    onClick={scrollToBottom}
                    className="absolute cursor-pointer bg-white dark:bg-[#2b2b2b] dark:text-[#b0ff62] bottom-[6em] md:bottom-[5em] rounded-2xl shadow-[0_2px_10px] shadow-black/50 right-5 md:right-10 p-2"
                >
                    <MdKeyboardDoubleArrowDown size={26} />
                </motion.div>
            </motion.section>
        </div>
    );
};

export default Chat;
