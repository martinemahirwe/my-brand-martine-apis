import {
  getAllBlogs,
  publishOneBlog,
  createNewBlog,
  updateBlog,
  deleteBlog,
  getAllPublished,
} from "../controlles/blog_controllers";
import express from "express";

import { isAuthenticated } from "../middlewares/index";

export default (router: express.Router) => {
  router.post("/blogs/publish", publishOneBlog);
  router.post("/blogs/create", createNewBlog);
  router.get("/blogs", getAllBlogs);
  router.get("/blogs/published", getAllPublished);
  router.patch("/blogs/:id", updateBlog);
  router.delete("/blogs/:id", deleteBlog);
};
