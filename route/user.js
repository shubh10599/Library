const { verifyToken } = require("./verifyToken");
const usercontroller = require("../controller/auth");
const express = require("express");
const route = express.Router();

route.post("/registration", usercontroller.createuser);
route.post("/login", usercontroller.loginuser);
route.get("/all", verifyToken, usercontroller.getAllUser);
route.get("/history", verifyToken, usercontroller.getHistory);
route.put("/changepassword", verifyToken, usercontroller.changePassword);
route.get("/:id", verifyToken, usercontroller.getUserbyId);
route.delete("/:id", verifyToken, usercontroller.deleteUser);

module.exports = route;
