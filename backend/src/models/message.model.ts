import { Document, Schema, model } from "mongoose";

interface messageType extends Document {
    chatId: Schema.Types.ObjectId;
    body: String;
    sentBy: String;
    to: String;
}

const messageModel = new Schema<messageType>(
    {
        chatId: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
        },
        body: {
            type: String,
            required: true,
        },
        sentBy: {
            type: String,
            required: true,
        },
        to: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default model("Message", messageModel);
