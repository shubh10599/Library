// const express = require("express");
// const route = express.Router();
const _ = require("lodash");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { User, validateUser } = require("../model/user");
const bcrypt = require("bcryptjs");
const { RESPONS_CODE } = require("../config/index");
// const {
//   verifyToken,
//   veriftTokenAndUser,
//   verifyTokenAndAdmin,
// } = require("../route/verifyToken");

// route.post("/registration", async (req, res) => {
exports.createuser = async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) return res.status(404).send(error.details[0].message);
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res.status(409).json({
        code: RESPONS_CODE.ERROR,
        message: "User already exists!",
      });

    user = new User(
      _.pick(req.body, ["userName", "email", "password", "isAdmin", "phone"])
    );
    // user.password = CryptoJS.AES.encrypt(
    //   req.body.password,
    //   process.env.password_srck
    // ).toString();
    console.log(req.body.passsword);
    const salt = await bcrypt.genSalt(10);
    console.log(salt);
    const hashpassword = await bcrypt.hash(req.body.password, salt);
    console.log(hashpassword);
    user.password = hashpassword;

    // console.log(by);
    user = await user.save();
    // console.log(user);
    const acctoken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.token_scrk,
      { expiresIn: 60 * 60 }
    );

    return res.status(200).json({
      message: "User successfully created",
      code: RESPONS_CODE.SUCCESS,
      data: {
        token: acctoken,
        // you also apply same name of user for response user it's not affect of variabble user
        user: {
          name: user.userName,
          phone: user.phone,
          email: user.email,
        },
      },
      // response 200,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      code: RESPONS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
};

// route.post("/login", async (req, res) => {
exports.loginuser = async (req, res) => {
  // login ma kadapi validate nai karvanu kem ke e je validate function ma lakhyu hase e chaeck karse..
  //   const { error } = validateUser(req.body);
  //   if (error) return res.status(404).send(error.details[0].message);
  // console.log(res);
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(510).json({
        code: RESPONS_CODE.UNAUTHORIZED,
        message: "Invalid email address",
      });
    }
    const decryptedData = await bcrypt.compare(
      req.body.password,
      user.password
    );
    console.log(decryptedData);
    if (!decryptedData) {
      console.log(res);
      return res.status(401).json({
        code: RESPONS_CODE.UNAUTHORIZED,
        message: "Invalid password.",
      });
    }
    const acctoken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.token_scrk,
      { expiresIn: "2d" }
    );
    return res.status(200).json({
      message: "Login Successful",
      code: RESPONS_CODE.SUCCESS,
      token: acctoken,
      data: {
        name: user.userName,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message,
      code: RESPONS_CODE.ERROR,
    });
  }
};

// route.get("/all", verifyTokenAndAdmin, async (req, res) => {
exports.getAllUser = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      code: RESPONS_CODE.SUCCESS,
      message: "successfully get all users",
      users: users,
    });
  } catch (err) {
    return res.status(500).json({
      code: RESPONS_CODE.ERROR,
      message: err.message,
    });
  }
};

// route.get("/:id", verifyTokenAndAdmin, async (req, res) => {
exports.getUserbyId = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        code: RESPONS_CODE.ERROR,
        message: "User not Found!",
      });
    }
    return res.status(200).json({
      code: RESPONS_CODE.SUCCESS,
      message: "User retrieved successfully",
      data: user,
    });
  } catch (err) {
    // console.log("get user by id", err);
    return res.status(400).json({
      message: err.message,
      code: RESPONS_CODE.ERROR,
    });
  }
};

// route.get("/his", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     // const { id } = req.user;
//     // console.log(id);
//     const user = await User.findById(req.user.id);
//     // let result = await user.populate("borrowedBook");
//     res.status(200).json({
//       message: "successfully get user",
//       data: user,
//     });
//   } catch (err) {
//     res.status(404).json({
//       message: err.message,
//     });
//   }
// });

// route.get("/his", verifyToken, async (req, res) => {
//   let user = await User.findById(req.body.id);
//   console.log(user);
//   res.send(user);
// });

// route.put("/changepassword", verifyToken, async (req, res) => {
exports.changePassword = async (req, res) => {
  // console.log(req.user.id, "hello");
  // console.log("helo");
  let user;
  try {
    if (req.body.password) {
      // req.body.password = CryptoJS.AES.encrypt(
      //   req.body.passsword,
      //   process.env.password_srck
      // ).toString();
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);
      // console.log(hash);
      req.body.password = hash;
      // ahi evu hoy ke je hu change karau ej change thay baki as it is re..
      user = await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      // await user.save();
      if (!user) {
        return res.status(404).json({
          code: RESPONS_CODE.ERROR,
          message: "Usernot found!",
        });
      }
    }
    return res.status(200).json({
      code: RESPONS_CODE.SUCCESS,
      data: user,
      message: "change password successfully!",
    });
  } catch (err) {
    return res.status(404).json({
      message: err.message,
      code: RESPONS_CODE.ERROR,
    });
  }
};

// route.get("/history", verifyToken, async (req, res) => {
exports.getHistory = async (req, res) => {
  // issued date return date batavani..
  const id = req.user.id;
  // console.log(id);
  let user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      message: "user not found",
      code: RESPONS_CODE.ERROR,
    });
  }

  user = user.borrowedBook;

  res.status(200).json({
    data: user,
    message: "success fetch data",
    code: RESPONS_CODE.SUCCESS,
  });
  try {
  } catch (err) {
    res.status(404).json({
      message: "bad request",
      code: RESPONS_CODE.ERROR,
    });
  }
};

exports.deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    let deleteduser = await User.findByIdAndDelete(id);
    // console.log(deleteduser);
    if (!deleteduser) {
      return res.status(404).json({
        code: RESPONS_CODE.ERROR,
        mesage: "user not found",
      });
    }
    // await deleteduser.save();
    return res.status(200).json({
      code: RESPONS_CODE.SUCCESS,
      message: "successfully deleted",
    });
  } catch (err) {
    // console.log("delete user", err);

    return res.status(400).json({
      message: err.message,
      code: RESPONS_CODE.ERROR,
    });
  }
};
