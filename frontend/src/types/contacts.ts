//function type
export interface ContactType {
    change: string;
    setPop: React.Dispatch<React.SetStateAction<boolean>>;
    setSett: React.Dispatch<React.SetStateAction<boolean>>;
}

//type for member
export interface membersType extends Document {
    userId: {
        _id: string;
        name: string;
        profile: string;
    };
}

//for ctc
export interface ctcType {
    _id: string;
    userId: string;
    members: membersType[];
    isGroup: boolean;
    lastMessageAt: Date;
}

export interface conType {
    userId: string | undefined;
    data: ctcType;
    chatId: string | undefined;
    onUsers: Set<string>;
    chatMsg: string;
    isTyping: typing | undefined;
}

export interface typing {
    isTyping: boolean;
    chatId: string;
}