import { LuSendHorizontal } from "react-icons/lu";
import { ImAttachment } from "react-icons/im";
import { IoMdMore } from "react-icons/io";

import Message from "./Message";

const arr = new Array(30).fill(0);

const Random = () => {
    return (Math.floor(Math.random() * 10)) % 2 == 0;
};

const Chat = () => {
    return (
        <section className="hidden md:block flex-1/3 relative bg-white">
            <div className="flex items-center py-4 px-2 justify-between top-0 w-[100%] h-[8vh] border-b border-black">
                <h1 className="font-bold">Ramu</h1>
                <IoMdMore size={24} className="text-black" />
            </div>
            <div className="px-4 overflow-y-scroll scroll-smooth h-[84vh] scrollable">
                {arr.map((_, index) =>
                    Random() ? <Message key={index} data={1} /> : <Message key={index} data={-1} />
                )}
            </div>
            <div className="absolute flex bg-white justify-evenly items-center bottom-0 w-[100%] border-t border-black">
                <ImAttachment size={18} className="text-black" />
                <input
                    className="w-[84%] text-black outline-none h-[3em] placeholder:text-gray-400 px-2"
                    type="text"
                    placeholder="Type a message"
                />
                <LuSendHorizontal size={22} className="text-black" />
            </div>
        </section>
    );
};

export default Chat;
