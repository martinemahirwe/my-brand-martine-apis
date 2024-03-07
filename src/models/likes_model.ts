import mongoose from "mongoose";
import Joi from "joi";

export const likeSchemaJoi = Joi.object({
  blogId: Joi.string().required(),
  userId: Joi.string(),
  createdAt: Joi.date().default(Date.now),
});

export interface Like {
  blogId: string;
  userId: string;
  createdAt?: Date;
}

const likeSchema = new mongoose.Schema({
  blogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Like = mongoose.model("Like", likeSchema);
