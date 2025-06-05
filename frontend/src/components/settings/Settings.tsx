// import React, { type FormEvent } from "react";
import { motion } from "framer-motion";
import { useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState } from "../../redux/store";
import { RxExit } from "react-icons/rx";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/store";
import { useNavigate } from "react-router-dom";

interface settingsType {
    setSett: React.Dispatch<React.SetStateAction<boolean>>;
}

const Settings = ({ setSett }: settingsType) => {
    // const handleSubmit = (e: FormEvent) => {
    //     e.preventDefault();
    // };

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogout = () => {
        dispatch(logout())
        localStorage.removeItem('jwt')
        navigate('/login')
    }

    const selector: TypedUseSelectorHook<RootState> = useSelector;
    const state = selector((state) => state);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSett(false)}
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
                    <div className="flex justify-between">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Settings
                        </h1>
                        <div onClick={handleLogout} className="flex items-center justify-between gap-2 bg-red-400 rounded-2xl cursor-pointer px-3 pt-1 pb-1.5">
                            <h2 className="dark:text-white text-sm">Log out</h2>
                            <RxExit size={17} className="text-white" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-[3em]">
                        <div className="flex justify-between items-center">
                            <h1 className="dark:text-white font-bold text-lg">
                                {state.auth.user.name}
                            </h1>
                            <MdOutlineModeEditOutline className="cursor-pointer" size={18} />
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <label
                                    htmlFor="email"
                                    className="text-gray-500 text-sm font-semibold"
                                >
                                    Email
                                </label>
                                <h2 className="dark:text-white font-semibold">
                                    {state.auth.user.email}
                                </h2>
                            </div>
                            <MdOutlineModeEditOutline className="cursor-pointer" size={18} />
                        </div>
                        <div className="flex justify-center items-end h-[4em]">
                            <h2 className="flex items-center text-sm gap-2 bg-[#2b2b2b] w-fit rounded-2xl px-4 pt-1 pb-1.5">
                                Change password
                                <MdOutlineModeEditOutline className="cursor-pointer" size={18} />
                            </h2>
                        </div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Settings;
