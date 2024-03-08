import express from "express";
import bcrypt from "bcrypt";
import {
  getUsers,
  deleteUserById,
  getUserById,
  UserModel,
} from "../models/user_model";

export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await UserModel.find({}, { password: 0 });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json({message:"can not get users"});
  }
};

export const getUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(400).json({message:"can not get user"});
  }
};

export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedUser = await deleteUserById(id);

    return res.json(deletedUser);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const resetPassword = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Username and newPassword are required");
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send("User not found");
    }

    user.password = password;
    await user.save();

    return res
      .status(200)
      .json({ message: "Password updated successfully", user: user });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).send("Internal server error");
  }
};
