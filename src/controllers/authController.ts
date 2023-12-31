import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import WeeksModel from "../models/weeksModel";
import MonthsModel from "../models/monthsModel";
import mongoose from "mongoose";
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

export const postCreateUser = async (req: any, res: any, next: any) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "error",
      error: errors.array()[0].msg,
    });
  }

  const username = req.body.userName;
  const teamid = req.body.teamId;
  const leagueid = req.body.leagueId;
  const phonenumber = req.body.phoneNumber;
  const email = req.body.email;

  const salt = bcrypt.genSaltSync(12);
  const password = bcrypt.hashSync(req.body.password, salt);
  const approved = false;
  const admin = req.body.userType === "league admin" ? true : false;

  const user = new User(
    username,
    teamid,
    leagueid,
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
    return res.status(422).json({
      status: "error",
      error: errors.array()[0].msg,
    });
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findByEmail(email as string)
    .then(async (user: any) => {
      if (!user) {
        return res.status(401).json({
          status: "error",
          error: "User with this email does not exist",
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
          approved: user.approved,
          admin: user.admin,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      const newUser = {
        userName: user.username,
        teamId: user.teamid,
        phoneNumber: user.phonenumber,
        email: user.email,
        approved: user.approved,
        admin: user.admin,
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

export const getPlayers = async (req: any, res: any, next: any) => {
  const admin = req.admin;
  const userId = req.userId;
  const leagueId = req.body.leagueId;
  const isApproved = req.body.isApproved;
  const isAdmin = req.body.isAdmin;

  if (!admin) {
    return res.status(401).json({
      status: "error",
      error: "Unauthorized user not an admin",
    });
  }

  const users = await User.findUsersByLeagueId(leagueId, isAdmin, isApproved);

  if (!users) {
    return res.status(404).json({
      status: "error",
      error: "Users not found",
    });
  }

  res.status(200).json({
    status: "success",
    data: users,
  });
}

export const postApproveUser = async (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "error",
      error: errors.array()[0].msg,
    });
  }

  const teamId = req.body.teamId;
  const userId = req.userId;
  const admin = req.admin;

  
  if (!admin) {
    return res.status(401).json({
      status: "error",
      error: "Unauthorized user not an admin",
    });
  }
  const user = await User.findByTeamId(teamId);

  if (!user) {
    return res.status(404).json({
      status: "error",
      error: "User not found",
    });
  }

  user.approved = true;
  user.approved_by = new mongoose.Types.ObjectId(userId);

  const updatedUser = new User(
    user.username,
    user.teamid,
    user.leagueid,
    user.phonenumber,
    user.email,
    user.password,
    user.approved,
    user.admin,
    user.approved_by,
    user._id
  );
  const userChanges = await updatedUser.save();

  if (!userChanges) {
    return res.status(400).json({
      status: "error",
      error: "Error updating user",
    });
  }

  res.status(200).json({
    status: "success",
    data: userChanges,
  });

};

export const postDisapproveUser = async (req: any, res: any, next: any) => {
  const teamId = req.body.teamId;
  const userId = req.userId;
  const admin = req.admin;

  
  if (!admin) {
    return res.status(401).json({
      status: "error",
      error: "Unauthorized user not an admin",
    });
  }
  const user = await User.findByTeamId(teamId);

  if (!user) {
    return res.status(404).json({
      status: "error",
      error: "User not found",
    });
  }

  user.approved = false;
  user.approved_by = new mongoose.Types.ObjectId(userId);

  const updatedUser = new User(
    user.username,
    user.teamid,
    user.leagueid,
    user.phonenumber,
    user.email,
    user.password,
    user.approved,
    user.admin,
    user.approved_by,
    user._id
  );
  const userChanges = await updatedUser.save();

  if (!userChanges) {
    return res.status(400).json({
      status: "error",
      error: "Error updating user",
    });
  }

  res.status(200).json({
    status: "success",
    data: userChanges,
  });
}

export const getAuthorizeToken = (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      status: "error",
      error: errors.array()[0].msg,
    });
  }

  res.status(200).json({
    status: "success",
    data: "Authorized",
  });
};
