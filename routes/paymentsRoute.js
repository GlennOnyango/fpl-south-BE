const express = require("express");
const router = express.Router();
const paymentsController = require("../controllers/payments");
const { body } = require("express-validator");

router.post(
  "/",
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("firstName").notEmpty().withMessage("First name is required"),
  body("lastName").notEmpty().withMessage("Last name is required"),
  body("phoneNumber").notEmpty().withMessage("Phone number is required"),
  body("amount").notEmpty().withMessage("Amount is required"),

  paymentsController.postRequestPayment
);

module.exports = router;
