const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const mongoose = require("mongoose");
const book = require("./route/book");
const auth = require("./route/user");
// const userController = require("./controller/usercontroller");
// const collection = require("./route/bookCollectTable");
const issueBook = require("./route/isBookController");

app.use(express.json());
app.use(cors());

app.use("/api/books", book);
app.use("/api/user", auth);
// app.use("/user", userController);
app.use("/api/user/issuebook", issueBook);
// app.use("/", collection);
mongoose
  .connect(process.env.mongo_url)
  .then(() => {
    console.log("connect to database!");
  })
  .catch((error) => {
    console.log(error.message);
  });

app.get("/", (req, res) => {
  res.send("hello everyone!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("listing port", PORT);
});
