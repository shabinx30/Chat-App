import { LuSendHorizontal } from "react-icons/lu";
import { ImAttachment } from "react-icons/im";
import { IoMdMore } from "react-icons/io";

import Message from "./Message";

const Chat = () => {
    const arr = new Array(30).fill(0);

    const Random = () => {
        return Math.floor(Math.random() * 10) % 2 == 0;
    };

    return (
        <section className="hidden md:block flex-1/3 relative bg-[#dee1ff]">
            <div className="flex bg-[#fff] text-[#000000] items-center py-4 px-2 justify-between top-0 w-[100%] h-[8.5vh]">
                <div className="flex items-center gap-2 px-4">
                    <img className="w-[3em]" src="/user.png" alt="poda" />
                    <div>
                        <h1 className="font-semibold">Ramu kuttan</h1>
                        <p className="text-[0.76em] font-medium text-[#6b6b6b]">Online</p>
                    </div>
                </div>
                <IoMdMore size={24} />
            </div>
            <div className="px-4 overflow-y-scroll bg-[#dee1ff] scroll-smooth h-[90vh] pt-4 pb-[3.5em] scrollable">
                {arr.map((_, index) =>
                    Random() ? (
                        <Message key={index} data={1} />
                    ) : (
                        <Message key={index} data={-1} />
                    )
                )}
            </div>
            <div className="flex justify-center ">
                <div className="absolute flex bg-[#fff] shadow-[0_2px_10px] shadow-black/50 rounded-2xl text-black justify-between pr-2 pl-5 gap-1 items-center bottom-2 w-[80%]">
                    <ImAttachment size={18} />
                    <input
                        className="w-full outline-none h-[3em] placeholder:text-gray-600 px-2"
                        type="text"
                        placeholder="Type a message"
                    />
                    <div className="bg-[#bec3ff] py-2 pl-2.5 pr-1.5 rounded-[12px]">
                        <LuSendHorizontal size={22} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Chat;
