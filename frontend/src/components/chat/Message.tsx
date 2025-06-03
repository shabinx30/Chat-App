import { motion } from "framer-motion";

const Message = ({ index, style, data }: any) => {
    const { messages, user } = data;

    return (
        <motion.div style={style} className="md:px-2 my-0.5">
            <div
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
                            ? "bg-[#b0ff62] pr-[3.2em]"
                            : "bg-[#fff] dark:bg-[#1d1d1d] pr-[3.4em]"
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
                            user === messages[index].from
                                ? ""
                                : "dark:text-white"
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
