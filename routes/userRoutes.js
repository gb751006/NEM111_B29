const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/userModel");

const userRouter = express.Router();

//REGISTER

userRouter.post("/register", async (req, res) => {
  const { name, email, gender, password } = req.body;
  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exist, please login" });
    }
    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      const user = new UserModel({
        name,
        email,
        gender,
        password: hash,
      });
      await user.save();
      res.status(200).json({ msg: "New user has been added", newUser: user });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

///Login

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          let token = jwt.sign({ userID: user._id, user: user.name }, "TOKEN", {
            expiresIn: "7d",
          });
          res.json({ msg: "User logged in successfully.", token: token });
        } else {
          res.json({ msg: "Wrong credentials" });
        }
      });
    } else {
      res.json({ msg: "User not found" });
    }
  } catch (error) {
    res.json({ error: error.message });
  }
});

module.exports = { userRouter };
