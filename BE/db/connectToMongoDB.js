import e from "express";
import mongoose from "mongoose";

const connectToMongoo = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_URL)
        console.log("đã kết nối đến mongo")
    } catch (error) {
        console.log(error.message)
    }
}

export default connectToMongoo