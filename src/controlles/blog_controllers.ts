import express from "express";
import {
  getBlogs,
  getBlogById,
  getBlogByTitle,
  createBlog,
  deleteBlogById,
  BlogModel,
  validateBlog,
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
    const blog = await BlogModel.find({ isPublished: true });
    res.status(200).json(blog);
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
    const { title, publishedDate } = req.body;
    if (!title || !publishedDate) {
      return res.sendStatus(400).json({
        success: false,
        message: "enter valid credentials",
      });
    }
    const publishedBlog = await BlogModel.findOneAndUpdate(
      { title: title },
      { $set: { isPublished: true, publishedDate: publishedDate } },
      { new: true }
    );

    if (!publishedBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found!",
      });
    }
    publishedBlog.isPublished = true;
    publishedBlog.publishedDate = publishedDate;

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
      publishedDate,
      shortDescript,
      description,
      imageLink,
    } = req.body;
    if (
      !title ||
      !author ||
      !publishedDate ||
      !shortDescript ||
      !description ||
      !imageLink
    ) {
      return res.status(400).json({ message: "Internal server error" });
    }
    const { error } = validateBlog(req.body);
    if (error) {
      return res
        .status(400)
        .send("Validation failed: " + error.details[0].message);
    } else {
      console.log("this is valid data!");
    }
    const existingBlog = await getBlogByTitle(title);
    if (existingBlog) {
      return res.sendStatus(400).json({
        message: "the blog Already exists",
      });
    }
    const newBlog = await createBlog({
      title,
      author,
      publishedDate,
      shortDescript,
      description,
      imageLink,
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
    const { title, shortDescript, description, imageLink, publishedDate } =
      req.body;

    if (
      !title ||
      !publishedDate ||
      !shortDescript ||
      !imageLink ||
      !description
    ) {
      return res.sendStatus(400).json({ message: "enter correct data" });
    }

    const updatedBlog = await BlogModel.findByIdAndUpdate(
      id,
      {
        title,
        shortDescript,
        description,
        imageLink,
        publishedDate,
      },
      { new: true }
    );
    console.log(updatedBlog);
    await updatedBlog.save();
    return res.status(200).json(updatedBlog).end();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "enter correct data" });
  }
};
