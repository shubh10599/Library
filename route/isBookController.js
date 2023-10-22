const express = require("express");
const route = express.Router();
const { verifyToken } = require("./verifyToken");
const issueBookController = require("../controller/issueBook");

route.post("/return/:id", verifyToken, issueBookController.returnBook);
route.post("/:id", verifyToken, issueBookController.issueBook);

module.exports = route;
