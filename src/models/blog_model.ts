import mongoose from "mongoose";
import Document from "mongoose";
const myDate = new Date();
const dates = myDate.toUTCString();
import { UserModel } from "../models/user_model";
import Joi from "joi";
export interface Blog extends Document {
  title: string;
  author: string;
  publishedDate: string;
  shortDescript: string;
  description: string;
  imageLink: string;
  comments: Comment[];
  likes: number;
  likedBy: string[];
  date: string;
}

export interface CommentDocument extends Document {
  name: string;
  comment: string;
  user: mongoose.Schema.Types.ObjectId;
  likes: number;
  likedBy: string[];
  date: string;
}

const commentSchemaJoi = Joi.object({
  name: Joi.string(),
  comment: Joi.string().required(),
  blog: Joi.string(),
  user: Joi.string(),
  likes: Joi.number().default(0),
  likedBy: Joi.array().items(
    Joi.object({
      _id: Joi.string().required(),
      liked: Joi.boolean().default(false),
      date: Joi.string().default(Joi.date().iso()),
    })
  ),
});
export const validateComment = (data: CommentDocument) => {
  return commentSchemaJoi.validate(data);
};

const commentSchema = new mongoose.Schema({
  name: String,
  comment: String,
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BlogModel",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      liked: false,
      date: {
        type: String,
        default: `${dates}`,
      },
    },
  ],
});

const CommentModel = mongoose.model("Comment", commentSchema);

export default CommentModel;

const blogSchemaJoi = Joi.object({
  title: Joi.string().required().max(70),
  author: Joi.string().required(),
  publishedDate: Joi.date().required(),
  isPublished: Joi.boolean().default(false),
  shortDescript: Joi.string().required().max(150),
  description: Joi.string().required(),
  imageLink: Joi.string().required(),
  comments: Joi.array().items(commentSchemaJoi),
  likes: Joi.number().default(0),
  likedBy: Joi.array().items(Joi.string().default(false)),
  date: Joi.string().default(Joi.date().iso()),
});

export const validateBlog = (data: Blog) => {
  return blogSchemaJoi.validate(data);
};

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: [70, "Name cannot exceed 100 characters"],
  },
  author: {
    type: String,
    required: true,
  },
  publishedDate: {
    type: Date,
    required: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  shortDescript: {
    type: String,
    required: true,
    maxlength: [150, "short description cannot exceed 150 characters"],
  },
  description: {
    type: String,
    required: true,
  },
  imageLink: {
    type: String,
    required: true,
  },
  comments: [commentSchema],
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
      liked: false,
      date: {
        type: String,
        default: `${dates}`,
      },
    },
  ],
});

export const BlogModel = mongoose.model("blog", BlogSchema);

///////////////////////////////////////////////////////////////////////////////////////

export const getBlogs = () => BlogModel.find();

export const getBlogById = (id: string) => BlogModel.findById(id);

export const getBlogByTitle = (title: string) => BlogModel.findOne({ title });

export const createBlog = (values: Record<string, any>) =>
  new BlogModel(values).save().then((blog) => blog.toObject());

export const deleteBlogById = (id: string) => BlogModel.findByIdAndDelete(id);
