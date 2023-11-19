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
exports.updateWeeksByUserId = exports.getMyWeeks = exports.getWeeksByUserId = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const weeksModel_1 = __importDefault(require("../models/weeksModel"));
const monthsController_1 = require("./monthsController");
//get weeks using userId
const getWeeksByUserId = (req, res, next) => {
    const bearerToken = req.headers.authorization.split(" ")[1];
    const userId = req.params.userId;
    jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).json({
                status: "error",
                error: err,
            });
        }
        weeksModel_1.default.fetchByUserId(userId)
            .then((weeksModelData) => {
            res.status(200).json({
                status: "success",
                data: weeksModelData,
            });
        })
            .catch((err) => {
            res.status(500).json({
                status: "error",
                error: err,
                source: "weeksModel",
            });
        });
    }));
};
exports.getWeeksByUserId = getWeeksByUserId;
const getMyWeeks = (req, res, next) => {
    const bearerToken = req.headers.authorization.split(" ")[1];
    jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).json({
                status: "error",
                error: err,
            });
        }
        weeksModel_1.default.fetchByUserId(decoded.userId)
            .then((weeksModelData) => {
            res.status(200).json({
                status: "success",
                data: weeksModelData,
            });
        })
            .catch((err) => {
            res.status(500).json({
                status: "error",
                error: err,
                source: "weeksModel",
            });
        });
    }));
};
exports.getMyWeeks = getMyWeeks;
//update weeks using userId
const updateWeeksByUserId = (req, res, next) => {
    const bearerToken = req.headers.authorization.split(" ")[1];
    const paymentUpdate = req.body.paymentUpdate;
    const userId = paymentUpdate.userId;
    jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).json({
                status: "error",
                error: err,
            });
        }
        //fetch weeks by userId
        const weeksModelData = yield weeksModel_1.default.fetchByUserId(userId);
        //update weeks
        paymentUpdate.weeks.forEach((week) => {
            weeksModelData.weeks[week - 1].approved = true;
        });
        const weeksModel = new weeksModel_1.default(weeksModelData.weeks, weeksModelData.userId, weeksModelData._id);
        weeksModel
            .save()
            .then((result) => __awaiter(void 0, void 0, void 0, function* () {
            //fetch weeks by userId
            const weeksUpdate = yield weeksModel_1.default.fetchByUserId(userId);
            req.body.weeks = weeksUpdate.weeks;
            //update months
            if (paymentUpdate.months.length > 0) {
                (0, monthsController_1.updateMonthsByUserId)(req, res, next);
            }
        }))
            .catch((err) => {
            res.status(500).json({
                status: "error",
                error: err,
                source: "weeksModel",
            });
        });
    }));
};
exports.updateWeeksByUserId = updateWeeksByUserId;
