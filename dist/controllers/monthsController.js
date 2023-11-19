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
exports.updateMonthsByUserId = exports.getMyMonths = exports.getMonthsByUserId = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const monthsModel_1 = __importDefault(require("../models/monthsModel"));
//get months using userId
const getMonthsByUserId = (req, res, next) => {
    const bearerToken = req.headers.authorization.split(" ")[1];
    const userId = req.params.userId;
    jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).json({
                status: "error",
                error: err,
            });
        }
        monthsModel_1.default.fetchByUserId(userId)
            .then((monthsModelData) => {
            res.status(200).json({
                status: "success",
                data: monthsModelData,
            });
        })
            .catch((err) => {
            res.status(500).json({
                status: "error",
                error: err,
                source: "monthsModel",
            });
        });
    }));
};
exports.getMonthsByUserId = getMonthsByUserId;
//get months using userId
const getMyMonths = (req, res, next) => {
    const bearerToken = req.headers.authorization.split(" ")[1];
    jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).json({
                status: "error",
                error: err,
            });
        }
        monthsModel_1.default.fetchByUserId(decoded.userId)
            .then((monthsModelData) => {
            res.status(200).json({
                status: "success",
                data: monthsModelData,
            });
        })
            .catch((err) => {
            res.status(500).json({
                status: "error",
                error: err,
                source: "monthsModel",
            });
        });
    }));
};
exports.getMyMonths = getMyMonths;
//update months using userId
const updateMonthsByUserId = (req, res, next) => {
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
        //fetch months by userId
        const monthsModelData = yield monthsModel_1.default.fetchByUserId(userId);
        monthsModelData.months.map((month) => {
            if (paymentUpdate.months.includes(month.month)) {
                month.approved = true;
            }
            return month;
        });
        const monthsModel = new monthsModel_1.default(monthsModelData.months, monthsModelData.userId, monthsModelData._id);
        monthsModel
            .save()
            .then((result) => __awaiter(void 0, void 0, void 0, function* () {
            //fetch months by userId
            const monthsUpdate = yield monthsModel_1.default.fetchByUserId(userId);
            res.status(200).json({
                status: "success",
                months: monthsUpdate.months,
                weeks: req.body.weeks,
                paymentUpdate: paymentUpdate,
            });
        }))
            .catch((err) => {
            res.status(500).json({
                status: "error",
                error: err,
                source: "monthsModel",
            });
        });
    }));
};
exports.updateMonthsByUserId = updateMonthsByUserId;
