const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image: {
      type: String || null,
      default: null,
    },
    available: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: String,
      required: true,
    },
  }
  // { timestamps: true }
);
// accpet date by user because current date refer usdate so create field and then..

const Book = mongoose.model("book", bookSchema);

module.exports = { Book, bookSchema };
