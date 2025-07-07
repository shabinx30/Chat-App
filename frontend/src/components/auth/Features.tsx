import { TbMessages } from "react-icons/tb";
import { MdDevices, MdLockOutline } from "react-icons/md";
import { LuFileSpreadsheet } from "react-icons/lu";

const Features = ({ area }: { area: "login" | "signup" }) => {
    return (
        <section className="flex bg-gray-50 md:pl-6 dark:bg-black flex-col md:flex-1 justify-center items-center gap-3 pt-4 md:pt-2">
            <div className="flex items-center gap-3">
                <img
                    src="/icons/logo-small.png"
                    alt="logo"
                    className="w-8 h-8 invert dark:invert-0"
                />
                <h1 className="font-bold text-3xl dark:text-[#fff] text-[#000] leading-tight tracking-tight select-none">
                    Convo
                </h1>
            </div>
            <p className="font-semibold text-sm text-center">
                {area === "login"
                    ? "Sign in to continue chatting with your friends."
                    : "Create your account for start chatting with your friends."}
            </p>
            <ul className="hidden md:flex md:mt-8 md:flex-col gap-1 dark:gap-[5px]">
                <li className="w-[24em] justify-center py-2 rounded-t-2xl text-sm font-semibold bg-[#b0ff62] dark:bg-[#2b2b2b] flex items-center gap-2">
                    <TbMessages className="dark:text-[#b0ff62]" size={19} />
                    chat with anyone.
                </li>
                <li className="w-[24em] justify-center py-2 text-sm font-semibold bg-[#b0ff62] dark:bg-[#2b2b2b] flex items-center gap-2">
                    <LuFileSpreadsheet
                        className="dark:text-[#b0ff62]"
                        size={16}
                    />
                    share files.
                </li>
                <li className="w-[24em] justify-center py-2 text-sm font-semibold bg-[#b0ff62] dark:bg-[#2b2b2b] flex items-center gap-2">
                    <MdDevices className="dark:text-[#b0ff62]" size={17} />
                    access messages from any device.
                </li>
                <li className="w-[24em] justify-center py-2 rounded-b-2xl text-sm font-semibold bg-[#b0ff62] dark:bg-[#2b2b2b] flex items-center gap-2">
                    <MdLockOutline className="dark:text-[#b0ff62]" size={18} />
                    end to end ecrypted.
                </li>
            </ul>
        </section>
    );
};

export default Features;
