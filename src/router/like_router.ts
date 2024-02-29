import { getAllLikes, createOneLike } from "../controlles/like_controller";
import express from "express";

export default (router: express.Router) => {
  router.post("/likes/create", createOneLike);
  router.get("/likes", getAllLikes);
};
