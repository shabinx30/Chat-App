export interface chatType {
    _id: string;
    name: string;
    profile: string;
}

export interface Msg {
    body: string;
    createdAt: number;
    from: string | undefined;
    hasMedia: boolean;
    media: string | undefined;
    mediaType: string | undefined;
}