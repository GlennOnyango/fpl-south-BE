import express from "express";

import jwt from "jsonwebtoken";
//Controllers
import { header } from "express-validator";

const router = express.Router();

import { getMonthlyRank, getWeeklyRank } from "../controllers/rankController";

router.get(
  "/weekly",
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
  getWeeklyRank
);
router.get(
  "/monthly",
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
  getMonthlyRank
);

export default router;
