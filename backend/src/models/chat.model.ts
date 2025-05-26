import { Document, Schema, model } from "mongoose";

interface membersType extends Document {
    userId: Schema.Types.ObjectId;
}

interface ChatType extends Document {
    members: membersType[];
    isGroup: Boolean;
    lastMessageAt: Date;
}

const chatSchema = new Schema<ChatType>(
    {
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
