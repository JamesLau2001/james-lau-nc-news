const {
  getTopics,
  getApi,
  getArticleById,
} = require("../controllers/app.controllers");

const express = require("express");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleById);

app.use((err, request, response, next) => {
  if (err.message === "article does not exist") {
    response.status(404).send(err);
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ message: "bad request" });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send({ msg: "internal server error" });
});
module.exports = { app };
