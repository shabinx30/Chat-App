import { IoIosArrowBack, IoMdMore } from "react-icons/io";
import { type NavigateFunction } from "react-router-dom";
import { type chatType } from "./Chat";

interface CHType {
    chat: chatType | undefined;
    navigate: NavigateFunction;
}

const ChatHeader = ({chat, navigate}: CHType) => {
    return (
        <div className="absolute bg-gradient-to-b from-[#e6ffcb]/75 dark:from-black/75 to-transparent w-full z-10 flex justify-center pt-2">
            <nav className="flex bg-white rounded-2xl dark:border dark:shadow-none shadow-[0_1px_10px] shadow-black/40 border-[#2b2b2b] dark:bg-[#1b1b1b] w-[90%] dark:text-[#fff] text-[#000000] items-center py-3.5 px-2 justify-between top-0 right-0">
                <div className="flex items-center gap-1 md:gap-3 md:px-2">
                    <IoIosArrowBack
                        className="cursor-pointer"
                        onClick={() => navigate("/")}
                        size={30}
                    />
                    <img
                        className="object-cover min-w-[2.5em] max-h-[2.5em] rounded-full"
                        src={chat?.profile ? chat.profile : "/icons/user.png"}
                        alt={chat?.name}
                    />
                    <h1 className="font-semibold ml-2 md:m-0">{chat?.name}</h1>
                </div>
                <IoMdMore size={24} className="cursor-pointer" />
            </nav>
        </div>
    );
};

export default ChatHeader;
