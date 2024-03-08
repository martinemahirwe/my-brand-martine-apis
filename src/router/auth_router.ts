/**
 * @openapi
 * tags:
 *   name: Authentication
 */

import express from "express";

import { register, login,logout} from "../controlles/auth_controller";

export default (router: express.Router) => {
  /**
   * @openapi
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Authentication]
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
   *               userRole:
   *                 type: string
   *             required:
   *               - email
   *               - password
   *               - userRole
   *     responses:
   *       201:
   *         description: User registered successfully
   *       400:
   *         description: Bad request, missing required fields or invalid data
   *       500:
   *         description: Internal server error
   */
  router.post("/auth/register", register);
  /**
   * @openapi
   * /auth/login:
   *   post:
   *     summary: Login with existing user credentials
   *     tags: [Authentication]
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
   *             required:
   *               - email
   *               - password
   *     responses:
   *       200:
   *         description: User logged in successfully
   *       400:
   *         description: Bad request, invalid email or password
   *       500:
   *         description: Internal server error
   */
  router.post("/auth/login", login);


  /**
   * @openapi
   * /logout:
   *   post:
   *     summary: Logout the user
   *     tags: [Authentication]
   *     responses:
   *       200:
   *         description: User logged out successfully
   *       500:
   *         description: Internal server error
   */
  router.post("/logout", logout);
};
