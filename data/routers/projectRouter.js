const express = require("express");

const project = require("../helpers/projectModel");
const actions = require("../helpers/actionModel");

const projectRouter = express.Router();

// Middleware

// Endpoints

projectRouter.get("/", (req, res) => {
  projects
    .get()
    .then(allProjects => {
      //console.log(allProjects, 'response from GET /');
      res.status(200).json(allProjects);
    })
    .catch(error => {
      console.log(error, "Error from get /");
      res
        .status(500)
        .json({ errorMessage: "internal error fetching GET for allProjects" });
    });
});

module.exports = projectRouter;
