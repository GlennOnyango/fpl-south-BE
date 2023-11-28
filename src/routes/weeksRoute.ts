import express from "express";
import { getMyWeeks } from "../controllers/weeksController";
import { header } from "express-validator";
import jwt from "jsonwebtoken";
const router = express.Router();

router.get(
  "/",
  header("Authorization")
    .notEmpty()
    .withMessage("Authorization header is required"),
  header("Authorization").custom((value: any, { req }: any) => {
    const token = value.split(" ")[1];
    try {
      const decoded:any = jwt.verify(token, process.env.JWT_SECRET as string);
      req.userId = decoded.userId;
      return true;
    } catch (err) {
      return false;
    }
  }),

  getMyWeeks
);
export default router;
