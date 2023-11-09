const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { validationResult } = require("express-validator");

exports.postCreateUser = (req, res, next) => {
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

  const user = new User(username, teamid, phonenumber, email, password);

  user
    .save()
    .then((result) => {
      console.log("User created successfully");
      res.status(200).json({
        status: "success",
        data: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({
        status: "error",
        error: err,
      });
    });
};

exports.postLogin = (req, res, next) => {
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

  User.findByEmail({ email: email })
    .then(async (user) => {
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
        process.env.JWT_SECRET,
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
    .catch((err) => {
      res.status(400).json({
        status: "error",
        error: err,
      });
    });
};
