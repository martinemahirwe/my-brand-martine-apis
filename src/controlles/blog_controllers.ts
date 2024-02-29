import axios from "axios";
import express from "express";
import {
  getBlogs,
  getBlogById,
  getBlogByTitle,
  createBlog,
  updateBlogById,
  deleteBlogById,
} from "../models/blog_model";

export const getAllBlogs = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const blogs = await getBlogs();
    res.status(200).json(blogs);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

export const getOneBlogById = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const blog = await getBlogById(id);
    res.status(200).json(blog);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

export const getAllPublished = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const blogs = await getBlogs();
    const published = blogs.filter((blog) => blog.is_published === true);
    res.status(200).json(published);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

export const publishOneBlog = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { title, published_date } = req.body;
    if (!title || !published_date) {
      return res.sendStatus(400);
    }
    const publishedBlog = await getBlogByTitle(title);
    console.log(publishedBlog);
    if (!publishedBlog) {
      return res.sendStatus(400);
    }
    publishedBlog.is_published = true;
    publishedBlog.published_date = published_date;

    res.status(201).json(publishedBlog).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

export const createNewBlog = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const {
      title,
      author,
      published_date,
      short_description,
      description,
      image_link,
    } = req.body;
    if (
      !title ||
      !author ||
      !published_date ||
      !short_description ||
      !description ||
      !image_link
    ) {
      return res.sendStatus(400);
    }
    const existingBlog = await getBlogByTitle(title);
    console.log(existingBlog);
    if (existingBlog) {
      return res.sendStatus(400);
    }
    const newBlog = await createBlog({
      title,
      author,
      published_date,
      short_description,
      description,
      image_link,
    });
    res.status(201).json(newBlog).end();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

export const deleteBlog = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedBlog = await deleteBlogById(id);
    return res.json(deletedBlog);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const updateBlog = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const {
      title,
      short_description,
      description,
      image_link,
      published_date,
    } = req.body;

    if (
      !title ||
      !published_date ||
      !short_description ||
      !image_link ||
      !description
    ) {
      return res.sendStatus(400);
    }

    const update_blog = await updateBlogById(id, {
      title,
      short_description,
      description,
      image_link,
      published_date,
    });

    update_blog.save();

    return res.status(200).json(update_blog).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
