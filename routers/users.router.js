const express = require("express");
const { getAllUsers, getUser } = require("../controllers/app.controllers");

const usersRouter = express.Router();

usersRouter.get("/", getAllUsers);
usersRouter.get("/:username", getUser)
module.exports = usersRouter;