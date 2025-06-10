import { motion } from "framer-motion";
import { useLayoutEffect, useRef, useEffect } from "react";

const Message = ({ index, style, data }: any) => {
    const { messages, user, setSizeForIndex } = data;
    const ref = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (ref.current) {
            const height = ref.current.getBoundingClientRect().height;
            setSizeForIndex(index, height);
        }
    }, [messages[index].body, setSizeForIndex, index]);

    // Additional effect to handle delayed rendering and ensure accurate measurement
    useEffect(() => {
        const measureHeight = () => {
            if (ref.current) {
                const height = ref.current.getBoundingClientRect().height;
                setSizeForIndex(index, height);
            }
        };

        // Measure immediately
        measureHeight();

        // Also measure after a short delay to catch any delayed renders
        const timeoutId = setTimeout(measureHeight, 0);

        return () => clearTimeout(timeoutId);
    }, [messages[index].body, setSizeForIndex, index]);

    return (
        <motion.div style={style} className="md:px-2 my-0.5">
            <div
                ref={ref}
                className={`flex ${
                    user === messages[index].from
                        ? "justify-end"
                        : "justify-start"
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
                            ? "bg-[#b0ff62]"
                            : "bg-[#fff] dark:bg-[#1b1b1b]"
                    } ${
                        messages[index].hasMedia ? "max-w-[40%]" : "max-w-[75%]"
                    } text-black px-1 pt-1 pb-2.5`}
                >
                    {/* image */}
                    {messages[index].hasMedia &&
                        messages[index].mediaType == "image" && (
                            <img
                                className="rounded-[12px] object-cover w-full object-center aspect-square"
                                src={messages[index].media}
                                loading="lazy"
                            />
                        )}
                    {/* video */}
                    {/* {messages[index].hasMedia &&
                        messages[index].mediaType == "video" && (
                            <video controls className="rounded-[12px] object-cover w-full object-center aspect-video" src={messages[index].media}></video>
                        )} */}
                    <p
                        style={{
                            wordWrap: "break-word",
                            overflowWrap: "break-word",
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                        }}
                        className={`text-base ${
                            user === messages[index].from
                                ? "mr-[3.2em]"
                                : "dark:text-white mr-[3.4em]"
                        } ml-1.5`}
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
                            {new Date(
                                messages[index].createdAt
                            ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                            })}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Message;
