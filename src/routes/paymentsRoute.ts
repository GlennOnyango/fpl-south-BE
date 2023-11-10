import express from "express";
const router = express.Router();

import * as paymentsController from "../controllers/payments";
import { body } from "express-validator";

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
