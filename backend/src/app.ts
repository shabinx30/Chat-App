import express from "express";
import { config } from "dotenv";
config();
const app = express();

//route
import userRouter from "./routes/auth.route"
app.use('/api/auth', userRouter)

const PORT = process.env.PORT;
app.listen(PORT || 5000, () => {
    console.log(`server is running on ${PORT || 5000}`);
});
