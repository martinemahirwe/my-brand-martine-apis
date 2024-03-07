import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { getUserByEmail, createUser, validateUser } from "../models/user_model";

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const maxAge = 2 * 24 * 60 * 60;
    const { email, password } = req.body;
    const { error } = validateUser(req.body);
    if (error) {
      return res
        .status(400)
        .send("Validation failed: " + error.details[0].message);
    }
    const user = await getUserByEmail(email);

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id }, "MARTINE_API", {
      expiresIn: maxAge,
    });

    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });

    res.status(200).json({
      user: { _id: user._id, email: user.email, userRole: user.userRole },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const logout = (req: express.Request, res: express.Response) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.send("Logged out successfully");
};

export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, userRole } = req.body;

    const { error } = validateUser(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ message: "Email address already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser({
      email,
      password: hashedPassword,
      userRole,
    });

    return res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
