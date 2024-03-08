import express from "express";
import {
  getBlogs,
  getBlogByTitle,
  createBlog,
  deleteBlogById,
  BlogModel,
  Blog,
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
    const blog = await BlogModel.findOne({ _id: id, isPublished: true });
    if (blog) {
      res.status(200).json(blog);
    } else {
      res.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

export const getPublishedBlogs = async (
  req: express.Request,
  res: express.Response
) => {
  const userInfo = req.userInfo;
  console.log(userInfo);
  
  try {
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
      return res.status(400).json({
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
      return res.status(400).json({ message: "there are missing parameters" });
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
      return res.status(400).json({
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
    return res.status(400).json({
      success: false,
      error: "blog not found",
    });
  }
};

export const updateBlog = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const { title, shortDescript, description, imageLink, publishedDate } = req.body;

    interface UpdatedFields {
      title?: string;
      shortDescript?: string;
      description?: string;
      imageLink?: string;
      publishedDate?: Date;
    }
    const { error } = validateBlog(req.body);
    if (error) {
      return res
        .status(400)
        .send("Validation failed: " + error.details[0].message);
    } else {
      console.log("this is valid data!");
    }
    const updatedFields: UpdatedFields = {};
    if (title) updatedFields.title = title;
    if (shortDescript) updatedFields.shortDescript = shortDescript;
    if (description) updatedFields.description = description;
    if (imageLink) updatedFields.imageLink = imageLink;
    if (publishedDate) updatedFields.publishedDate = publishedDate;

    const updatedBlog = await BlogModel.findByIdAndUpdate(
      id,
      updatedFields as unknown as Blog,
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res.status(200).json(updatedBlog);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};