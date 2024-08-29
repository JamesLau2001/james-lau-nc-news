const express = require("express");
const { getApi, getTopics } = require("../controllers/app.controllers");

const apiRouter = express.Router();

apiRouter.get("/", getApi);
apiRouter.get("/topics", getTopics);

module.exports = apiRouter;