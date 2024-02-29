import mongoose from "mongoose";

export const CommentSchema = new mongoose.Schema({
  blog_name: {
    type: String,
    required: true,
  },
  commentor: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
    required: [true, "Comment message is required"],
  },
  likes: {
    type: Number,
    default: 0,
  },
  commented_date: {
    type: String,
  },
});

export const CommentModel = mongoose.model("CommentModel", CommentSchema);

///////////////////////////////////////////////////////////////////////////////////

export const getComments = () => CommentModel.find();

export const createComment = (values: Record<string, any>) =>
  new CommentModel(values).save().then((user) => user.toObject());

export const deleteCommentById = (id: string) =>
  CommentModel.findByIdAndDelete({ _id: id });
