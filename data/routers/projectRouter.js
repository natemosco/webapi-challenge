const express = require("express");

const project = require("../helpers/projectModel");
const actions = require("../helpers/actionModel");

const projectRouter = express.Router();

// Middleware
function validateProjectId(req, res, next) {
  project
    .get(req.params.id)
    .then(project => {
      if (!project) {
        res
          .status(404)
          .json({
            errorMessage:
              "Project by this Id does not exist. actions cannot be added without corresponding project."
          });
      } else {
        next();
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ errorMessage: "internal error, could not complete request" });
    });
}
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

projectRouter.get("/:id", validateProjectId, (req, res) => {
  projects
    .get(req.params.id)
    .then(singleProject => {
      //console.log(singleProject, 'response from GET /:id');
      res.status(200).json(singleProject);
    })
    .catch(error => {
      console.log(error, "Error from get /:id");
      res
        .status(500)
        .json({ errorMessage: "internal error fetching project by id" });
    });
});

module.exports = projectRouter;
