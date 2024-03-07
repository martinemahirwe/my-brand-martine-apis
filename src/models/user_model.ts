import mongoose from "mongoose";
import Joi from "joi";

export interface UserDocument extends Document {
  _id: any;
  username: string;
  email: string;
  password: string;
  userRole: string;
  id: mongoose.Types.ObjectId;
  token: string;
}

const userSchema1 = Joi.object({
  username: Joi.string(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  userRole: Joi.string(),
});

export const validateUser = (data: UserDocument) => {
  return userSchema1.validate(data);
};
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  userRole: {
    type: String,
    default: "user",
  },
});

export const UserModel = mongoose.model("UserModel", UserSchema);

///////////////////////////////////////////////////////////////////////////////////////

export const getUsers = () => UserModel.find();

export const getUserByEmail = (email: string) => UserModel.findOne({ email });

export const getUserById = (id: string) => UserModel.findById(id);

export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });

export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string) =>
  UserModel.findByIdAndDelete({ _id: id });

export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);
