import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { validationResult } = require("express-validator");

export const postCreateUser = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "error",
      error: errors.array(),
    });
  }

  const username = req.body.userName;
  const teamid = req.body.teamId;
  const phonenumber = req.body.phoneNumber;
  const email = req.body.email;

  const salt = bcrypt.genSaltSync(12);
  const password = bcrypt.hashSync(req.body.password, salt);
  const approved = false;
  const admin = false;

  const user = new User(
    username,
    teamid,
    phonenumber,
    email,
    password,
    approved,
    admin
  );

  user
    .save()
    .then((result: any) => {
      console.log("User created successfully");
      res.status(200).json({
        status: "success",
        data: result,
      });
    })
    .catch((err: any) => {
      console.log(err);
      res.status(400).json({
        status: "error",
        error: err,
      });
    });
};

export const postLogin = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).json({
      status: "error",
      error: errors.array(),
    });
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findByEmail(email as string)
    .then(async (user:any) => {
      if (!user) {
        return res.status(401).json({
          status: "error",
          error: "Invalid email or password",
        });
      }

      const isPasswordValid = bcrypt.compareSync(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({
          status: "error",
          error: "Invalid email or password",
        });
      }

      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id.toString(),
        },
        process.env.JWT_SECRET as string,
      );

      const newUser = {
        userName: user.username,
        teamId: user.teamid,
        phoneNumber: user.phonenumber,
        email: user.email,
      };

      res.status(200).json({
        status: "success",
        data: newUser,
        token: token,
      });
    })
    .catch((err:Error) => {
      res.status(400).json({
        status: "error",
        error: err,
      });
    });
};
