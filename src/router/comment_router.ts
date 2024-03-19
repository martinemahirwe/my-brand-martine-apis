import { createOneComment } from "../controlles/comment_controller";
import { likeBlog } from "../controlles/likes_controller";
import express from "express";

export default (router: express.Router) => {
  /**
   * @openapi
   * components:
   *   schemas:
   *     CommentModel:
   *       type: object
   *       properties:
   *         _id:
   *           type: string
   *         name:
   *           type: string
   *           description: The name of the commenter
   *         comment:
   *           type: string
   *           description: The comment content
   *         user:
   *           type: string
   *           description: The ID of the user who made the comment
   *         likes:
   *           type: number
   *           description: The number of likes the comment has received
   *         likedBy:
   *           type: array
   *           items:
   *             type: string
   *           description: The IDs of users who liked the comment
   *         date:
   *           type: string
   *           format: date-time
   *           description: The date and time when the comment was created
   *       required:
   *         - comment
   */

  /**
   * @openapi
   * /comments/{blogId}:
   *   post:
   *     summary: Create a new comment on a blog
   *     tags: [Comments]
   *     parameters:
   *       - in: path
   *         name: blogId
   *         schema:
   *           type: string
   *         required: true
   *         description: The ID of the blog to comment on
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               comment:
   *                 type: string
   *             required:
   *               - comment
   *     responses:
   *       201:
   *         description: Comment created successfully
   *       400:
   *         description: Bad request
   *       403:
   *         description: No token found or user needs to login
   *       404:
   *         description: Blog not found or user not found
   *       500:
   *         description: Internal server error
   */
  router.post("/comments/:blogId",createOneComment);

  /**
   * @openapi
   * /like/{blogId}:
   *   post:
   *     summary: Like a blog
   *     tags: [Likes]
   *     parameters:
   *       - in: path
   *         name: blogId
   *         schema:
   *           type: string
   *         required: true
   *         description: The ID of the blog to like
   *     responses:
   *       200:
   *         description: Blog liked successfully
   *       404:
   *         description: Blog not found
   *       500:
   *         description: Internal server error
   */
  router.post("/like/:blogId",likeBlog);

};
