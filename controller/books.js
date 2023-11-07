// const express = require("express");
// const route = express.Router();
const _ = require("lodash");
const { Book } = require("../model/books");
const bucket = require("../firebase/firebaseconfig");

// const {
//   verifyToken,
//   veriftTokenAndUser,
//   verifyTokenAndAdmin,
// } = require("../route/verifyToken");
// const { User } = require("../model/user");
const { RESPONS_CODE } = require("../config");

const config = {
  action: "read", // Specify 'read' for object retrieval
  expires: "2030-01-01T00:00:00Z", // Set the expiration time
};

const getSignedImageUrls = (books) => {
  return Promise.all(
    books.map(async (book) => {
      if (book.image) {
        const bucketImage = bucket.file(book.image);
        const signedUrl = await bucketImage.getSignedUrl(config);
        book.image = signedUrl[0]; // Replace the original URL with the signed URL
      }
      return book;
    })
  );
};

// route.get("/", verifyToken, async (req, res) => {
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    // Generate signed URLs for book images
    const booksWithSignedUrls = await getSignedImageUrls(books);

    return res.status(200).json({
      message: "Successfully get all books with signed URLs",
      code: RESPONS_CODE.SUCCESS,
      data: booksWithSignedUrls,
    });
  } catch (err) {
    console.log(err);
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

    const fileName = `${imageFile.originalname}_${new Date().getTime()}.jpg`; // Customize as needed

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

      const book = new Book({ ...submitData, image: file.name });

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
