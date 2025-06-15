import { Document, Schema, model } from "mongoose";

interface messageType extends Document {
    chatId: Schema.Types.ObjectId;
    body: String;
    from: String;
    to: String;
    hasMedia: Boolean;
    media: String;
    mediaType: String;
}

const messageModel = new Schema<messageType>(
    {
        chatId: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
        },
        body: {
            type: String,
            required: false,
        },
        from: {
            type: String,
            required: true,
        },
        to: {
            type: String,
            required: true,
        },
        hasMedia: {
            type: Boolean,
            default: false
        },
        media: {
            type: String,
            required: false
        },
        mediaType: {
            type: String,
            required: false
        }
    },
    {
        timestamps: true,
    }
);

export default model("Message", messageModel);
