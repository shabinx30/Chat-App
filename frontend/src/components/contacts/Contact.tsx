


const Contact = ({data}: {data: number}) => {
    return (
        <div className={`w-full h-[4.5em] ${data == 2 ? 'bg-[#eff0ff] dark:bg-[#2d2d2d] rounded-3xl' : ''} text-black dark:text-[#eff0ff] flex justify-center gap-4 items-center px-4`}>
            <div className="relative flex items-center justify-center">
                <img className="w-[3.5em] dark:invert dark:contrast-75" src="/user.png" alt="poda" />
                <span className="absolute border-[3px] border-white dark:border-black bg-green-400 w-3.5 h-3.5 right-1 bottom-1 rounded-full"></span>
            </div>
            <div className={`font-semibold h-[90%] flex items-center w-full`}>Ramu kuttan</div>
        </div>
    )
};

export default Contact;
