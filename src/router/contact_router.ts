import {
  createNewMessage,
  deleteMessage,
  getAllMessages,
} from "../controlles/contact_controller";
import express from "express";
import { isAuthenticated, isAdmin } from "../middlewares/index";

export default (router: express.Router) => {
  /**
   * @openapi
   * /messages/create:
   *   post:
   *     summary: Create a new message
   *     tags: [Messages]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *               message:
   *                 type: string
   *             required:
   *               - name
   *               - email
   *               - message
   *     responses:
   *       201:
   *         description: Message created successfully
   *       400:
   *         description: Bad request
   *       500:
   *         description: Internal server error
   */
  router.post("/messages/create", createNewMessage);

  /**
   * @openapi
   * /messages:
   *   get:
   *     summary: Get all messages
   *     tags: [Messages]
   *     responses:
   *       200:
   *         description: Retrieved all messages successfully
   *       500:
   *         description: Internal server error
   */
  router.get("/messages", isAuthenticated, isAdmin, getAllMessages);
  /**
   * @openapi
   * components:
   *   schemas:
   *     Message:
   *       type: object
   *       properties:
   *         _id:
   *           type: string
   *         name:
   *           type: string
   *           description: The name of the message sender
   *         message:
   *           type: string
   *           description: The content of the message
   *         email:
   *           type: string
   *           format: email
   *           description: The email address of the message sender
   *       required:
   *         - name
   *         - message
   *         - email
   */

  /**
   * @openapi
   * /messages/{id}:
   *   delete:
   *     summary: Delete a message by ID
   *     tags: [Messages]
   *     parameters:
   *       - in: path
   *         name: id
   *         schema:
   *           type: string
   *         required: true
   *         description: ID of the message to delete
   *     responses:
   *       200:
   *         description: Message deleted successfully
   *       400:
   *         description: Bad request
   *       500:
   *         description: Internal server error
   */
  router.delete("/messages/:id", isAuthenticated, isAdmin, deleteMessage);
};
