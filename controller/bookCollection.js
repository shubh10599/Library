const mongoose = require("mongoose");

const bookCllectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "book",
  },
});

const BookCollection = mongoose.model(
  "bookCollectionTable",
  bookCllectionSchema
);

module.exports = { BookCollection, bookCllectionSchema };
