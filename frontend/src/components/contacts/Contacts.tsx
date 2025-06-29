import Contact from "./Contact";
import { LuSettings, LuSearch } from "react-icons/lu";
import { GoPlus } from "react-icons/go";
import { useRef, useState } from "react";
import { useTypedSelector } from "../../redux/store";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import useContacts from "../../hooks/contacts/useGetContacts";
import useSearchCtc from "../../hooks/contacts/useSearchCtc";
import useTyping from "../../hooks/useTyping";
import type { ctcType, ContactType } from "../../types/contacts";


const Contacts = ({ change, setPop, setSett }: ContactType) => {
    const state = useTypedSelector((state) => state);
    const [ctc, setCtc] = useState<ctcType[]>([]);
    const { chatId } = useParams();
    const userId = state.auth?.user?.userId;
    const searchRef = useRef<HTMLInputElement>(null);

    // fecth contacts
    const { onUsers, chatMsg } = useContacts({ setCtc, userId, change });

    // constact searching
    const debouncedSearch = useSearchCtc({ setCtc, userId });

    // typing event
    const isTyping = useTyping();

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
            } bg-[#ffffff] w-full h-[100vh] relative md:w-[30.8%] md:min-w-[30.8%] md:max-w-[60%] lg:overflow-auto lg:resize-x dark:bg-gray-900 text-black dark:border-r border-[#282828]`}
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
                <div className="mt-[2em] mb-2 px-4">
                    <div className="flex justify-evenly gap-2 px-4 items-center bg-[#e6ffcb] dark:bg-[#2b2b2b] rounded-4xl">
                        <LuSearch size={20} className="dark:text-[#747e6a]" />
                        <input
                            ref={searchRef}
                            onChange={debouncedSearch}
                            className="dark:text-white outline-none py-2 dark:placeholder:text-[#747e6a] w-full"
                            type="text"
                            placeholder="Search"
                        />
                    </div>
                </div>
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
                            userId={state.auth?.user?.userId}
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
