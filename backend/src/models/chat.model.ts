import { Document, Schema, model } from "mongoose";

interface membersType extends Document {
    userId: Schema.Types.ObjectId;
}

interface ChatType extends Document {
    userId: Schema.Types.ObjectId;
    isGroup: Boolean;
    lastMessageAt: Date;
    members: membersType[];
}

const chatSchema = new Schema<ChatType>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        members: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
            },
        ],
        isGroup: {
            type: Boolean,
            required: true,
        },
        lastMessageAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default model("Chat", chatSchema);
