import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import WeeksModel from "../models/weeksModel";
import MonthsModel from "../models/monthsModel";

type weeksObject = {
  week: number;
  approved: boolean;
};

type monthsObject = {
  month: number;
  approved: boolean;
};

const weeksObjectArray: weeksObject[] = [
  {
    week: 1,
    approved: false,
  },
  {
    week: 2,
    approved: false,
  },
  {
    week: 3,
    approved: false,
  },
  {
    week: 4,
    approved: false,
  },
  {
    week: 5,
    approved: false,
  },
  {
    week: 6,
    approved: false,
  },
  {
    week: 7,
    approved: false,
  },
  {
    week: 8,
    approved: false,
  },
  {
    week: 9,
    approved: false,
  },
  {
    week: 10,
    approved: false,
  },
  {
    week: 11,
    approved: false,
  },
  {
    week: 12,
    approved: false,
  },
  {
    week: 13,
    approved: false,
  },
  {
    week: 14,
    approved: false,
  },
  {
    week: 15,
    approved: false,
  },
  {
    week: 16,
    approved: false,
  },
  {
    week: 17,
    approved: false,
  },
  {
    week: 18,
    approved: false,
  },
  {
    week: 19,
    approved: false,
  },
  {
    week: 20,
    approved: false,
  },
  {
    week: 21,
    approved: false,
  },
  {
    week: 22,
    approved: false,
  },
  {
    week: 23,
    approved: false,
  },
  {
    week: 24,
    approved: false,
  },
  {
    week: 25,
    approved: false,
  },
  {
    week: 26,
    approved: false,
  },
  {
    week: 27,
    approved: false,
  },
  {
    week: 28,
    approved: false,
  },
  {
    week: 29,
    approved: false,
  },
  {
    week: 30,
    approved: false,
  },
  {
    week: 31,
    approved: false,
  },
  {
    week: 32,
    approved: false,
  },
  {
    week: 33,
    approved: false,
  },
  {
    week: 34,
    approved: false,
  },
  {
    week: 35,
    approved: false,
  },
  {
    week: 36,
    approved: false,
  },
  {
    week: 37,
    approved: false,
  },
  {
    week: 38,
    approved: false,
  },
];

const monthsObjectArray: monthsObject[] = [
  {
    month: 1,
    approved: false,
  },
  {
    month: 2,
    approved: false,
  },
  {
    month: 3,
    approved: false,
  },
  {
    month: 4,
    approved: false,
  },
  {
    month: 5,
    approved: false,
  },
  {
    month: 6,
    approved: false,
  },
  {
    month: 7,
    approved: false,
  },
  {
    month: 8,
    approved: false,
  },
  {
    month: 9,
    approved: false,
  },
  {
    month: 10,
    approved: false,
  },
  {
    month: 11,
    approved: false,
  },
  {
    month: 12,
    approved: false,
  },
];

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
      const weeks = new WeeksModel(weeksObjectArray, result.insertedId);
      weeks
        .save()
        .then((weeks: any) => {
          const months = new MonthsModel(monthsObjectArray, result.insertedId);
          months
            .save()
            .then((months: any) => {
              res.status(200).json({
                status: "success",
              });
            })
            .catch((err: any) => {
              res.status(400).json({
                status: "error",
                error: err,
              });
            });
        })
        .catch((err: any) => {
          res.status(400).json({
            status: "error",
            error: err,
          });
        });
    })
    .catch((err: any) => {
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
    .then(async (user: any) => {
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
        process.env.JWT_SECRET as string
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
    .catch((err: Error) => {
      res.status(400).json({
        status: "error",
        error: err,
      });
    });
};

export const postCreateAdmin = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
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
  const approved = true;
  const admin = true;

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
      res.status(200).json({
        status: "success",
      });
    })
    .catch((err: any) => {
      res.status(400).json({
        status: "error",
        error: err,
      });
    });
}