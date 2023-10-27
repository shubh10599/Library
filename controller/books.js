// const express = require("express");
// const route = express.Router();
const _ = require("lodash");
const { Book } = require("../model/books");
const bucket = require("../firebase/firebaseconfig");
const admin = require("firebase-admin");
// const {
//   verifyToken,
//   veriftTokenAndUser,
//   verifyTokenAndAdmin,
// } = require("../route/verifyToken");
// const { User } = require("../model/user");
const { RESPONS_CODE } = require("../config");

// route.get("/", verifyToken, async (req, res) => {
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();

    return res.status(200).json({
      message: "successfully get all books",
      code: RESPONS_CODE.SUCCESS,
      data: books,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      code: RESPONS_CODE.ERROR,
    });
  }
};

// route.get("/:id", verifyToken, async (req, res) => {
exports.getBookById = async (req, res) => {
  const id = req.params.id;
  try {
    let book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({
        code: RESPONS_CODE.ERROR,
        message: "book ot found",
      });
    }
    return res.status(200).json({
      message: "book retrive successfully",
      data: book,
      code: RESPONS_CODE.SUCCESS,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      code: RESPONS_CODE.ERROR,
    });
  }
};

// route.post("/", verifyToken, async (req, res) => {
exports.createBook = async (req, res) => {
  try {
    const imageFile = req.file;

    const fileName = `unique_filename_${new Date().getTime()}.jpg`; // Customize as needed

    // Create a reference to the image file in Firebase Storage
    const file = bucket.file(fileName);

    // Create a write stream to upload the file
    const blobStream = file.createWriteStream({
      metadata: {
        contentType: imageFile.mimetype,
      },
    });

    // Handle successful upload
    blobStream.on("finish", async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
      const submitData = _.pick(req.body, [
        "title",
        "author",
        "available",
        "desc",
        "category",
        "image",
        "createdAt",
        "updatedAt",
      ]);

      const book = new Book({ ...submitData, image: publicUrl });

      const result = await book.save();
      return res.status(201).json({
        message: "book created successsully",
        code: RESPONS_CODE.SUCCESS,
        data: result,
      });
    });

    // Handle any errors during the upload
    blobStream.on("error", (error) => {
      console.error(error);
      res.status(500).json({ error: "Image upload failed" });
    });

    // Start the upload by sending the image buffer
    blobStream.end(imageFile.buffer);
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      code: RESPONS_CODE.ERROR,
    });
  }
};

// route.delete("/", verifyTokenAndAdmin, async (req, res) => {
exports.deleteBook = async (req, res) => {
  const id = req.params.id;
  try {
    let book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({
        message: "book not found",
        data: book,
        code: RESPONS_CODE.ERROR,
      });
    }
    return res.status(200).json({
      message: "book deleted successfully",
      code: RESPONS_CODE.SUCCESS,
    });
    // await book.save();  // book save karavani jarur nai kem ke direct save thai jay 6..
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      code: RESPONS_CODE.ERROR,
    });
  }
};

// route.put("/:id", verifyTokenAndAdmin, async (req, res) => {
//   //1 check password..

//   try {
//     let user = await User.findByIdAndUpdate(
//       req.params.id,
//       {
//         $set: req.body,
//       },
//       { new: true }
//     );
//     res.send(user);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// route.put("/:id", veriftTokenAndUser, async (req, res) => {
exports.updateBook = async (req, res) => {
  const id = req.params.id;
  try {
    let book = await Book.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    if (!book) {
      return res.status(404).json({
        message: "book not found",
        code: RESPONS_CODE.ERROR,
      });
    }
    return res.status(200).json({
      message: "book updated successfully",
      data: book,
      code: RESPONS_CODE.SUCCESS,
    });
  } catch (error) {
    res.status(400).json({
      message: err.message,
      code: RESPONS_CODE.ERROR,
    });
  }
};
