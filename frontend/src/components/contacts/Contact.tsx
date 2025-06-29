import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { conType, membersType } from "../../types/contacts";


const Contact = ({
    userId,
    data,
    chatId,
    onUsers,
    chatMsg,
    isTyping,
}: conType) => {
    const navigate = useNavigate();

    const [person, setPerson] = useState<membersType>();

    useEffect(() => {
        const res = data.members.filter((user) => user.userId._id != userId)[0];
        setPerson(res);
    });

    const getTime = (date: number | Date = data.lastMessageAt) => {
        return new Date(date).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div
            onClick={() => navigate(`/chat/${data._id}`)}
            className={`w-full h-[4.5em] ${
                chatId == data._id
                    ? "md:bg-[#c5ff87] md:dark:bg-[#b0ff62] md:text-black md:hover:bg-[#e8ffd0] md:hover:dark:bg-[#b0ff62]"
                    : "dark:text-[#eff0ff] hover:bg-[#f0ffe0] hover:dark:bg-[#282828]"
            } duration-200 rounded-4xl select-none text-black flex justify-center gap-4 items-center px-3`}
        >
            <div className="relative flex items-center justify-center">
                <img
                    className={`object-cover ${
                        !person?.userId.profile && "dark:invert"
                    } min-w-[3.5em] max-h-[3.5em] rounded-full`}
                    src={`${
                        person?.userId.profile !== ""
                            ? person?.userId.profile
                            : "/icons/user.png"
                    }`}
                    alt={person?.userId.name}
                />
                {onUsers.has(person?.userId._id || "") && (
                    <span className="absolute border-[3px] border-white dark:border-black bg-green-400 w-3.5 h-3.5 right-0 bottom-0 rounded-full"></span>
                )}
            </div>
            <div
                className={`font-normal h-[90%] flex justify-between items-center w-full`}
            >
                <div className="flex flex-col">
                    <p className={chatId == data._id ? "md:font-semibold" : ""}>
                        {person?.userId.name}
                    </p>
                    <AnimatePresence>
                        {data._id == isTyping?.chatId &&
                            isTyping.isTyping &&
                            chatId != data._id && (
                                <motion.p
                                    key="typing"
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`text-sm font-semibold text-[#b0ff62]`}
                                >
                                    Typing...
                                </motion.p>
                            )}
                    </AnimatePresence>
                </div>
                {chatMsg == data._id ? (
                    <p
                        className={`${
                            chatId == data._id ? "text-black" : "text-gray-400"
                        } text-[0.8em] select-none`}
                    >
                        {getTime(Date.now())}
                    </p>
                ) : (
                    <p
                        className={`${
                            chatId == data._id ? "text-black" : "text-gray-400"
                        } text-[0.8em] select-none`}
                    >
                        {getTime()}
                    </p>
                )}
            </div>
        </div>
    );
};

export default Contact;
