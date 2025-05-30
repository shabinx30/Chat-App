import { useRef, useEffect } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";

const Message = ({ index, style, data }: any) => {
    const { messages, user, setIsLastMessageInView } = data;
    const isLast = index === (messages.length - 1);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { amount: 1 });

    // Notify parent when the last message's visibility changes
    useEffect(() => {
        if (isLast && setIsLastMessageInView) {
            setIsLastMessageInView(isInView);
        }
    }, [isInView, isLast, setIsLastMessageInView]);

    return (
        <AnimatePresence>
            <motion.div
                style={style} // Apply React Window's style prop for positioning
                // initial={{ height: 0 }}
                // animate={{ height: "auto" }}
                // exit={{ height: 0 }}
                // transition={{ duration: 0.3 }}
                ref={isLast ? ref : null}
                className="md:px-2 my-0.5"
            >
                <div
                    className={`flex ${
                        user === messages[index].from ? "justify-end" : "justify-start"
                    }`}
                >
                    <div
                        style={
                            user === messages[index].from
                                ? { borderRadius: "14px 14px 0 14px" }
                                : { borderRadius: "14px 14px 14px 0" }
                        }
                        className={`relative ${
                            user === messages[index].from
                                ? "bg-[#9ca5ff] pr-[3.2em]"
                                : "bg-[#fff] dark:bg-gray-800 pr-[3.4em]"
                        } max-w-[75%] text-black pl-2 pt-1 pb-2.5`}
                    >
                        <p
                            style={{
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                            }}
                            className={`text-base ${
                                user === messages[index].from ? "" : "dark:text-white"
                            }`}
                        >
                            {messages[index].body}
                        </p>
                        <div
                            className={`absolute ${
                                user === messages[index].from
                                    ? "text-[#434343] dark:text-[#5f5f5f] right-1"
                                    : "text-[#666666] dark:text-[#777777] right-2"
                            } text-[#666666] dark:text-[#353535] bottom-0.5 text-[0.65em]`}
                        >
                            <p>
                                {new Date(messages[index].createdAt).toLocaleTimeString("en-US", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default Message;