import { useNavigate } from "react-router-dom";

//type for member
interface membersType extends Document {
    userId: {
        name: string;
        profile: string;
    };
}

//type for ctc
interface ctcType {
    _id: string;
    userId: string;
    members: membersType[];
    isGroup: boolean;
    lastMessageAt: Date;
}

const Contact = ({ data }: { data: ctcType }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/chat/${data._id}`)}
            className={`w-full h-[4.5em] hover:bg-[#eff0ff] hover:dark:bg-gray-700/50 rounded-2xl text-black dark:text-[#eff0ff] flex justify-center gap-4 items-center px-4`}
        >
            <div className="relative flex items-center justify-center">
                <img
                    className="object-cover min-w-[3.5em] max-h-[3.5em] rounded-full"
                    src={`${import.meta.env.VITE_BASE_URL}/${
                        data.members[0].userId.profile
                    }`}
                    alt="poda"
                />
                <span className="absolute border-[3px] border-white dark:border-black bg-green-400 w-3.5 h-3.5 right-0 bottom-0 rounded-full"></span>
            </div>
            <div
                className={`font-normal h-[90%] flex justify-between items-center w-full`}
            >
                <p>{data.members[0].userId.name}</p>
                {/* <p className="text-[0.8em] text-gray-400 select-none">{data.lastMessageAt}</p> */}
            </div>
        </div>
    );
};

export default Contact;
