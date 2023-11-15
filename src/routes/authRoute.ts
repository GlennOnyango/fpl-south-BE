import express from "express";
const router = express.Router();

//Controllers
import * as authController from "../controllers/authController";
import { body } from "express-validator";
//models
import User from "../models/userModel";
import { checkTeamId } from "../stats/checkTeamId";

router.post(
  "/login",
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
  authController.postLogin
);

router.post(
  "/register",
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("email").custom((value: any, { req }: any) => {
    return User.findByEmail(value).then((userDoc: any) => {
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
  body("teamId").custom((value: any, { req }: any) => {
    return User.findByTeamId(value).then((userDoc: any) => {
      if (userDoc) {
        return Promise.reject("Team id already exists");
      }
    });
  }),
  body("teamId").custom(async (value: any, { req }: any) => {
    if (!(await checkTeamId(value as number))) {
      return Promise.reject("Invalid Team ID");
    }
  }),
  body("teamId").custom((value: any, { req }: any) => {
    return User.findByTeamId(value).then((userDoc: any) => {
      if (userDoc) {
        return Promise.reject("Team id already exists");
      }
    });
  }),
  body("phoneNumber").notEmpty().withMessage("phone number is required"),

  authController.postCreateUser
);

router.post("/approve", authController.postApproveUser);

export default router;
