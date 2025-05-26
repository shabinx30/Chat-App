import { useEffect, useState } from "react";
import { useSelector, type TypedUseSelectorHook } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../redux/store";

//type for member
interface membersType extends Document {
    userId: {
        _id: string;
        name: string;
        profile: string;
    };
}

//type for ctc
interface ctcType {
    _id: string;
    userId: string;
    members: membersType[];
    isGroup: boolean;
    lastMessageAt: Date;
}

interface conType {
    data: ctcType;
    chatId: string | undefined;
    onUsers: Set<string>;
    chatMsg: string;
}

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const Contact = ({ data, chatId, onUsers, chatMsg }: conType) => {
    const navigate = useNavigate();
    const state = useTypedSelector((state) => state);

    const [person, setPerson] = useState<membersType>();

    useEffect(() => {
        const res = data.members.filter(
            (user) => user.userId._id != state.auth.user.userId
        )[0];
        setPerson(res);
    }, []);

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
                    ? "bg-[#e2e4ff] dark:bg-[#9ca5ff] text-black hover:bg-[#d5d8ff] hover:dark:bg-[#8b94ff]"
                    : "dark:text-[#eff0ff] hover:bg-[#eff0ff] hover:dark:bg-gray-700/50"
            } duration-200 rounded-2xl text-black flex justify-center gap-4 items-center px-4`}
        >
            <div className="relative flex items-center justify-center">
                <img
                    className="object-cover border-2 min-w-[3.5em] max-h-[3.5em] rounded-full"
                    src={`${
                        person?.userId.profile !== ""
                            ? import.meta.env.VITE_BASE_URL +
                              "/" +
                              person?.userId.profile
                            : "/user.png"
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
                <p className={`${chatId == data._id ? "font-semibold" : ""}`}>
                    {person?.userId.name}
                </p>
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
