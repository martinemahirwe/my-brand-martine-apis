import {
  createNewMessage,
  deleteMessage,
  getAllMessages,
} from "../controlles/contact_controller";
import express from "express";

export default (router: express.Router) => {
  router.post("/messages/create", createNewMessage);
  router.get("/messages", getAllMessages);
  router.delete("/messages/:id", deleteMessage);
};
