import express from "express";
import { get, merge } from "lodash";

import { getUserBySessionToken } from "../models/user_model";

// export const isAdmin = async (
//   req: express.Request,
//   res: express.Response,
//   next: express.NextFunction
// ) => {
//   try {
//     const { email, password } = req.headers;

//     if (email === "mahirwe@gmail.com" && password === "Admin@123!") {
//       next();
//     } else {
//       res.status(403).json({ message: "Unauthorized" });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(400);
//   }
// };

export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;

    if (!currentUserId) {
      return res.sendStatus(403);
    }
    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }
    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["MARTINE-AUTH"];

    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken);

    if (!existingUser) {
      return res.sendStatus(403);
    }
    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};