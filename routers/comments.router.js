const express = require("express");
const { deleteComment } = require("../controllers/app.controllers");

const commentsRouter = express.Router();

commentsRouter.delete("/:comment_id", deleteComment);

module.exports = commentsRouter;