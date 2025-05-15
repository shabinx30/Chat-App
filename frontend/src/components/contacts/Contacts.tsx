import Contact from "./Contact";
import { IoMdSettings } from "react-icons/io";

const Contacts = () => {

    const arr = new Array(30).fill(0);

    return (
        <section className="flex-1 bg-[#ffffff] text-black ">
            <div className="block h-[21vh]">
                <div className="mx-4 h-[4em] flex justify-between items-center">
                    <h1 className="font-bold text-3xl text-[#626fff]">Chat</h1>
                    <div className="bg-[#bec3ff] cursor-pointer p-2 rounded-[12px]">
                        <IoMdSettings size={24} />
                    </div>
                </div>
                <div className="flex justify-center mt-[2em] mb-[1em]">
                    <input
                        className="border border-[#8892ff] bg-[#eff0ff] rounded-2xl w-[94%] outline-none px-4 py-2 placeholder:text-[#818bff]"
                        type="text"
                        placeholder="Search"
                    />
                </div>
            </div>
            <div className="overflow-y-scroll bg-[#fff] px-4 text-white scroll-smooth h-[79vh] scrollable">
                {arr.map((_, index) => (
                    <Contact key={index} data={index}/>
                ))}
            </div>
        </section>
    );
};

export default Contacts;
