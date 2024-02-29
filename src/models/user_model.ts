import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  authentication: {
    password: {
      type: String,
      required: true,
      select: false,
    },
    salt: {
      type: String,
      select: false,
    },
    sessionToken: {
      type: String,
      select: false,
    },
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BlogModel",
    },
  ],
});

export const UserModel = mongoose.model("UserModel", UserSchema);

///////////////////////////////////////////////////////////////////////////////////////

export const getUsers = () => UserModel.find();

export const getUserByEmail = (email: string) => UserModel.findOne({ email });

export const getUserById = (id: string) => UserModel.findById(id);

export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ "authentication.sessionToken": sessionToken });

export const updateUserSessionToken = (
  sessionToken: string,
  newSessionToken: string | null
) =>
  UserModel.findOneAndUpdate(
    { "authentication.sessionToken": sessionToken },
    { $set: { "authentication.sessionToken": newSessionToken } },
    { new: true }
  );

export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string) =>
  UserModel.findByIdAndDelete({ _id: id });

export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);
