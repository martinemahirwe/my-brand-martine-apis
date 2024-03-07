import { get, merge } from "lodash";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserModel } from "../models/user_model";
dotenv.config();

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: (err?: Error) => void
) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "MARTINE_API", (err: any, decodedToken: any) => {
      if (err) {
        console.log(err.message);
        //res.redirect('/login');
      } else {
        next();
      }
    });
  } else {
    res.status(403).send("Access forbidden: You are not logged in");
  }
};
export const isOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
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

export const isAdmin = (
  req: Request,
  res: Response,
  next: (err?: Error) => void
) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "MARTINE_API", async (err: any, decodedToken: any) => {
      if (err) {
        res
          .status(403)
          .send(
            "Access forbidden: You do not have permission to access this resource."
          );
      } else {
        const user = await UserModel.findById(decodedToken.id);

        if (user && user.userRole === "admin") {
          next();
        } else {
          res
            .status(403)
            .send(
              "Access forbidden: You do not have permission to access this resource."
            );
        }
      }
    });
  } else {
    res
      .status(403)
      .send(
        "Access forbidden: You do not have permission to access this resource."
      );
  }
};
