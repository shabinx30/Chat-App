interface Msg {
    msg: {
        body: string;
        createdAt: number;
        from: string;
    };
    user: string;
}

const Message = ({ msg, user }: Msg) => {

    const getTime = () => {
        return new Date(msg.createdAt).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div className="px-2 my-0.5">
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
                    } text-black rounded-lg pl-2 pt-1 pb-2.5 pr-[3em] `}
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
                        <p>{getTime()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;
