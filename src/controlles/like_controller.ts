import express from "express";
import { LikeModel, getLikes, createLike } from "../models/like_model";

export const getAllLikes = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const likes = await getLikes();
    res.status(200).json(likes);
  } catch (error) {
    console.log((error as Error).message);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createOneLike = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { blog_id, user_id, comment_id } = req.body;
    const existingLike = await LikeModel.findOne({ user_id });
    if (existingLike) {
      return res
        .status(400)
        .json({ message: "You have already liked this blog." });
    }
    const likes = await createLike({
      blog_id,
      user_id,
      comment_id,
    });
    res.status(200).json(likes);
  } catch (error) {
    console.log((error as Error).message);
    res.status(500).json({ message: (error as Error).message });
  }
};
