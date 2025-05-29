import { LuSendHorizontal } from "react-icons/lu";
import { ImAttachment } from "react-icons/im";
import { IoMdMore } from "react-icons/io";
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
import { IoIosArrowBack } from "react-icons/io";

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

interface chatType {
    _id: string;
    name: string;
    profile: string;
}

interface Msg {
    body: string;
    createdAt: number;
    from: string;
}

function debounce(func: (...args: any[]) => void, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

const Chat = () => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const state = useTypedSelector((state) => state);
    const [messages, setMessages] = useState<Msg[]>([]);
    const { socket } = useAppContext();

    // Scroll to the bottom (latest message) when the component mounts
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, []);

    const containerRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    const msgRef = useRef<HTMLInputElement>(null);

    let apiUrl = import.meta.env.VITE_BASE_URL;
    const { chatId } = useParams();

    useEffect(() => {
        socket.on("chat message", (msg: any) => {
            console.log(msg);
            console.log(msg.tosChat);
            if (msg.tosChat == chatId) {
                setMessages((prev) => [msg, ...prev]);
            }
        });

        return () => {
            socket.off("chat message");
        };
    }, [chatId]);

    const [chat, setChat] = useState<chatType>();
    const set = new Set();

    useEffect(() => {
        setMessages([]);
        axios
            .post(`${apiUrl}/api/message/getmessages`, { chatId })
            .then((res) => {
                let result = res.data.chat.members.filter(
                    (user: any) => user.userId._id != state.auth.user.userId
                )[0];
                // console.log(res.data.messages);
                setChat(result.userId);
                for (let data of res.data.messages) {
                    if (!set.has(data._id)) {
                        setMessages((p) => [data, ...p]);
                        set.add(data._id);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, [chatId]);

    const [rotate, setRotate] = useState(0);

    const sendMessage = (e: FormEvent<HTMLFormElement> | null = null) => {
        if (e) {
            e.preventDefault();
        }
        if (msgRef.current?.value.trim()) {
            setRotate((prev) => prev + 360);
            socket.emit("chat message", {
                msg: msgRef.current?.value,
                chatId: chatId,
                from: state.auth.user.userId,
                to: chat?._id,
            });
            const myMsg: Msg = {
                body: msgRef.current?.value,
                createdAt: Date.now(),
                from: state.auth.user.userId,
            };
            setMessages((p) => [myMsg, ...p]);
            msgRef.current.value = "";
        }
    };

    const [isLastMessageInView, setIsLastMessageInView] = useState(true);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const [typing, setTyping] = useState<boolean>();

    const reset = () => {
        setTyping(false);
    };

    const debouncedSearch = useCallback(debounce(reset, 500), []);

    const handleTyping = () => {
        setTyping(true);
        debouncedSearch();
    };

    useEffect(() => {
        if (typing == true || typing == false) {
            console.log(typing);
            socket.emit("typing", {
                chatId,
                userId: state.auth.user.userId,
            });
        }
    }, [typing]);

    return (
        <section
            ref={containerRef}
            className={` ${
                chatId ? "flex-[calc(1/2.6*100%)]" : "hidden"
            } relative h-[100dvh] bg-[#dee1ff] dark:bg-[#131313]`}
        >
            <div className="flex bg-[#fff] dark:bg-gray-900 dark:border-b border-gray-800 dark:text-[#fff] text-[#000000] items-center py-4 px-2 justify-between top-0 w-[100%] h-[8.5vh]">
                <div className="flex items-center gap-1 md:gap-3 md:px-2">
                    <IoIosArrowBack
                        className="cursor-pointer"
                        onClick={() => navigate("/")}
                        size={30}
                    />
                    <img
                        className="object-cover min-w-[2.5em] max-h-[2.5em] rounded-full"
                        src={`${
                            chat?.profile !== ""
                                ? import.meta.env.VITE_BASE_URL +
                                  "/" +
                                  chat?.profile
                                : "/user.png"
                        }`}
                        alt={chat?.name}
                    />
                    <div>
                        <h1 className="font-semibold">{chat?.name}</h1>
                        {/* <p className="text-[0.76em] font-medium text-[#6b6b6b]">
                            Online
                        </p> */}
                    </div>
                </div>
                <IoMdMore size={24} className="cursor-pointer" />
            </div>
            {/* By adding "flex flex-col-reverse" we lost scroll animation */}
            <div
                ref={scrollRef}
                className="px-4 overflow-y-auto bg-[#dee1ff] dark:bg-black scroll-smooth h-[91vh] pt-4 pb-[4.5em] flex flex-col-reverse scrollable"
            >
                <AnimatePresence>
                    {messages.map((msg, index) => (
                        <Message
                            msg={msg}
                            user={state.auth.user.userId}
                            key={index}
                            index={index}
                            isLast={index === 0}
                            onInViewChange={setIsLastMessageInView}
                        />
                    ))}
                </AnimatePresence>
            </div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
            >
                <div className="absolute flex bg-[#fff] dark:bg-gray-800 shadow-[0_2px_10px] shadow-black/50 rounded-2xl text-black justify-between pr-2 pl-5 gap-1 items-center bottom-4 w-[80%]">
                    <ImAttachment
                        size={18}
                        className="cursor-pointer dark:text-[#626fff]"
                    />
                    <form className="w-full" onSubmit={sendMessage}>
                        <input
                            ref={msgRef}
                            className="dark:text-white w-full outline-none h-[3.4em] placeholder:text-gray-600 dark:placeholder:text-gray-400 px-2"
                            type="text"
                            onChange={handleTyping}
                            placeholder="Type a message"
                        />
                    </form>
                    <div
                        onClick={() => sendMessage()}
                        className="bg-[#bec3ff] perspective-normal dark:bg-[#9ca5ff] dark:text-black cursor-pointer py-2 pl-2.5 pr-1.5 rounded-[12px]"
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
            </motion.div>

            {/* bottom button */}
            <motion.div
                initial={isLastMessageInView ? { scale: 1 } : { scale: 0 }}
                animate={isLastMessageInView ? { scale: 0 } : { scale: 1 }}
                onClick={scrollToBottom}
                className="absolute cursor-pointer bg-white dark:bg-gray-800 dark:text-[#9ca5ff] bottom-[5em] rounded-2xl shadow-[0_2px_10px] shadow-black right-10 p-2"
            >
                <MdKeyboardDoubleArrowDown size={26} />
            </motion.div>
        </section>
    );
};

export default Chat;
