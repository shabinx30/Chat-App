import mongoose from "mongoose";

const userSchema = new mongoose.Schema (
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
        password :{
            type: String,
            required: true
        }
    },
    {timestamps: true}
)

const User = mongoose.model("User", userSchema)