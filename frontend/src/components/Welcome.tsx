import { BiMessageSquareDetail } from "react-icons/bi";


const Welcome = () => {
    
    return (
        <div
            onContextMenu={(e) => e.preventDefault()}
            className="relative select-none hidden md:flex flex-[calc(1/2.6*100%)] bg-[#dee1ff] dark:bg-black text-black dark:text-white flex-col justify-center items-center text-center"
        >
            <BiMessageSquareDetail size={50} className="mb-4 text-[#626fff]" />
            <h1 className="font-semibold text-2xl mb-2">Welcome to Chat!</h1>
            <p className="text-[#484848] dark:text-[#72759c] text-[0.9em]">
                Select a contact to start the conversation.
            </p>
        </div>
    );
};

export default Welcome;
