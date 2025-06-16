import { motion } from "framer-motion";
import { useRef } from "react";
import { type Msg } from "./Chat";

interface MSG {
    message: Msg;
    user: string
}


const Message = ({ message, user }: MSG) => {
    const ref = useRef<HTMLDivElement>(null);

    return (
        <>
            <motion.div className="md:px-2 my-0.5">
                <div
                    ref={ref}
                    className={`flex ${
                        user === message.from
                            ? "justify-end"
                            : "justify-start"
                    }`}
                >
                    <div
                        style={
                            user === message.from
                                ? { borderRadius: "14px 14px 0 14px" }
                                : { borderRadius: "14px 14px 14px 0" }
                        }
                        className={`relative ${
                            user === message.from
                                ? "bg-[#b0ff62]"
                                : "bg-[#fff] dark:bg-[#1b1b1b]"
                        } ${
                            message.hasMedia
                                ? "max-w-[75%] md:max-w-[40%]"
                                : "max-w-[75%]"
                        } text-black px-1 pt-1 pb-2.5`}
                    >
                        {/* image */}
                        {message.hasMedia &&
                            message.mediaType == "image" && (
                                <img
                                    className={`rounded-[12px] object-cover w-full object-center ${!message.body && "mb-2"} aspect-square`}
                                    src={message.media}
                                    loading="lazy"
                                />
                            )}
                        {/* video */}
                        {/* {message.hasMedia &&
                        message.mediaType == "video" && (
                            <video controls className="rounded-[12px] object-cover w-full object-center aspect-video" src={message.media}></video>
                        )} */}
                        <p
                            style={{
                                wordWrap: "break-word",
                                overflowWrap: "break-word",
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                            }}
                            className={`text-base ${
                                user === message.from
                                    ? "mr-[3.2em]"
                                    : "dark:text-white mr-[3.4em]"
                            } ml-1.5`}
                        >
                            {message.body}
                        </p>
                        <div
                            className={`absolute ${
                                user === message.from
                                    ? "text-[#434343] dark:text-[#5f5f5f] right-1"
                                    : "text-[#666666] dark:text-[#777777] right-2"
                            } text-[#666666] dark:text-[#353535] bottom-0.5 text-[0.65em]`}
                        >
                            <p>
                                {new Date(
                                    message.createdAt
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
        </>
    );
};

export default Message;
