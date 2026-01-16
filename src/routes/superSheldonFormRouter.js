const express = require("express");
const superSheldonFormRouter = express.Router();

const submitForm = require("../controller/superSheldonFormController");

superSheldonFormRouter.post("/submit", submitForm);

module.exports = superSheldonFormRouter;

