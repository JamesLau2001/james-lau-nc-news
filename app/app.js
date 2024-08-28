const {
  getTopics,
  getApi,
  getArticleById,
  getArticles,
  getComments,
  postComment,
  patchArticle,
  deleteComment,
  getAllUsers,
} = require("../controllers/app.controllers");

const express = require("express");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchArticle);

app.delete("/api/comments/:comment_id", deleteComment);

app.get("/api/users", getAllUsers);

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ message: "bad request" });
  } else if (err.code === "23502") {
    response.status(400).send({ message: "bad request" });
  } else if (err.code === "42703") {
    response.status(400).send({ message: "bad request" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.message) {
    response.status(404).send(err);
  } else if (err.message === "not found") {
    response.status(404).send(err);
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send({ msg: "internal server error" });
});
module.exports = { app };
