import express from "express";
import { BlogModel } from "../models/blog_model";
import { UserDocument } from "../models/user_model";
import { UserModel } from "../models/user_model";
import { Like } from "../models/likes_model";
import jwt from "jsonwebtoken";

export const likeBlog = async (req: express.Request, res: express.Response) => {
  try {
    const blogId = req.params.blogId;
    let user: any;

    const blog = await BlogModel.findById(blogId).populate("comments");

    const token = req.cookies.jwt;

    if (token) {
      jwt.verify(token, "MARTINE_API", async (err: any, decodedToken: any) => {
        if (err) {
          res.status(403).send("No Token found: you need to login!");
        } else {
          user = await UserModel.findById(decodedToken.id);

          if (!user) {
            return res.status(404).json({ message: "please login required" });
          }
          if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
          }
          if (blog.likedBy.includes(user._id)) {
            blog.likes--;

            blog.likedBy = blog.likedBy.filter(
              (userId) => userId.toString() !== user._id.toString()
            );
          }

          blog.likes++;
          blog.likedBy.push(user._id);
          await blog.save();

          return res
            .status(200)
            .json({ message: "Blog liked successfully", likes: blog.likes });
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

import { Types } from "mongoose";

export const likeComment = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const blogId = req.params.blogId;
    let user: any;

    const blog: any = await BlogModel.findById(blogId).populate("comments");
    const comments: any = blog.comments;

    const token = req.cookies.jwt;

    if (token) {
      jwt.verify(token, "MARTINE_API", async (err: any, decodedToken: any) => {
        if (err) {
          res.status(403).send("No Token found: you need to login!");
        } else {
          user = await UserModel.findById(decodedToken.id);

          if (!user) {
            return res.status(404).json({ message: "please login required" });
          }
          if (!comments) {
            return res.status(404).json({ message: "Blog not found" });
          }

          const userId = user._id.toString();
          const likedByUser = comments.likedBy.map((userId: any) =>
            userId.toString()
          );

          if (likedByUser.includes(userId.toString())) {
            comments.likes--;
            comments.likedBy = comments.likedBy.filter(
              (userId: any) => userId.toString() !== userId.toString()
            );
          }

          comments.likes++;
          comments.likedBy.push(userId);
          comments.likedBy.push({
            createdAt: new Date(),
          });

          await comments.save();

          return res.status(200).json({
            message: "Blog liked successfully",
            likes: comments.likes,
          });
        }
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
