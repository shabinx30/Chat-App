const Message = ({ data }: { data: number }) => {
    return (
        <div className="bg-white px-2 my-2">
            <div className={`flex ${data > 0 ? 'justify-end' : 'justify-start'}`}>
                <p className="border rounded-lg pr-8 pl-2 py-1">hello</p>
            </div>
        </div>
    );
};

export default Message;
