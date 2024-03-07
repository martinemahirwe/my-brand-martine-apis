import mongoose from "mongoose";
import Joi from "joi";

const messageSchemaJoi = Joi.object({
  name: Joi.string().required(),
  message: Joi.string().required(),
  email: Joi.string().email().required(),
});
export const validateMessage = (data: IMessage) =>
  messageSchemaJoi.validate(data);
interface IMessage extends Document {
  name: string;
  message: string;
  email: string;
}

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
