import express from "express";
import CommentModel from "../models/blog_model";
import { BlogModel, validateComment } from "../models/blog_model";
import { UserModel, UserDocument } from "../models/user_model";
import jwt from "jsonwebtoken";

export const createOneComment = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { blogId } = req.params;
    const { comment } = req.body;
    let user: UserDocument;

    const { error } = validateComment(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

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
          if (blog.comments.some((comment) => comment.user?.equals(user._id))) {
            return res
              .status(403)
              .send(
                "You have already commented on this blog. You can't comment twice!"
              );
          }

          const newComment = {
            user: user._id,
            name: user.email,
            comment,
            blog: blogId,
          };

          blog.comments.push(newComment);

          await blog.save();

          return res.status(201).json(newComment);
        }
      });
    }
  } catch (err) {
    console.error("Error adding comment:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
