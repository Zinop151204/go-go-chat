import Conversation from "../models/Conversation .model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        const { message } = req.body
        const { id: receiverId } = req.params.id

        const senderId = req.user._id;
        const conversation = await Conversation({
            participants: {
                $all: [senderId, receiverId]
            },
        })
        if(!conversation){
            conversation = await Conversation.create({
                participants:[self, receiverId]
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        })
        if(newMessage){
            conversation.message.push(newMessage._id);
        }

        res.status(201).json(newMessage)
    } catch (error) {
        console.log("lỗi", error.message)
        res.status(500).json({ error: "lỗi máy chủ" })

    }
}