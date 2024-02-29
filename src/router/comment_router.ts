import {
  getAllComments,
  getCommentsByBlogId,
  createOneComment,
  deleteComment,
} from "../controlles/comment_controller";
import express from "express";

export default (router: express.Router) => {
  router.post("/comments/create", createOneComment);
  router.get("/comments", getAllComments);
  router.get("/comments/:id", getCommentsByBlogId);
  router.delete("/comments/:id", deleteComment);
};
