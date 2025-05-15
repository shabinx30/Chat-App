import Contact from "./Contact";

const Contacts = () => {
    return (
        <section className="flex-1 bg-white border-r border-black">
            <div className="block border-b border-black h-[18vh]">
                <div className="ml-4 h-[4em] flex items-center">
                    <h1 className="font-bold text-2xl">Chat</h1>
                </div>
                <div className="flex justify-center mt-[1em] mb-[1em]">
                    <input className="border rounded-2xl w-[94%] outline-none px-4 py-2" type="text" placeholder="Search"/>
                </div>
            </div>
            <div className="overflow-y-scroll scroll-smooth h-[82vh] scrollable">
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
