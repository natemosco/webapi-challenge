const express = require("express");

const project = require("../helpers/projectModel");
const actions = require("../helpers/actionModel");

const actionRouter = express.Router();

// Custom Middleware
function validateActionId(req, res, next) {
  actions
    .get(req.params.id)
    .then(singleUser => {
      if (!singleUser) {
        res.status(404).json({ errorMessage: "Action does not exist" });
      } else {
        next();
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ errorMessage: "internal error, could not process request." });
    });
}

function validateActionBody(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    req.status(400).json({ errorMessage: "missing data for action body" });
  } else if (!req.body.notes || !req.body.description) {
    res
      .status(400)
      .json({ errorMessage: "notes and description are required" });
  } else if (
    typeof req.body.notes !== "string" ||
    typeof req.body.description !== "string"
  ) {
    res.status(400).json({
      errorMessage: "notes and description required to be type: string"
    });
  } else {
    next();
  }
}

function validateProjectId(req, res, next) {
  project
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

// Endpoints
actionRouter.get("/", (req, res) => {
  actions
    .get()
    .then(allActions => {
      //console.log(action, 'response from GET /');
      res.status(200).json(allActions);
    })
    .catch(error => {
      console.log(error, "Error from get /");
      res
        .status(500)
        .json({ errorMessage: "internal error fetching all actions" });
    });
});

actionRouter.get("/:id", validateActionId, (req, res) => {
  actions
    .get(req.params.id)
    .then(singleAction => {
      //console.log(singleAction, 'response from GET /:id');
      res.status(200).json(singleAction);
    })
    .catch(error => {
      console.log(error, "Error from get /:id");
      res
        .status(500)
        .json({ errorMessage: "internal error fetching action by Id " });
    });
});

actionRouter.post(
  "/:id",
  [validateProjectId, validateActionBody],
  (req, res) => {
    const id = Number(req.params.id);
    const newAction = { ...req.body, project_id: id };
    actions
      .insert(newAction)
      .then(action => {
        res.status(200).json(action);
      })
      .catch(error => {
        console.log(error, "Error from POST /:id");
        res
          .status(500)
          .json({ errorMessage: "internal error processing POST" });
      });
  }
);

actionRouter.delete("/:id", validateActionId, (req, res) => {
  actions
    .remove(req.params.id)
    .then(deletedAction => {
      actions.get().then(allActions => {
        res.status(200).json(deletedAction, allActions);
      });
    })
    .catch(error => {
      console.log(error, "Error from get /");
      res.status(500).json({ errorMessage: "internal error deleting action" });
    });
});

actionRouter.put("/:id", [validateActionId, validateActionBody], (req, res) => {
  actions
    .update(Number(req.params.id), req.body)
    .then(updatedAction => {
      //console.log(updatedAction, 'response from PUT /:id');
      actions.get().then(allActions => {
        res.status(200).json(updatedAction, allActions);
      });
    })
    .catch(error => {
      console.log(error, "Error from get /:id");
      res
        .status(500)
        .json({ errorMessage: "internal error updating specified action" });
    });
});

module.exports = actionRouter;
