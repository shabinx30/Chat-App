import axios from "axios";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState } from "../../redux/store";
import { motion } from "framer-motion";
import { IoIosCloseCircle } from "react-icons/io";

//types
interface AddContactType {
    setPop: React.Dispatch<React.SetStateAction<boolean>>;
    setChange: React.Dispatch<React.SetStateAction<string>>;
}
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

const AddContact = ({ setPop, setChange }: AddContactType) => {
    const emailRef = useRef<HTMLInputElement>(null);
    const state = useTypedSelector((state) => state);

    // error animation
    const [isError, setError] = useState({
        status: false,
        message: "",
        divClass: "error",
    });
    const errorRef = useRef<HTMLDivElement>(null);

    //form subimission
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        try {
            if (!emailRef?.current?.value.trim()) {
                return;
            }
            const formData = {
                userId: state.auth.user.userId,
                member: emailRef.current?.value,
                isGroup: false,
            };

            axios
                .post(
                    `${import.meta.env.VITE_BASE_URL}/api/chat/addcontact`,
                    formData
                )
                .then((res) => {
                    if (res.data.message == "success") {
                        if (emailRef.current) {
                            setChange(String(emailRef.current.value));
                        }
                        setPop(false);
                    }
                })
                .catch((error) => {
                    if (
                        error.response?.data?.message == "User is not existing"
                    ) {
                        showError("Cannot find the user!");
                    }
                    showError(error.response?.data?.message)
                    console.error(error);
                });
        } catch (error) {
            console.log(error);
        }
    };

    //show the error
    const showError = (message: string) => {
        setError({
            status: true,
            message,
            divClass: "error",
        });
    };

    useEffect(() => {
        if (errorRef.current) {
            const div = errorRef.current;
            div.style.animation = "errorS 0.5s ease forwards";

            setTimeout(() => {
                div.style.animation = "errorF 0.5s ease forwards";
            }, 3000);

            setTimeout(() => {
                setError((prev) => ({ ...prev, status: false }));
            }, 3500);
        }
    }, [isError]);

    return (
        <>
            {isError.status && (
                <div className="w-full z-40 fixed flex justify-center items-center">
                    <div ref={errorRef} className={isError.divClass}>
                        <IoIosCloseCircle
                            size={35}
                            className="text-red-500 mt-0.5 ml-0.5"
                        />
                        <p>{isError.message}</p>
                    </div>
                </div>
            )}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setPop(false)}
                className="absolute z-30 bg-[#000]/25 backdrop-blur-[8px] w-screen h-screen flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
            >
                <motion.div
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    exit={{ y: 50 }}
                    transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 25,
                        duration: 0.8,
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full bg-white rounded-3xl shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#1b1b1b]/50 dark:border-[#2b2b2b]"
                >
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8 text-gray-900 dark:text-white">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Add a Contact
                        </h1>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-8"
                        >
                            <div>
                                <label htmlFor="email">Enter email</label>
                                <input
                                    ref={emailRef}
                                    id="email"
                                    type="email"
                                    placeholder="Alice@gmail.com"
                                    className="bg-gray-50 border mt-2 border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-[#2b2b2b] dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setPop(false)}
                                    type="button"
                                    className="cursor-pointer w-full text-white dark:text-black bg-[#3d3d3d] dark:bg-[#d3d3d3] outline-none duration-200 font-medium rounded-2xl text-sm px-5 py-2.5 text-center"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="cursor-pointer w-full text-black bg-[#b0ff62] font-medium rounded-2xl text-sm px-5 py-2.5 text-center"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </motion.div>
        </>
    );
};

export default AddContact;
