import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

export const MessageModel = mongoose.model("message", MessageSchema);

///////////////////////////////////////////////////////////////////////////////////////

export const getMessages = () => MessageModel.find();

export const getMessageById = (id: string) => MessageModel.findById(id);

export const createMessage = (values: Record<string, any>) =>
  new MessageModel(values).save().then((message) => message.toObject());

export const deleteMessageById = (id: string) =>
  MessageModel.findByIdAndDelete({ _id: id });
