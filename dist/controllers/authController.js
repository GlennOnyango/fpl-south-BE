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
exports.getAuthorizeToken = exports.postApproveUser = exports.postLogin = exports.postCreateUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const weeksModel_1 = __importDefault(require("../models/weeksModel"));
const monthsModel_1 = __importDefault(require("../models/monthsModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const weeksObjectArray = [
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
const monthsObjectArray = [
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
const postCreateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
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
    const admin = req.body.admin;
    const user = new userModel_1.default(username, teamid, phonenumber, email, password, approved, admin);
    user
        .save()
        .then((result) => {
        const weeks = new weeksModel_1.default(weeksObjectArray, result.insertedId);
        weeks
            .save()
            .then((weeks) => {
            const months = new monthsModel_1.default(monthsObjectArray, result.insertedId);
            months
                .save()
                .then((months) => {
                res.status(200).json({
                    status: "success",
                });
            })
                .catch((err) => {
                res.status(400).json({
                    status: "error",
                    error: err,
                });
            });
        })
            .catch((err) => {
            res.status(400).json({
                status: "error",
                error: err,
            });
        });
    })
        .catch((err) => {
        res.status(400).json({
            status: "error",
            error: err,
        });
    });
});
exports.postCreateUser = postCreateUser;
const postLogin = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(422).json({
            status: "error",
            error: errors.array(),
        });
    }
    const email = req.body.email;
    const password = req.body.password;
    userModel_1.default.findByEmail(email)
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
            approved: user.approved,
            admin: user.admin,
        }, process.env.JWT_SECRET, { expiresIn: "1h" });
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
    }))
        .catch((err) => {
        res.status(400).json({
            status: "error",
            error: err,
        });
    });
};
exports.postLogin = postLogin;
const postApproveUser = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: "error",
            error: "Unauthorized",
        });
    }
    const teamId = req.body.teamId;
    const bearerToken = req.headers.authorization.split(" ")[1];
    jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).json({
                status: "error",
                error: err,
            });
        }
        if (!decoded.admin) {
            return res.status(401).json({
                status: "error",
                error: "Unauthorized",
            });
        }
        //
        const user = yield userModel_1.default.findByTeamId(teamId);
        if (!user) {
            return res.status(404).json({
                status: "error",
                error: "User not found",
            });
        }
        user.approved = true;
        user.approved_by = new mongoose_1.default.Types.ObjectId(decoded.userId);
        const updatedUser = new userModel_1.default(user.username, user.teamid, user.phonenumber, user.email, user.password, user.approved, user.admin, user.approved_by, user._id);
        const userChanges = yield updatedUser.save();
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
    }));
};
exports.postApproveUser = postApproveUser;
const getAuthorizeToken = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: "error",
            error: errors.array(),
        });
    }
    res.status(200).json({
        status: "success",
        data: "Authorized",
    });
};
exports.getAuthorizeToken = getAuthorizeToken;
