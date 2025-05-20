import Contact from "./Contact";
import { IoMdSettings } from "react-icons/io";
import { GoPlus } from "react-icons/go";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState } from "../../redux/store";

//function type
interface AddContactType {
    isPop: boolean;
    setPop: React.Dispatch<React.SetStateAction<boolean>>;
}

//type for member
interface membersType extends Document {
    userId: {
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

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const Contacts = ({ isPop, setPop }: AddContactType) => {
    const [ctc, setCtc] = useState<ctcType[]>([]);
    const state = useTypedSelector((state) => state);

    const set = new Set()

    const userData = {
        userId: state.auth.user.userId,
    };

    useEffect(() => {
        const getContacts = () => {
            axios
                .post(
                    `${import.meta.env.VITE_BASE_URL}/api/chat/getcontacts`,
                    userData
                )
                .then((res) => {
                    console.log(res.data);
                    for (let con of res.data.chat) {
                        if(!set.has(con.userId)) {
                            setCtc((p) => [...p, con]);
                            set.add(con.userId)
                        }
                    }
                    // console.log(ctc)
                })
                .catch((error) => {
                    console.log(error);
                });
        };
        getContacts()
    }, [isPop]);

    useEffect(() => {
        console.log("from use effect", ctc);
    }, [ctc]);

    return (
        <section className="flex-1 bg-[#ffffff] relative dark:bg-gray-800 text-black ">
            <div className="block h-[21vh]">
                <div className="mx-4 h-[4em] flex justify-between items-center">
                    <h1 className="font-bold text-3xl text-[#626fff]">Chat</h1>
                    <div className="bg-[#bec3ff] dark:bg-[#b1b7ff] dark:text-black cursor-pointer p-2 rounded-[12px]">
                        <IoMdSettings size={24} />
                    </div>
                </div>
                <div className="flex justify-center mt-[2em] mb-[1em]">
                    <input
                        className="border border-[#8892ff] bg-[#eff0ff] dark:border-[#414678] dark:bg-gray-700 dark:text-white rounded-2xl w-[94%] outline-none px-4 py-2 placeholder:text-[#818bff]"
                        type="text"
                        placeholder="Search"
                    />
                </div>
            </div>
            <div className="overflow-y-scroll bg-[#fff] dark:bg-gray-800 px-4 text-white scroll-smooth h-[79vh] scrollable">
                {ctc && !ctc.length ? (
                    <div></div>
                ) : (
                    ctc?.map((item, index) => (
                        <Contact key={index} data={item} />
                    ))
                )}
                <div
                    onClick={() => setPop(true)}
                    className="absolute cursor-pointer text-black rounded-[12px] p-1 bg-[#b1b7ff] bottom-8 right-8"
                >
                    <GoPlus size={40} />
                </div>
            </div>
        </section>
    );
};

export default Contacts;
