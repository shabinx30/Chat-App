import React, { type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState } from "../../redux/store";
import { RxExit } from "react-icons/rx";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/store";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { unRegister } from "../../utils/push";

type settingsType = React.Dispatch<React.SetStateAction<boolean>>;

const Settings = ({ setSett }: { setSett: settingsType }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isEdit, setEdit] = useState({
        name: false,
        email: false,
    });

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem("jwt");
        unRegister();
        navigate("/login");
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
    };

    const selector: TypedUseSelectorHook<RootState> = useSelector;
    const state = selector((state) => state);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSett(false)}
            className="absolute z-[60] bg-[#000]/25 backdrop-blur-[8px] w-screen h-screen flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
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
                <div
                    onClick={() => setEdit({ name: false, email: false })}
                    className="p-6 space-y-4 md:space-y-6 sm:p-8 text-gray-900 dark:text-white"
                >
                    <div className="flex justify-between">
                        <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                            Settings
                        </h1>
                        <div
                            onClick={handleLogout}
                            className="flex items-center justify-between gap-2 bg-red-400 rounded-2xl cursor-pointer px-3 pt-1 pb-1.5"
                        >
                            <h2 className="dark:text-white text-sm">Log out</h2>
                            <RxExit size={17} />
                        </div>
                    </div>
                    <div className="mt-[2em]">
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-2"
                        >
                            <div className="relative flex justify-center group w-fit cursor-pointer">
                                <MdOutlineModeEditOutline
                                    className="absolute opacity-0 self-center group-hover:opacity-100 z-20 "
                                    size={18}
                                />
                                <img
                                    className="z-10 w-[5em] rounded-full brightness-100 group-hover:brightness-75 dark:group-hover:brightness-50 duration-150"
                                    src={state.auth.user.profile}
                                    alt="user"
                                />
                            </div>
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEdit((p) => ({ ...p, name: true }));
                                }}
                                className="flex justify-between items-center"
                            >
                                {isEdit.name ? (
                                    <input
                                        className="font-bold text-lg bg-[#cecece] dark:bg-[#2b2b2b] w-full p-1"
                                        defaultValue={state.auth.user.name}
                                        type="text"
                                    />
                                ) : (
                                    <h1 className="dark:text-white font-bold text-lg">
                                        {state.auth.user.name}
                                    </h1>
                                )}
                                {!isEdit.name && (
                                    <MdOutlineModeEditOutline
                                        className="cursor-pointer"
                                        size={18}
                                    />
                                )}
                            </div>
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEdit((p) => ({ ...p, email: true }));
                                }}
                                className="flex justify-between items-center"
                            >
                                <div className="flex flex-col w-full">
                                    <label
                                        htmlFor="email"
                                        className="text-gray-500 text-sm font-semibold"
                                    >
                                        Email
                                    </label>
                                    {isEdit.email ? (
                                        <input
                                            id="eamil"
                                            className="bg-[#cecece] dark:bg-[#2b2b2b] font-semibold w-full p-1"
                                            defaultValue={state.auth.user.email}
                                            type="text"
                                        />
                                    ) : (
                                        <h2 className="dark:text-white font-semibold">
                                            {state.auth.user.email}
                                        </h2>
                                    )}
                                </div>
                                {!isEdit.email && (
                                    <MdOutlineModeEditOutline
                                        className="cursor-pointer"
                                        size={18}
                                    />
                                )}
                            </div>
                            <div className="flex justify-center items-end h-[4em]">
                                <h2 className="flex items-center cursor-pointer text-sm gap-2 bg-[#cecece] dark:bg-[#2b2b2b] w-fit rounded-2xl px-4 pt-1 pb-1.5">
                                    Change password
                                    <MdOutlineModeEditOutline size={18} />
                                </h2>
                            </div>
                            <div className="flex justify-center text-sm text-gray-500">
                                {state.auth.user.updatedAt}
                            </div>
                            <AnimatePresence>
                                {(isEdit.name || isEdit.email) && (
                                    <div className="flex justify-center mt-2">
                                        <motion.button
                                            type="submit"
                                            initial={{ height: 0, y: 10 }}
                                            animate={{ height: "auto", y: 0 }}
                                            exit={{ height: 0, y: 10 }}
                                            transition={{ duration: 0.1 }}
                                            className="bg-[#b0ff62] text-black w-fit px-4 pt-1 pb-1.5 rounded-2xl"
                                        >
                                            Save
                                        </motion.button>
                                    </div>
                                )}
                            </AnimatePresence>
                        </form>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Settings;
