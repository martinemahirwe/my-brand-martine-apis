import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: [true, "Please user id is required"],
  },
  blog_id: {
    type: String,
    required: [true, "Please user id is required"],
  },
  comment_id: {
    type: String,
    required: [true, "Please Comment id is required"],
  },
});

export const LikeModel = mongoose.model("LikeModel", LikeSchema);

/////////////////////////////////////////////////////////////////////

export const getLikes = () => LikeModel.find();

export const createLike = (values: Record<string, any>) =>
  new LikeModel(values).save().then((user) => user.toObject());

export const deleteLikeById = (id: string) =>
  LikeModel.findByIdAndDelete({ _id: id });

export const getLikeById = (id: string) => LikeModel.findById({ _id: id });
