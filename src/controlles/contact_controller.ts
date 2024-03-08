import express from "express";
import {
  getMessages,
  createMessage,
  deleteMessageById,validateMessage
} from "../models/contact_model";

export const getAllMessages = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const messages = await getMessages();
    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

export const createNewMessage = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.sendStatus(400);
    }
      const { error } = validateMessage(req.body);
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
    const newMessage = await createMessage({
      name,
      email,
      message,
    });
    res
      .status(201)
      .json({
        success: true,
        data: newMessage,
      })
      .end();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};

export const deleteMessage = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deletedBlog = await deleteMessageById(id);
    return res.json(deletedBlog);
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      error: "can not delete message",
    });;
  }
};
