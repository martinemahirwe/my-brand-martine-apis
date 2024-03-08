import express from "express";

import {
  deleteUser,
  getAllUsers,
  resetPassword,
  getUser,
} from "../controlles/users_controllers";
import { isAdmin, extractToken } from "../middlewares/index";

export default (router: express.Router) => {
  /**
   * @openapi
   * components:
   *   schemas:
   *     UserModel:
   *       type: object
   *       properties:
   *         _id:
   *           type: string
   *         username:
   *           type: string
   *           description: The username of the user
   *         email:
   *           type: string
   *           format: email
   *           description: The email address of the user
   *         password:
   *           type: string
   *           description: The password of the user
   *         userRole:
   *           type: string
   *           description: The role of the user
   *         id:
   *           type: string
   *         token:
   *           type: string
   *           description: The authentication token of the user
   *       required:
   *         - email
   *         - password
   */

  /**
   * @openapi
   * /users:
   *   get:
   *     summary: Get all users
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: A list of all users
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/UserModel'
   *       400:
   *         description: Bad request
   *       500:
   *         description: Internal server error
   */
  router.get("/users", extractToken, isAdmin, getAllUsers);

  /**
   * @openapi
   * /users/{id}:
   *   get:
   *     summary: Get a user by ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the user to retrieve
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Returns the user object
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserModel'
   *       400:
   *         description: Bad request
   *       500:
   *         description: Internal server error
   */
  router.get("/users/:id", getUser);

  /**
   * @openapi
   * /users/{id}:
   *   delete:
   *     summary: Delete a user by ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID of the user to delete
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: User deleted successfully
   *       400:
   *         description: Bad request
   *       500:
   *         description: Internal server error
   */

  router.delete("/users/:id", extractToken, isAdmin, deleteUser);

  /**
   * @openapi
   * /users/password:
   *   patch:
   *     summary: Update logged-in user's password
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *     responses:
   *       200:
   *         description: Password updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Password updated successfully
   *                 user:
   *                   $ref: '#/components/schemas/UserModel'
   *       400:
   *         description: Bad request
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Email and password are required
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: User not found
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Internal server error
   */

  router.patch("/users/password", resetPassword);
};
