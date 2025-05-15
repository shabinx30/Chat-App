


const Contact = ({data}: {data: number}) => {
    return (
        <div className={`w-full h-[4.5em] ${data == 2 ? 'bg-[#dee1ff] rounded-3xl' : ''} text-black flex justify-center gap-4 items-center px-4`}>
            <div className="relative flex items-center justify-center">
                <img className="w-[3.5em]" src="/user.png" alt="poda" />
                <span className="absolute bg-green-400 w-2.5 h-2.5 right-1 bottom-1 rounded-full"></span>
            </div>
            <div className={`font-semibold ${data != 2 ? 'border-b border-[#c8cdff]' : ''} h-[90%] flex items-center w-full`}>Ramu kuttan</div>
        </div>
    )
};

export default Contact;
