import Contact from "./Contact";
import { LuSettings } from "react-icons/lu";
import { GoPlus } from "react-icons/go";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState } from "../../redux/store";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

//function type
interface AddContactType {
    change: string;
    setPop: React.Dispatch<React.SetStateAction<boolean>>;
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

function debounce(func: (...args: any[]) => void, delay: number) {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (...args: any[]) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const Contacts = ({ change, setPop }: AddContactType) => {
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
            console.log(message);
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

    const debouncedSearch = useCallback(debounce(searchContact, 500), []);

    return (
        <section
            className={`${
                chatId ? "hidden md:block md:flex-1" : "flex-1"
            } bg-[#ffffff] h-[100dvh] relative dark:bg-gray-900 text-black dark:border-r border-gray-800`}
        >
            <div className="block h-[21vh]">
                <div className="mx-4 h-[4em] flex justify-between items-center">
                    <h1 className="font-bold text-3xl text-[#626fff]">Chat</h1>
                    <div className="bg-[#bec3ff] dark:bg-[#9ca5ff] dark:text-black cursor-pointer p-2 rounded-2xl">
                        <LuSettings size={24} />
                    </div>
                </div>
                <div className="flex justify-center mt-[2em] mb-[1em]">
                    <input
                        ref={searchRef}
                        onChange={debouncedSearch}
                        className="border border-[#8892ff] bg-[#eff0ff] dark:border-[#414678] dark:bg-gray-800 dark:text-white rounded-2xl w-[94%] outline-none px-4 py-2 placeholder:text-[#818bff]"
                        type="text"
                        placeholder="Search"
                    />
                </div>
            </div>
            <div className="overflow-y-scroll bg-[#fff] dark:bg-gray-900 px-4 text-white scroll-smooth h-[79vh] scrollable">
                {ctc && !ctc.length ? (
                    <div className="flex h-[20em] justify-center items-center">
                        <div className="text-center flex flex-col gap-2 font-semibold">
                            <div><span className=""></span>No Contacts</div>
                            <p className="text-base text-[#72759c]">Tap the plus to add new contacts</p>
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
                        />
                    ))
                )}
                <div
                    onClick={() => setPop(true)}
                    className="absolute cursor-pointer text-black rounded-[22px] p-1.5 bg-[#9ca5ff] bottom-8 right-8"
                >
                    <GoPlus size={40} />
                </div>
            </div>
        </section>
    );
};

export default Contacts;
