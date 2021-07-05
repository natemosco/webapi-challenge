const express = require("express");

const projects = require("../helpers/projectModel");
const actions = require("../helpers/actionModel");

const projectRouter = express.Router();

// Middleware
function validateProjectId(req, res, next) {
  projects
    .get(req.params.id)
    .then(project => {
      if (!project) {
        res.status(404).json({
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
function validateProjectBody(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    req.status(400).json({ errorMessage: "missing data for project body" });
  } else if (!req.body.name || !req.body.description) {
    res.status(400).json({ errorMessage: "name and description are required" });
  } else if (
    typeof req.body.name !== "string" ||
    typeof req.body.description !== "string"
  ) {
    res.status(400).json({
      errorMessage: "name and description required to be type: string"
    });
  } else {
    next();
  }
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

projectRouter.post("/", validateProjectBody, (req, res) => {
  projects
    .insert(req.body)
    .then(newProject => {
      //console.log(newProject, 'response from POST /');
      projects.get().then(allProjects => {
        res.status(200).json(newProject, allProjects);
      });
    })
    .catch(error => {
      console.log(error, "Error from get /");
      res
        .status(500)
        .json({ errorMessage: "internal error creating new Project" });
    });
});

projectRouter.delete("/:id", validateProjectId, (req, res) => {
  projects
    .remove(req.params.id)
    .then(deleted => {
      //console.log(deleted, 'response from GET /:id');
      projects.get().then(allProjects => {
        projects.get(req.params.id).then(deletedObj => {
          res
            .status(200)
            .json({ deleted: { deleted, deletedObj }, allProjects });
        });
      });
    })
    .catch(error => {
      console.log(error, "Error from Delete /:id");
      res
        .status(500)
        .json({ errorMessage: "internal error when trying to delete" });
    });
});

projectRouter.put(
  "/:id",
  [validateProjectId, validateProjectBody],
  (req, res) => {
    projects
      .update(req.params.id, req.body)
      .then(updatedProject => {
        //console.log(updatedProject, 'response from PUT /:id');
        projects.get().then(allProjects => {
          res.status(200).json(updatedProject, allProjects);
        });
      })
      .catch(error => {
        console.log(error, "Error from PUT /:id");
        res
          .status(500)
          .json({ errorMessage: "internal error updating project" });
      });
  }
);

module.exports = projectRouter;
