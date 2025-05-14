import express from "express";
import { config } from "dotenv";
config();

import { connectDB } from "./libs/db.config"
import { server, app } from "./libs/socket";

//route
import userRouter from "./routes/auth.route"
app.use('/api/auth', userRouter)

app.use(express.json())


const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
    connectDB()
});
