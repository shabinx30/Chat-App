import { Schema, model, Document, Date } from "mongoose";

export interface userDetails extends Document {
    name: string;
    profile: string;
    email: string;
    password: string;
    updateAt: Date;
}

const userSchema = new Schema<userDetails>(
    {
        name: {
            type: String,
            required: true
        },
        profile: {
            type: String,
            default: ""
        },
        email: {
            type: String,
            requied: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

export default model("User", userSchema)