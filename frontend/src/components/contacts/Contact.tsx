import { useNavigate } from "react-router-dom";



const Contact = ({data}: {data: number}) => {

    const navigate = useNavigate()

    return (
        <div onClick={() => navigate('/chat')} className={`w-full h-[4.5em] ${data == 2 ? 'bg-[#eff0ff] dark:bg-gray-700/50 rounded-2xl' : ''} text-black dark:text-[#eff0ff] flex justify-center gap-4 items-center px-4`}>
            <div className="relative flex items-center justify-center">
                <img className="w-[3.5em] dark:invert dark:contrast-25" src="/user.png" alt="poda" />
                <span className="absolute border-[3px] border-white dark:border-black bg-green-400 w-3.5 h-3.5 right-1 bottom-1 rounded-full"></span>
            </div>
            <div className={`font-normal h-[90%] flex justify-between items-center w-full`}>
                <p>Ramu kuttan</p>
                <p className="text-[0.8em] text-gray-400 select-none">10:38 pm</p>
            </div>
        </div>
    )
};

export default Contact;
