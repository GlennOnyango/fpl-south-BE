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
exports.getMonthlyPaidUser = exports.getWeeklyPaidUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const weekly_1 = require("../stats/weekly");
const userModel_1 = __importDefault(require("../models/userModel"));
const monthly_1 = require("../stats/monthly");
const monthsModel_1 = __importDefault(require("../models/monthsModel"));
const weeksModel_1 = __importDefault(require("../models/weeksModel"));
const getWeeklyPaidUser = (req, res, next) => {
    const bearerToken = req.headers.authorization.split(" ")[1];
    const gameWeek = req.params.gameWeek;
    jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).json({
                status: "error",
                error: err,
            });
        }
        const teamIds = yield (0, weekly_1.weeklyTeamId)();
        if (teamIds.length === 0) {
            return res.status(500).json({
                status: "error",
                error: "No standings found",
            });
        }
        const registeredUsers = yield userModel_1.default.findUsersByTeamId(teamIds);
        const userIds = registeredUsers.map((user) => user._id);
        const weekModelArray = yield weeksModel_1.default.fetchByuserIds(userIds);
        const openToPlay = weekModelArray.map((weekModel) => {
            if (weekModel.weeks[gameWeek - 1].approved) {
                return weekModel;
            }
        });
        res.status(200).json({
            status: "success",
            data: openToPlay,
        });
        //
    }));
};
exports.getWeeklyPaidUser = getWeeklyPaidUser;
const getMonthlyPaidUser = (req, res, next) => {
    const bearerToken = req.headers.authorization.split(" ")[1];
    const gameMonth = req.params.gameMonth;
    jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).json({
                status: "error",
                error: err,
            });
        }
        const standings = yield (0, monthly_1.monthlyTeamId)();
        if (standings.length === 0) {
            return res.status(500).json({
                status: "error",
                error: "No standings found",
            });
        }
        const registeredUsers = yield userModel_1.default.findUsersByTeamId(standings);
        const userIds = registeredUsers.map((user) => user._id);
        const monthModelArray = yield monthsModel_1.default.fetchByUserIds(userIds);
        const openToPlay = monthModelArray.map((monthModel) => {
            if (monthModel.months[gameMonth - 1].approved) {
                return monthModel;
            }
        });
        res.status(200).json({
            status: "success",
            data: openToPlay,
        });
        //
    }));
};
exports.getMonthlyPaidUser = getMonthlyPaidUser;
