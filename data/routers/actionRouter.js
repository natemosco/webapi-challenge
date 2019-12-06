const express = require("express");

const project = require("../helpers/projectModel");
const actions = require("../helpers/actionModel");

const actionRouter = express.Router();
const data = require("../dbConfig");

// Custom Middleware
function validateId(req, res, next){
    actions
    .get.(req.params.id)
        .then( singleUser=> {
            if (!singleUser){
                res.status(404).json({errorMessage: "Action does not exist"});
            }
            else {
                next();
            }
        })
        .catch(error => {
            res.status(500).json({ errorMessage: 'internal error, could not get action by Id '});
        });
}


actionRouter.get('/', (req, res) => {
    actions
        .get()
        .then(action => {
            //console.log(action, 'response from GET /');
            res.status(200).json(action);
        })
        .catch(error => {
            console.log(error, 'Error from get /');
            res.status(500).json({ errorMessage: 'internal error fetching all actions'});
        });
});

actionRouter.get('/:id', validateId, (req, res) => {
    actions
        .get(req.params.id)
        .then(singleAction => {
            //console.log(singleAction, 'response from GET /:id');
            res.status(200).json(singleAction);
        })
        .catch(error => {
            console.log(error, 'Error from get /:id');
            res.status(500).json({ errorMessage: 'internal error fetching action by Id '});
        });
});






module.exports = actionRouter;
