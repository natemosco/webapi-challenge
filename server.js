const express = require("express");
const helmet = require("helmet");

const projectsRouter = require("./data/routers/projectRouter");
const actionsRouter = require("./data/routers/actionRouter");

const server = express();

//any custom middleware
function logger(req, res, next) {
  const timestamp = new Date();
  console.log(`${req.method}, to ${req.originalUrl} at ${timestamp}`);
  next();
}

const globalMiddleware = [helmet(), express.json(), logger];

server.use(globalMiddleware);
server.use("/api/projects", projectsRouter);
server.use("/api/actions", actionsRouter);

server.get("/", (req, res) => {
  console.log("Welcome to Node Sprint 1 web-api-challenge");
  res
    .status(200)
    .json({ message: "Welcome to Node Sprint 1 web-api-challenge" });
});

module.exports = server;
