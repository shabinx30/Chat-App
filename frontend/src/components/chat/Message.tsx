interface Msg {
    data: number;
}

const Message = ({ data }: Msg) => {
    return (
        <div className="px-2 my-0.5">
            <div
                className={`flex ${data > 0 ? "justify-end" : "justify-start"}`}
            >
                <div className="relative bg-[#fff] dark:bg-[#b1b7ff] text-black rounded-lg pl-2 pt-1 pb-2.5 pr-[3em]">
                    <p className="text-base">Hello</p>
                    <div className=" absolute text-[#666666] dark:text-[#353535] right-1 bottom-0.5 text-[0.65em]">
                        <p>10:38 pm</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;
