import express from "express";
import { config } from "dotenv";
config();

import { connectDB } from "./libs/db.config"
const app = express();

//route
import userRouter from "./routes/auth.route"
app.use('/api/auth', userRouter)



const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
    connectDB()
});
