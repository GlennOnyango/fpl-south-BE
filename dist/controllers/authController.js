"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postLogin = exports.postCreateUser = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const { validationResult } = require("express-validator");
const postCreateUser = (req, res, next) => {
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
    const salt = bcrypt_1.default.genSaltSync(12);
    const password = bcrypt_1.default.hashSync(req.body.password, salt);
    const approved = false;
    const admin = false;
    const user = new user_1.default(username, teamid, phonenumber, email, password, approved, admin);
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
exports.postCreateUser = postCreateUser;
const postLogin = (req, res, next) => {
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
    user_1.default.findByEmail(email)
        .then((user) => __awaiter(void 0, void 0, void 0, function* () {
        if (!user) {
            return res.status(401).json({
                status: "error",
                error: "Invalid email or password",
            });
        }
        const isPasswordValid = bcrypt_1.default.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                status: "error",
                error: "Invalid email or password",
            });
        }
        const token = jsonwebtoken_1.default.sign({
            email: user.email,
            userId: user._id.toString(),
        }, process.env.JWT_SECRET);
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
    }))
        .catch((err) => {
        res.status(400).json({
            status: "error",
            error: err,
        });
    });
};
exports.postLogin = postLogin;
