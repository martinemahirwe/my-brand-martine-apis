import express from "express";
import authentication from "./auth_router";
import users from "./users_router";
import blogs from "./blog_router";
import messages from "./contact_router";
import likes from "./like_router";
import comments from "./comment_router";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  users(router);
  blogs(router);
  messages(router);
  likes(router);
  comments(router);

  return router;
};
