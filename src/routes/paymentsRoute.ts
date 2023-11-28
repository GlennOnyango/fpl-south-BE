import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router();

import * as paymentsController from "../controllers/paymentsController";
import { body, header } from "express-validator";
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
  header("Authorization")
    .notEmpty()
    .withMessage("Authorization header is required"),
  header("Authorization").custom((value: any, { req }: any) => {
    const token = value.split(" ")[1];
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      req.userId = decoded.userId;
      return true;
    } catch (err) {
      return false;
    }
  }),
  paymentsController.postCreatePayment
);
router.post(
  "/approve/",
  header("Authorization")
    .notEmpty()
    .withMessage("Authorization header is required"),
  header("Authorization").custom((value: any, { req }: any) => {
    const token = value.split(" ")[1];
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      req.userId = decoded.userId;
      req.admin = decoded.admin;
      return true;
    } catch (err) {
      return false;
    }
  }),
  paymentsController.postApprovePayment
);

router.get(
  "/",
  header("Authorization")
    .notEmpty()
    .withMessage("Authorization header is required"),
  header("Authorization").custom((value: any, { req }: any) => {
    const token = value.split(" ")[1];
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      req.userId = decoded.userId;
      return true;
    } catch (err) {
      return false;
    }
  }),
  paymentsController.getPayments
);
router.get(
  "/me",
  header("Authorization")
    .notEmpty()
    .withMessage("Authorization header is required"),
  header("Authorization").custom((value: any, { req }: any) => {
    const token = value.split(" ")[1];
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      req.userId = decoded.userId;
      req.admin = decoded.admin;
      return true;
    } catch (err) {
      return false;
    }
  }),
  paymentsController.getMyPayments
);
router.get(
  "/:userId",
  header("Authorization")
    .notEmpty()
    .withMessage("Authorization header is required"),
  header("Authorization").custom((value: any, { req }: any) => {
    const token = value.split(" ")[1];
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
      req.userId = decoded.userId;
      req.admin = decoded.admin;
      return true;
    } catch (err) {
      return false;
    }
  }),
  paymentsController.getPaymentsByUserId
);

export default router;
