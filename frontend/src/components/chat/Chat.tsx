import { LuSendHorizontal } from "react-icons/lu";
import { ImAttachment } from "react-icons/im";
import { IoMdMore } from "react-icons/io";

import Message from "./Message";
import { MdOutlineAccountCircle } from "react-icons/md";

const Chat = () => {
    const arr = new Array(30).fill(0);

    const Random = () => {
        return Math.floor(Math.random() * 10) % 2 == 0;
    };

    return (
        <section className="hidden md:block flex-1/3 relative bg-[#fff]">
            <div className="flex bg-[#fff] text-[#000000] items-center py-4 px-2 justify-between top-0 w-[100%] h-[9vh]">
                <div className="flex items-center gap-2 px-4">
                    <img className="w-[3em]" src="/user.png" alt="poda" />
                    <h1 className="font-bold">Ramu</h1>
                </div>
                <IoMdMore size={24} />
            </div>
            <div className="px-4 overflow-y-scroll bg-[#dee1ff] scroll-smooth h-[85vh] pt-4 pb-2 scrollable">
                {arr.map((_, index) =>
                    Random() ? (
                        <Message key={index} data={1} />
                    ) : (
                        <Message key={index} data={-1} />
                    )
                )}
            </div>
            <div className="absolute flex bg-[#fff] text-black justify-evenly items-center bottom-0 w-[100%]">
                <ImAttachment size={18} />
                <input
                    className="w-[84%] outline-none h-[3em] placeholder:text-gray-600 px-2"
                    type="text"
                    placeholder="Type a message"
                />
                <div className="bg-[#c3c8ff] p-2 rounded-lg">
                    <LuSendHorizontal size={22} />
                </div>
            </div>
        </section>
    );
};

export default Chat;
