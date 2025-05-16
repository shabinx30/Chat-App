import { LuSendHorizontal } from "react-icons/lu";
import { ImAttachment } from "react-icons/im";
import { IoMdMore } from "react-icons/io";
import Message from "./Message";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";

interface PosType {
    visible: boolean;
    x: number;
    y: number;
}

const Chat = () => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const arr = new Array(30).fill(0);

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

    const context = (e: React.MouseEvent) => {
        e.preventDefault();
        const container = containerRef.current;
        if (!container) return;

        // Get container's bounding box
        const containerRect = container.getBoundingClientRect();

        // Get menu dimensions
        const menuWidth = menuRef.current?.offsetWidth || 80; // Default width if not rendered
        const menuHeight = menuRef.current?.offsetHeight || 80; // Default height if not rendered

        // Mouse position relative to the container
        let x = e.clientX - containerRect.left;
        let y = e.clientY - containerRect.top;

        // Adjust position to keep menu within container boundaries
        if (x + menuWidth > containerRect.width) {
            x = containerRect.width - menuWidth - 2; // 2px buffer
        }
        if (y + menuHeight > containerRect.height) {
            y = containerRect.height - menuHeight - 2; // 2px buffer
        }

        // Ensure menu stays within viewport (optional, if container is smaller than viewport)
        if (x < 0) x = 2;
        if (y < 0) y = 2;

        setPos({ visible: true, x, y });
    };

    const handleClick = () => {
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

    return (
        <section
            ref={containerRef}
            onClick={handleClick}
            onContextMenu={context}
            className="hidden md:block flex-1/3 relative bg-[#dee1ff] dark:bg-[#131313]"
        >
            <div className="flex bg-[#fff] dark:bg-[#222222] dark:text-[#fff] text-[#000000] items-center py-4 px-2 justify-between top-0 w-[100%] h-[8.5vh]">
                <div className="flex items-center gap-2 px-4">
                    <img
                        className="w-[3em] dark:invert dark:contrast-25"
                        src="/user.png"
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
            {/* for removing scroll animation add "flex flex-col-reverse"  */}
            <div
                ref={scrollRef}
                className="px-4 overflow-y-auto bg-[#dee1ff] dark:bg-[#2d2d2d] scroll-smooth h-[91vh] pt-4 pb-[4.5em] flex flex-col-reverse scrollable"
            >
                {arr.map((_, index) =>
                    Random() ? (
                        <Message key={index} data={1} />
                    ) : (
                        <Message key={index} data={-1} />
                    )
                )}
            </div>
            <div className="flex justify-center ">
                <div className="absolute flex bg-[#fff] dark:bg-[#131313] shadow-[0_2px_10px] shadow-black/50 rounded-2xl text-black justify-between pr-2 pl-5 gap-1 items-center bottom-4 w-[80%]">
                    <ImAttachment
                        size={18}
                        className="cursor-pointer dark:text-[#626fff]"
                    />
                    <input
                        className="w-full dark:text-white outline-none h-[3em] placeholder:text-gray-600 dark:placeholder:text-gray-400 px-2"
                        type="text"
                        placeholder="Type a message"
                    />
                    <div className="bg-[#bec3ff] dark:bg-[#2d2d2d] dark:text-[#626fff] cursor-pointer py-2 pl-2.5 pr-1.5 rounded-[12px]">
                        <LuSendHorizontal size={22} />
                    </div>
                </div>
            </div>
            {pos.visible && (
                <ul
                    onClick={(e) => e.stopPropagation()}
                    ref={menuRef}
                    className="absolute bg-white dark:bg-[#202020] rounded-2xl shadow-md"
                    style={{
                        top: `${pos.y}px`,
                        left: `${pos.x}px`,
                    }}
                >
                    <li
                        onClick={() => navigate("/")}
                        className="text-white py-2 px-4 cursor-pointer flex gap-1.5 justify-center items-center"
                    >
                        <IoCloseCircleOutline size={18} className="text-red-400"/>
                        <p>Close chat</p>
                    </li>
                </ul>
            )}
        </section>
    );
};

export default Chat;
