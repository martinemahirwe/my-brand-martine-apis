import express from "express";
import {
  CommentModel,
  getComments,
  createComment,
  deleteCommentById,
} from "../models/comment_model";

export const getAllComments = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const comments = await getComments();
    res.status(200).json(comments);
  } catch (error) {
    console.log((error as Error).message);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getCommentsByBlogId = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { blog_id } = req.params;
    const comment = await CommentModel.findOne({ blog_id });
    return res.status(200).json(comment);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createOneComment = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { commented_date, comment, commentor, blog_name } = req.body;
    const existingComment = await CommentModel.findOne({
      commentor,
    });
    if (existingComment) {
      return res
        .status(400)
        .json({ message: "You have already liked this blog." });
    }
    const comments = await createComment({
      commentor,
      comment,
      blog_name,
    });
    res.status(200).json(comments);
  } catch (error) {
    console.log((error as Error).message);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteComment = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedComment = await deleteCommentById(id);
    return res.json(deletedComment);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
