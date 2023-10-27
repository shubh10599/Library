const express = require("express");
const route = express.Router();
const bookController = require("../controller/books");
const { verifyToken } = require("./verifyToken");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

route.get("/", verifyToken, bookController.getAllBooks);
route.get("/:id", verifyToken, bookController.getBookById);

route.post(
  "/",
  verifyToken,
  upload.single("bookImage"),
  bookController.createBook
);

route.put("/:id", verifyToken, bookController.updateBook);
route.delete("/:id", verifyToken, bookController.deleteBook);

module.exports = route;
