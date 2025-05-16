import Contact from "./Contact";
import { IoMdSettings } from "react-icons/io";

const Contacts = () => {

    const arr = new Array(20).fill(0);

    return (
        <section className="flex-1 bg-[#ffffff] dark:bg-[#131313] text-black ">
            <div className="block h-[21vh]">
                <div className="mx-4 h-[4em] flex justify-between items-center">
                    <h1 className="font-bold text-3xl text-[#626fff]">Chat</h1>
                    <div className="bg-[#bec3ff] dark:bg-[#2d2d2d] dark:text-[#626fff] cursor-pointer p-2 rounded-[12px]">
                        <IoMdSettings size={24} />
                    </div>
                </div>
                <div className="flex justify-center mt-[2em] mb-[1em]">
                    <input
                        className="border border-[#8892ff] bg-[#eff0ff] dark:border-[#515795] dark:bg-[#2d2d2d] rounded-2xl w-[94%] outline-none px-4 py-2 placeholder:text-[#818bff]"
                        type="text"
                        placeholder="Search"
                    />
                </div>
            </div>
            <div className="overflow-y-scroll bg-[#fff] dark:bg-[#202020] px-4 text-white scroll-smooth h-[79vh] scrollable">
                {arr.map((_, index) => (
                    <Contact key={index} data={index}/>
                ))}
            </div>
        </section>
    );
};

export default Contacts;
