const express = require("express");
const apiRouter = require("../routers/api.router");
const articlesRouter = require("../routers/articles.router");
const commentsRouter = require("../routers/comments.router");
const usersRouter = require("../routers//users.router");
const app = express();
const cors = require("cors");
app.use(cors());


app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/users", usersRouter);

//  //  //  //  //  //  //  //  //
//  //  //  //  //  //  //  //  //
app.use((err, request, response, next) => {
  if (err.status && err.message) {
    response.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.code === "22P02" || err.code === "23502") {
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
