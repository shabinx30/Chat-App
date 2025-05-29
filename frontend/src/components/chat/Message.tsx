import { useRef, useEffect } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";

interface Msg {
    msg: {
        body: string;
        createdAt: number;
        from: string;
    };
    user: string;
    index: number;
    isLast?: boolean;
    onInViewChange?: (inView: boolean) => void;
}

const Message = ({ msg, user, isLast, onInViewChange }: Msg) => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { amount: 1 });

    // Notify parent when visibility changes
    useEffect(() => {
        if (isLast && onInViewChange) {
            onInViewChange(isInView);
        }
    }, [isInView, isLast, onInViewChange]);

    return (
        <AnimatePresence>
            <motion.div
                ref={isLast ? ref : null}
                className="px-2 my-0.5"
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div
                    className={`flex ${
                        user == msg.from ? "justify-end" : "justify-start"
                    }`}
                >
                    <div
                        className={`relative ${
                            user == msg.from
                                ? "bg-[#9ca5ff]"
                                : "bg-[#fff] dark:bg-gray-800"
                        } text-black rounded-lg pl-2 pt-1 pb-2.5 pr-[3em]`}
                    >
                        <p
                            className={`text-base ${
                                user == msg.from ? "" : "dark:text-white"
                            }`}
                        >
                            {msg.body}
                        </p>
                        <div
                            className={`absolute ${
                                user == msg.from
                                    ? "text-[#434343] dark:text-[#5f5f5f]"
                                    : "text-[#666666] dark:text-[#777777]"
                            } text-[#666666] dark:text-[#353535] right-1 bottom-0.5 text-[0.65em]`}
                        >
                            <p>
                                {new Date(msg.createdAt).toLocaleTimeString(
                                    "en-US",
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                    }
                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Message;
