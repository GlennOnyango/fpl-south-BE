import express from "express";
const router = express.Router();

import * as paymentsController from "../controllers/paymentsController";
import { body } from "express-validator";
import Payment from "../models/paymentModel";

router.post(
  "/pay",
  body("phone").notEmpty().withMessage("Phone number is required"),
  body("amount").notEmpty().withMessage("Amount is required"),
  body("weeks").notEmpty().withMessage("Weeks are required"),
  body("months").notEmpty().withMessage("Months are required"),
  body("mpesaToken").notEmpty().withMessage("Mpesa token is required"),
  body("mpesaToken").custom((value: any, { req }: any) => {
    return Payment.findByMpesaToken(value).then((paymentDoc: any) => {
      if (paymentDoc) {
        return Promise.reject("Mpesa token already exists");
      }
    });
  }),
  paymentsController.postCreatePayment
);

router.get("/", paymentsController.getPayments);
router.get("/:paymentId", paymentsController.getPaymentsByUserId);
router.post("/approve", paymentsController.postApprovePayment);

module.exports = router;
