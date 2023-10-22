const mongoose = require("mongoose");

const issuedBookSchem = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "book",
  },
  issuedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  issueDate: {
    type: String,
    required: true,
  },
  returnDate: {
    type: String,
    required: true,
  },
  // late and fine field add karbani..
});

const IssuedBook = mongoose.model("IssuedBook", issuedBookSchem);

module.exports = { IssuedBook };
