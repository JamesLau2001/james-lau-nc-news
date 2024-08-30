const express = require("express");
const {
  deleteComment,
  patchComment,
} = require("../controllers/app.controllers");

const commentsRouter = express.Router();

commentsRouter.delete("/:comment_id", deleteComment);
commentsRouter.patch("/:comment_id", patchComment);

module.exports = commentsRouter;
