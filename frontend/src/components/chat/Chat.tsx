import { LuSendHorizontal } from "react-icons/lu";
import { ImAttachment } from "react-icons/im";
import { IoMdMore } from "react-icons/io";
import Message from "./Message";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";
import { io, Socket } from "socket.io-client";
import { menuContext } from "./menuContext";
import axios from "axios";

interface PosType {
    visible: boolean;
    x: number;
    y: number;
}

// Define type for messages
type Message = string;

// Define socket type
let socket: Socket;

const Chat = () => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    // const arr = new Array(30).fill(0);
    const [chat, setChat] = useState<Message[]>([]);

    const Random = () => {
        return Math.floor(Math.random() * 10) % 2 == 0;
    };

    // Scroll to the bottom (latest message) when the component mounts
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, []);

    const [pos, setPos] = useState<PosType>({ visible: false, x: 0, y: 0 });
    const menuRef = useRef<HTMLUListElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleClick = () => {
        if (pos.visible == false) {
            return;
        }
        setPos((prev) => ({ ...prev, visible: false }));
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setPos((prev) => ({ ...prev, visible: false }));
            }
        };
        document.addEventListener("click", handleOutsideClick);
        return () => document.removeEventListener("click", handleOutsideClick);
    }, []);

    const navigate = useNavigate();

    const msgRef = useRef<HTMLInputElement>(null);

    let apiUrl = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        socket = io(apiUrl);

        socket.on("chat message", (msg: Message) => {
            setChat((prev) => [...prev, msg]);
        });

        return () => {
            socket.off("chat message");
            socket.disconnect();
        };
    }, []);

    const sendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (msgRef.current?.value.trim()) {
            socket.emit("chat message", msgRef.current?.value);
            msgRef.current.value = "";
        }
    };

    // const [user, setUser] = useState({})

    const { chatId } = useParams();
    useEffect(() => {
        axios.post(`${apiUrl}/api/message/getmessages`, chatId)
        .then(res => {
            console.log(res.data)
        })
        .catch(error => {
            console.log(error)
        })
    },[])

    return (
        <section
            ref={containerRef}
            onClick={handleClick}
            onContextMenu={(e) =>
                menuContext({ e, containerRef, setPos, menuRef })
            }
            className="hidden md:block flex-1/3 relative bg-[#dee1ff] dark:bg-[#131313]"
        >
            <div className="flex bg-[#fff] dark:bg-gray-800 dark:text-[#fff] text-[#000000] items-center py-4 px-2 justify-between top-0 w-[100%] h-[8.5vh]">
                <div className="flex items-center gap-2 px-4">
                    <img
                        className="w-[3em] rounded-full"
                        src="/tate.jpeg"
                        alt="poda"
                    />
                    <div>
                        <h1 className="font-normal">Ramu kuttan</h1>
                        <p className="text-[0.76em] font-medium text-[#6b6b6b]">
                            Online
                        </p>
                    </div>
                </div>
                <IoMdMore size={24} className="cursor-pointer" />
            </div>
            {/* By adding "flex flex-col-reverse" we lost scroll animation */}
            <div
                ref={scrollRef}
                className="px-4 overflow-y-auto bg-[#dee1ff] dark:bg-gray-900 scroll-smooth h-[91vh] pt-4 pb-[4.5em] flex flex-col-reverse scrollable"
            >
                {chat.map((_, index) =>
                    Random() ? (
                        <Message key={index} data={1} />
                    ) : (
                        <Message key={index} data={-1} />
                    )
                )}
            </div>
            <div className="flex justify-center ">
                <div className="absolute flex bg-[#fff] dark:bg-gray-800 shadow-[0_2px_10px] shadow-black/50 rounded-2xl text-black justify-between pr-2 pl-5 gap-1 items-center bottom-4 w-[80%]">
                    <ImAttachment
                        size={18}
                        className="cursor-pointer dark:text-[#626fff]"
                    />
                    <form className="w-full" onSubmit={sendMessage}>
                        <input
                            ref={msgRef}
                            className="dark:text-white w-full outline-none h-[3em] placeholder:text-gray-600 dark:placeholder:text-gray-400 px-2"
                            type="text"
                            placeholder="Type a message"
                        />
                    </form>
                    <div className="bg-[#bec3ff] dark:bg-[#b1b7ff] dark:text-black cursor-pointer py-2 pl-2.5 pr-1.5 rounded-[12px]">
                        <LuSendHorizontal size={22} />
                    </div>
                </div>
            </div>
            {pos.visible && (
                <ul
                    onClick={(e) => e.stopPropagation()}
                    ref={menuRef}
                    className="absolute bg-white dark:bg-gray-800 rounded-2xl shadow-[0_2px_10px] shadow-black/50"
                    style={{
                        top: `${pos.y}px`,
                        left: `${pos.x}px`,
                    }}
                >
                    <li
                        onClick={() => navigate("/")}
                        className="dark:text-white py-2 px-4 cursor-pointer flex gap-1.5 justify-center items-center"
                    >
                        <IoCloseCircleOutline
                            size={18}
                            className="text-red-400"
                        />
                        <p>Close chat</p>
                    </li>
                </ul>
            )}
        </section>
    );
};

export default Chat;
