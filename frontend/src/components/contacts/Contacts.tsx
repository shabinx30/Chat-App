import Contact from "./Contact";
import { LuSettings } from "react-icons/lu";
import { GoPlus } from "react-icons/go";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState } from "../../redux/store";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import debounce from "../../libs/debouncer";
import { motion } from "framer-motion";

//function type
interface AddContactType {
    change: string;
    setPop: React.Dispatch<React.SetStateAction<boolean>>;
    setSett: React.Dispatch<React.SetStateAction<boolean>>;
}

//type for member
interface membersType extends Document {
    userId: {
        _id: string;
        name: string;
        profile: string;
    };
}

//for ctc
interface ctcType {
    _id: string;
    userId: string;
    members: membersType[];
    isGroup: boolean;
    lastMessageAt: Date;
}

interface typing {
    isTyping: boolean;
    chatId: string;
}

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const Contacts = ({ change, setPop, setSett }: AddContactType) => {
    const [ctc, setCtc] = useState<ctcType[]>([]);
    const [onUsers, setOnUsers] = useState<Set<string>>(new Set());
    const [chatMsg, setChatMsg] = useState<string>("");
    const state = useTypedSelector((state) => state);

    const { socket } = useAppContext();
    const { chatId } = useParams();

    const { VITE_BASE_URL } = import.meta.env;
    const userData = {
        userId: state.auth.user.userId,
    };

    useEffect(() => {
        setCtc([]);
        const getContacts = () => {
            axios
                .post(`${VITE_BASE_URL}/api/chat/getcontacts`, userData)
                .then((res) => {
                    for (let con of res.data.chat) {
                        setCtc((p) => [con, ...p]);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        };
        getContacts();
        socket.on("online", (res) => {
            setOnUsers(new Set(res));
        });
        socket.on("chat message", (message) => {
            // console.log(message);
            setChatMsg(message.tosChat);
        });
    }, [change]);

    const searchRef = useRef<HTMLInputElement>(null);

    const searchContact = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        console.log(value);
        const data = {
            value: value,
            userId: state.auth.user.userId,
        };
        axios
            .post(`${VITE_BASE_URL}/api/chat/searchcontacts`, data)
            .then((res) => {
                setCtc([]);
                for (let con of res.data.chat) {
                    setCtc((p) => [con, ...p]);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const debouncedSearch = useCallback(debounce(searchContact, 750), []);

    const [isTyping, setTyping] = useState<typing>();

    useEffect(() => {
        socket.on("typing", (res) => {
            setTyping({ isTyping: res.typing, chatId: res.chatId });
        });
    });

    return (
        <motion.section
            initial={{ opacity: 1, transition: { duration: 0 } }}
            animate={chatId && window.innerWidth <= 768 && { opacity: 0 }}
            transition={{
                duration: 0.65,
            }}
            className={`${
                chatId
                    ? setTimeout(() => "hidden md:block", 1000)
                    : "flex-1 md:flex-none"
            } bg-[#ffffff] w-full h-[100vh] relative md:min-w-[30.8%] md:max-w-[60%] lg:overflow-auto lg:resize-x dark:bg-gray-900 text-black dark:border-r border-[#282828]`}
        >
            <div className="absolute h-[21vh] w-full z-10 bg-[#ffffff] dark:bg-[#121212]">
                <div className="mx-4 h-[4em] flex justify-between items-center">
                    <h1 className="font-bold text-3xl dark:text-[#fff] text-[#000] leading-tight tracking-tight select-none">
                        Convo
                    </h1>
                    <div
                        onClick={() => setSett(true)}
                        className="bg-[#b0ff62] dark:text-black cursor-pointer p-1.5 rounded-[15px]"
                    >
                        <LuSettings size={24} />
                    </div>
                </div>
                <div className="flex justify-center mt-[2em] mb-2">
                    <input
                        ref={searchRef}
                        onChange={debouncedSearch}
                        className="bg-[#e6ffcb] dark:bg-[#2b2b2b] dark:text-white rounded-4xl w-[90%] outline-none px-4 py-2 dark:placeholder:text-[#e8ffd291]"
                        type="text"
                        placeholder="Search"
                    />
                </div>
                {/* <div className="flex justify-center">
                    <ul className="flex gap-4 bg-[#2b2b2b] pt-1 py-1.5 px-4 rounded-2xl text-sm font-semibold cursor-pointer dark:text-[#e8ffd291]">
                        <li>All</li>
                        <li>Unread</li>
                    </ul>
                </div> */}
            </div>
            <div className="overflow-y-scroll bg-[#fff] dark:bg-[#121212] px-4 text-white h-[79vh] mt-[21vh] scroll-smooth scrollable">
                {ctc && !ctc.length ? (
                    <div className="flex h-[20em] justify-center items-center">
                        <div className="text-center flex flex-col gap-2 font-semibold">
                            <div>
                                <span className=""></span>No Contacts
                            </div>
                            <p className="text-base text-[#e1ffc283]">
                                Tap the plus to add new contacts
                            </p>
                        </div>
                    </div>
                ) : (
                    ctc?.map((item, index) => (
                        <Contact
                            key={index}
                            userId={state.auth.user.userId}
                            onUsers={onUsers}
                            chatMsg={chatMsg}
                            chatId={chatId}
                            data={item}
                            isTyping={isTyping}
                        />
                    ))
                )}
                <div
                    onClick={() => setPop(true)}
                    className="absolute cursor-pointer text-black rounded-[22px] p-1.5 shadow-[0_1px_10px] shadow-black/40 bg-[#b0ff62] bottom-8 right-8"
                >
                    <GoPlus size={40} />
                </div>
            </div>
        </motion.section>
    );
};

export default Contacts;
