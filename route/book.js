const express = require("express");
const route = express.Router();
const bookController = require("../controller/books");
const { verifyToken } = require("./verifyToken");

route.get("/", verifyToken, bookController.getAllBooks);
route.get("/:id", verifyToken, bookController.getBookById);
route.post("/", verifyToken, bookController.createBook);
route.put("/:id", verifyToken, bookController.updateBook);
route.delete("/:id", verifyToken, bookController.deleteBook);

module.exports = route;
