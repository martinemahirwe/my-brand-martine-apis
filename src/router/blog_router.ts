import {
  getAllBlogs,
  publishOneBlog,
  createNewBlog,
  updateBlog,
  deleteBlog,
  getOneBlogById,
} from "../controlles/blog_controllers";
import express from "express";
import { isAuthenticated, isAdmin } from "../middlewares/index";

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
   * components:
   *   schemas:
   *     BlogModel:
   *       type: object
   *       properties:
   *         _id:
   *           type: string
   *         title:
   *           type: string
   *           description: The title of the blog
   *         author:
   *           type: string
   *           description: The author of the blog
   *         publishedDate:
   *           type: string
   *           format: date-time
   *           description: The date and time when the blog was published
   *         isPublished:
   *           type: boolean
   *           description: Indicates whether the blog is published
   *         shortDescript:
   *           type: string
   *           description: A short description of the blog
   *         description:
   *           type: string
   *           description: The content of the blog
   *         imageLink:
   *           type: string
   *           description: The link to the image associated with the blog
   *         comments:
   *           type: array
   *           items:
   *             $ref: '#/components/schemas/CommentModel'
   *           description: The comments associated with the blog
   *         likes:
   *           type: number
   *           description: The number of likes the blog has received
   *         likedBy:
   *           type: array
   *           items:
   *             type: string
   *           description: The IDs of users who liked the blog
   *         date:
   *           type: string
   *           format: date-time
   *           description: The date and time when the blog was created
   *       required:
   *         - title
   *         - author
   *         - publishedDate
   *         - shortDescript
   *         - description
   *         - imageLink
   */

  /**
   * @openapi
   * /blogs:
   *   get:
   *     summary: Get all blogs
   *     tags: [Blogs]
   *     responses:
   *       200:
   *         description: A list of all blogs
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/BlogModel'
   *       500:
   *         description: Internal server error
   */
  router.get("/blogs", isAuthenticated, isAdmin, getAllBlogs);

  /**
   * @openapi
   * /blogs/published:
   *   get:
   *     summary: Get all published blogs
   *     tags: [Blogs]
   *     responses:
   *       200:
   *         description: Returns all published blog objects
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/BlogModel'
   *       500:
   *         description: Internal server error
   */

  router.get("/blogs/published", getOneBlogById);

  // /**
  //  * @openapi
  //  * /blogs/published:
  //  *   get:
  //  *     summary: Get all published blogs
  //  *     tags: [Blogs]
  //  *     security:
  //  *       - bearerAuth: []
  //  *     responses:
  //  *       "200":
  //  *         description: Published blogs retrieved successfully
  //  *         content:
  //  *           application/json:
  //  *             schema:
  //  *               type: array
  //  *               items:
  //  *                 $ref: '#/components/schemas/BlogModel'
  //  *       "500":
  //  *         description: Internal server error
  //  */
  // router.get("/blogs/:published", isAuthenticated, getAllBlogs);

  /**
   * @openapi
   * /blogs/{id}:
   *   delete:
   *     summary: Delete a blog by ID
   *     tags: [Blogs]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the blog to delete
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Blog deleted successfully
   *       500:
   *         description: Internal server error
   */
  router.delete("/blogs/:id", isAuthenticated, isAdmin, deleteBlog);

  /**
   * @openapi
   * /blogs/{id}:
   *   patch:
   *     summary: Update a blog by ID
   *     tags: [Blogs]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the blog to update
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               shortDescript:
   *                 type: string
   *               description:
   *                 type: string
   *               imageLink:
   *                 type: string
   *               publishedDate:
   *                 type: string
   *                 format: date
   *     responses:
   *       200:
   *         description: Blog updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/BlogModel'
   *       400:
   *         description: Bad request - Missing or invalid request body
   *       404:
   *         description: Blog not found
   *       500:
   *         description: Internal server error
   */

  router.patch("/blogs/:id", isAuthenticated, isAdmin, updateBlog);

  /**
   * @openapi
   * /blogs/publish:
   *   post:
   *     summary: Publish a blog
   *     tags: [Blogs]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               publishedDate:
   *                 type: string
   *             required:
   *               - title
   *               - publishedDate
   *     responses:
   *       201:
   *         description: Blog published successfully
   *       400:
   *         description: Bad request
   *       404:
   *         description: Blog not found
   *       500:
   *         description: Internal server error
   */
  router.post("/blogs/publish", isAuthenticated, isAdmin, publishOneBlog);

  /**
   * @openapi
   * /blogs/create:
   *   post:
   *     summary: Create a new blog (Admin only)
   *     tags:
   *       - Blogs
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               title:
   *                 type: string
   *               author:
   *                 type: string
   *               publishedDate:
   *                 type: string
   *                 format: date
   *               shortDescript:
   *                 type: string
   *               description:
   *                 type: string
   *               imageLink:
   *                 type: string
   *     responses:
   *       '201':
   *         description: Blog created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/BlogModel'
   *       '400':
   *         description: Bad request - Missing or invalid request body
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *       '500':
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   */

  router.post("/blogs/create", isAuthenticated, isAdmin, createNewBlog);
};
