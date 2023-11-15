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
exports.getMonthlyRankOpen = exports.getWeeklyRankOpen = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const weekly_1 = require("../stats/weekly");
const userModel_1 = __importDefault(require("../models/userModel"));
const weeksModel_1 = __importDefault(require("../models/weeksModel"));
const monthly_1 = require("../stats/monthly");
const monthsModel_1 = __importDefault(require("../models/monthsModel"));
const getWeeklyRankOpen = (req, res, next) => {
    const bearerToken = req.headers.authorization.split(" ")[1];
    const gameWeek = req.params.gameWeek;
    jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).json({
                status: "error",
                error: err,
            });
        }
        const standings = yield (0, weekly_1.weeklyStandings)();
        if (standings.length === 0) {
            return res.status(500).json({
                status: "error",
                error: "No standings found",
            });
        }
        const openToPlay = standings.map((userStanding) => {
            userModel_1.default.findByTeamId(userStanding.id)
                .then((userDoc) => {
                weeksModel_1.default.fetchByUserId(userDoc._id)
                    .then((weekModelData) => {
                    const userWeek = weekModelData.weeks.find((week) => {
                        return week.week === gameWeek;
                    });
                    if (userWeek.approved) {
                        return userStanding;
                    }
                })
                    .catch((err) => {
                    res.status(500).json({
                        status: "error",
                        error: err,
                        source: "weeksModel",
                    });
                });
            })
                .catch((err) => {
                res.status(500).json({
                    status: "error",
                    error: err,
                    source: "userModel",
                });
            });
        });
        res.status(200).json({
            status: "success",
            data: openToPlay,
        });
        //
    }));
};
exports.getWeeklyRankOpen = getWeeklyRankOpen;
const getMonthlyRankOpen = (req, res, next) => {
    const bearerToken = req.headers.authorization.split(" ")[1];
    const gameMonth = req.params.gameMonth;
    jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).json({
                status: "error",
                error: err,
            });
        }
        const standings = yield (0, monthly_1.monthlyStandings)();
        if (standings.length === 0) {
            return res.status(500).json({
                status: "error",
                error: "No standings found",
            });
        }
        const openToPlay = standings.map((userStanding) => {
            userModel_1.default.findByTeamId(userStanding.id)
                .then((userDoc) => {
                monthsModel_1.default.fetchByUserId(userDoc._id)
                    .then((monthModelData) => {
                    const month = monthModelData.months.find((monthObject) => monthObject.month === gameMonth);
                    if (month.approved) {
                        return userStanding;
                    }
                })
                    .catch((err) => {
                    res.status(500).json({
                        status: "error",
                        error: err,
                        source: "monthsModel",
                    });
                });
            })
                .catch((err) => {
                res.status(500).json({
                    status: "error",
                    error: err,
                    source: "userModel",
                });
            });
        });
        res.status(200).json({
            status: "success",
            data: openToPlay,
        });
        //
    }));
};
exports.getMonthlyRankOpen = getMonthlyRankOpen;
