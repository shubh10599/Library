// const express = require("express");
const { User } = require("../model/user");
const { Book } = require("../model/books");
const { IssuedBook } = require("../model/issuedBook");
// const { verifyToken } = require("../route/verifyToken");
const { RESPONS_CODE } = require("../config");
// const route = express.Router();

exports.issueBook = async (req, res) => {
  // duration
  console.log(res);
  const {
    id,
    // issueDate, returnDate
  } = req.params;
  const { issueDate, returnDate } = req.body;
  const { id: UserId } = req.user;
  try {
    const user = await User.findById(UserId);
    const book = await Book.findById(id);

    if (!user || !book) {
      return res.status(404).json({
        message: "user or book not found",
      });
    }

    if (!book.available) {
      return res.status(404).json({
        message: "book is alreay issued",
      });
    }

    // const issueDate = new Date();
    // const returnDate = new Date();

    // returnDate.setDate(returnDate.getDate() + 14);

    user.borrowedBook.push({
      bookId: id,
      issueDate,
      returnDate,
    });
    // const issuedBook = new User({

    //   issuedTo: UserId,

    // });
    // const issuedBook =
    book.available = false;
    // history purpose..
    // user.borrowedBook.push({
    //   book: id,
    // });

    // await issuedBook.save();
    await user.save();
    await book.save();

    return res.status(201).json({
      message: "book issued successfully",
      data: user.borrowedBook,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

// exports.getIssueBook = async (req, res) => {
//   try {
// const { id } = req.params;
// console.log(id);
// // when you can selct on 1 populate method then you can use this syntecs like...
// const user = await User.findById(id);
// // .populate({ path: "book", select: "title category issueDate returnDate" })
// // .populate({ path: "issuedTo", select: "name isAdmin email" });
// res.status(200).json({
//   user,
//   message: "successfully get issuedbooks!",
// });
//     res.send("hello");
//   } catch (err) {
//     res.status(404).json({
//       message: err.message,
//     });
//   }
// };

exports.returnBook = async (req, res) => {
  const { id } = req.user;
  const { id: bookid } = req.params;
  const { returnDate, issueDate } = req.body;

  try {
    let user = await User.findById(id);
    if (!user) {
      return res.status(401).json({
        message: "user not found",
        code: RESPONS_CODE.ERROR,
      });
    }
    user.borrowedBook = user.borrowedBook.map((book) => {
      if (book.bookId == bookid) {
        book.returned = true;
        book.returnDate = returnDate;
        book.issueDate = issueDate;
      }
      return book;
    });

    let book = await Book.findById(bookid);
    book.available = true;
    
    await user.save();
    await book.save();
    return res.status(200).json({
      message: "successfully returned",
      data: user,
      code: RESPONS_CODE.SUCCESS,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
      code: RESPONS_CODE.ERROR,
    });
  }
};

// route.get("/", verifyToken, this.getIssueBook);
// route.post("/:id", verifyToken, this.issueBook);
// route.post("/return/:id", verifyToken, returnBook);

// return book baki   post karvi padse.
