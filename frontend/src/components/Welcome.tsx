import { BiMessageSquareDetail } from "react-icons/bi";


const Welcome = () => {
    
    return (
        <div
            onContextMenu={(e) => e.preventDefault()}
            className="relative hidden md:flex flex-1/3 bg-[#dee1ff] dark:bg-gray-900 text-black dark:text-white flex-col justify-center items-center text-center"
        >
            <BiMessageSquareDetail size={50} className="mb-4 text-[#626fff]" />
            <h1 className="font-semibold text-2xl mb-2">Welcome to Chat!</h1>
            <p className="text-[#484848] dark:text-[#868686] text-[0.9em]">
                Select a contact to start the conversation.
            </p>
        </div>
    );
};

export default Welcome;
