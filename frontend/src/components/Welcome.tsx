import { BiMessageSquareDetail } from "react-icons/bi";

const Welcome = () => {
    return (
        <div className="flex-1/3 bg-[#dee1ff] flex flex-col justify-center items-center text-center">
            <BiMessageSquareDetail size={50} className="mb-4" />
            <h1 className="font-semibold text-2xl mb-2">Welcome to Chat!</h1>
            <p className="text-[#484848] text-[0.9em]">
                Select a contact to start the conversation.
            </p>
        </div>
    );
};

export default Welcome;
