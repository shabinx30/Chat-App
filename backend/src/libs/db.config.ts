import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const url = process.env.MONGODB_URL_DEV

        if(url) {
            const conn = await mongoose.connect(url)
            console.log(`mongoDB Connected: ${conn.connection.host}`)
        }
    } catch (error) {
        console.log('while connecting the db', error)
    }
}