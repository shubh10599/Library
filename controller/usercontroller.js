const { User } = require("../model/user");
const { Book } = require("../model/books");
const { verifyToken } = require("../route/verifyToken");
const express = require("express");
const route = express.Router();

const getData = async (req, res) => {
  // $unionwith : "collection name"
  console.log(req.user);
  try {
    const data = await User.aggregate([
      { $unionWith: "book" },
      {
        $project: {
          name: "$name",
          duration: "$duration",
          issueBook: "$issueBook",
        },
      },
      { $sort: { name: 1 } },
    ]);
    res.status(200).send(data);
  } catch (err) {
    res.status(400).send(err);
  }
};

route.get("/getdata", verifyToken, getData);

module.exports = route;
