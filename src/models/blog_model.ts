import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: [70, "Name cannot exceed 100 characters"],
  },
  author: {
    type: String,
    required: true,
  },
  published_date: {
    type: Date,
    required: true,
  },
  is_published: {
    type: Boolean,
    default: false,
  },
  short_description: {
    type: String,
    required: true,
    maxlength: [150, "short description cannot exceed 150 characters"],
  },
  description: {
    type: String,
    required: true,
  },
  image_link: {
    type: String,
    required: true,
  },
});

export const BlogModel = mongoose.model("blog", BlogSchema);

///////////////////////////////////////////////////////////////////////////////////////

export const getBlogs = () => BlogModel.find();

export const getBlogById = (id: string) => BlogModel.findById(id);

export const getBlogByTitle = (title: string) => BlogModel.findOne({ title });

export const createBlog = (values: Record<string, any>) =>
  new BlogModel(values).save().then((blog) => blog.toObject());

export const deleteBlogById = (id: string) => BlogModel.findByIdAndDelete(id);

export const updateBlogById = (id: string, values: Record<string, any>) =>
  BlogModel.findByIdAndUpdate(id, values);
