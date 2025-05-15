import Contact from "./Contact";

const Contacts = () => {
    return (
        <section className="flex-1 bg-[#ffffff] text-black ">
            <div className="block h-[18vh]">
                <div className="ml-4 h-[4em] flex items-center">
                    <h1 className="font-bold text-3xl text-[#626fff]">Chat</h1>
                </div>
                <div className="flex justify-center mt-[1em] mb-[1em]">
                    <input className="border border-[#8892ff] bg-[#dee1ff] rounded-2xl w-[94%] outline-none px-4 py-2 placeholder:text-[#818bff]" type="text" placeholder="Search"/>
                </div>
            </div>
            <div className="overflow-y-scroll bg-[#fff] text-white scroll-smooth h-[82vh] scrollable">
                <Contact />
                <Contact />
                <Contact />
                <Contact />
                <Contact />
                <Contact />
                <Contact />
                <Contact />
                <Contact />
                <Contact />
                <Contact />
                <Contact />
                <Contact />
                <Contact />
                <Contact />
                <Contact />
            </div>
        </section>
    );
};

export default Contacts;
