import mongoose, { Document } from "mongoose";

interface userDetails extends Document {
    name: string;
    profile: string;
    email: string;
    password: string;
}

const userSchema = new mongoose.Schema<userDetails>(
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

export default mongoose.model("User", userSchema)