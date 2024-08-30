const express = require("express");
const {
  getArticleById,
  getArticles,
  getComments,
  postComment,
  patchArticle,
  postArticle,
} = require("../controllers/app.controllers");

const articlesRouter = express.Router();

articlesRouter.get("/", getArticles);
articlesRouter.get("/:article_id", getArticleById);
articlesRouter.get("/:article_id/comments", getComments);
articlesRouter.post("/:article_id/comments", postComment);
articlesRouter.patch("/:article_id", patchArticle);
articlesRouter.post("/", postArticle)

module.exports = articlesRouter;