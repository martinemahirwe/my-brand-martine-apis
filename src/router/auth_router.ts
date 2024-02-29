import express from "express";

import { register, login, logout } from "../controlles/auth_controller";

export default (router: express.Router) => {
  router.post("/auth/register", register);
  router.post("/auth/login", login);
  router.get("/auth/logout", logout);
};
