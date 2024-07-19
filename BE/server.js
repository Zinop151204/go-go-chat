import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

import authRoutes from "./routers/auth.router.js";
import messageRouets from "./routers/message.router.js";

import connectToMongoo from "./db/connectToMongoDB.js";



const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();

app.use(express.json())
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRouets);

app.listen(PORT, () => {
    connectToMongoo();
    console.log(`server sẽ chạy trên cổng ${PORT}`)
}); 