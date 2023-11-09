const express = require("express");
const router = express.Router();

//Controllers
const authController = require("../controllers/authController");
const { body } = require("express-validator");

//models
const User = require("../models/user");

router.post(
  "/login",
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  authController.postLogin
);

router.post(
  "/register",
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("email").custom((value, { req }) => {
    return User.findByEmail({ email: value }).then((userDoc) => {
      if (userDoc) {
        return Promise.reject("Email address already exists");
      }
    });
  }),
  body("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"),
  body("userName").notEmpty().withMessage("user name is required"),
  body("teamId").notEmpty().withMessage("team id is required"),
  body("phoneNumber").notEmpty().withMessage("phone number is required"),
  

  authController.postCreateUser
);

module.exports = router;
