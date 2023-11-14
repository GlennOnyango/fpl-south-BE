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
exports.editPayment = exports.getPaymentsByUserId = exports.postApprovePayment = exports.getPayments = exports.postCreatePayment = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const paymentModel_1 = __importDefault(require("../models/paymentModel"));
const weeksModel_1 = __importDefault(require("../models/weeksModel"));
const monthsModel_1 = __importDefault(require("../models/monthsModel"));
const postCreatePayment = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: "error",
            error: "Unauthorized",
        });
    }
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: "error",
            error: errors.array(),
        });
    }
    const bearerToken = req.headers.authorization.split(" ")[1];
    jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                status: "error",
                error: err,
            });
        }
        const amount = req.body.amount;
        const phone = req.body.phone;
        const weeks = req.body.weeks;
        const months = req.body.months;
        const mpesaToken = req.body.mpesaToken;
        const approved = false;
        const userId = decoded.userId;
        const payment = new paymentModel_1.default(phone, weeks, months, amount, mpesaToken, approved, userId);
        payment.save().then((result) => {
            res.status(200).json({
                status: "Payment created successfully",
            });
        });
        //
    });
};
exports.postCreatePayment = postCreatePayment;
const getPayments = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: "error",
            error: "Unauthorized",
        });
    }
    const bearerToken = req.headers.authorization.split(" ")[1];
    jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).json({
                status: "error",
                error: err,
            });
        }
        const payments = yield paymentModel_1.default.fetchAll();
        if (payments.length === 0) {
            return res.status(500).json({
                status: "error",
                error: "No payments found",
            });
        }
        res.status(200).json({
            status: "success",
            data: payments,
        });
        //
    }));
};
exports.getPayments = getPayments;
//To check later
const postApprovePayment = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: "error",
            error: "Unauthorized",
        });
    }
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: "error",
            error: errors.array(),
        });
    }
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
        const paymentId = req.body.paymentId;
        const payment = yield paymentModel_1.default.findById(paymentId);
        if (!payment) {
            return res.status(500).json({
                status: "error",
                error: "Payment not found",
            });
        }
        payment.approved = true;
        payment.adminId = decoded.userId;
        payment
            .save()
            .then((result) => {
            if (payment.weeks.length > 1) {
                weeksModel_1.default.fetchByUserId(payment.userId)
                    .then((weeks) => {
                    payment.weeks.forEach((week) => {
                        weeks.weeks[week - 1].approved = true;
                    });
                    const weeksModel = new weeksModel_1.default(weeks.weeks, payment.userId, weeks._id);
                    weeksModel
                        .save()
                        .then((result) => {
                        next();
                    })
                        .catch((err) => {
                        res.status(500).json({
                            status: "error",
                            error: err,
                        });
                    });
                })
                    .catch((err) => {
                    res.status(500).json({
                        status: "error",
                        error: err,
                    });
                });
            }
            if (payment.months.length > 1) {
                monthsModel_1.default.fetchByUserId(payment.userId)
                    .then((monthsModelUser) => {
                    monthsModelUser.map((month) => {
                        if (payment.months.includes(month.month)) {
                            month.approved = true;
                        }
                        return month;
                    });
                    const monthsModel = new monthsModel_1.default(monthsModelUser, payment.userId, monthsModelUser._id);
                    monthsModel
                        .save()
                        .then((result) => {
                        next();
                    })
                        .catch((err) => {
                        res.status(500).json({
                            status: "error",
                            error: err,
                        });
                    });
                })
                    .catch((err) => {
                    res.status(500).json({
                        status: "error",
                        error: err,
                    });
                });
            }
            res.status(200).json({
                status: "Payment approved successfully",
            });
        })
            .catch((err) => {
            res.status(500).json({
                status: "error",
                error: err,
            });
        });
        //
    }));
};
exports.postApprovePayment = postApprovePayment;
const getPaymentsByUserId = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: "error",
            error: "Unauthorized",
        });
    }
    const bearerToken = req.headers.authorization.split(" ")[1];
    jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).json({
                status: "error",
                error: err,
            });
        }
        const payments = yield paymentModel_1.default.findByUserId(decoded.userId);
        if (payments.length === 0) {
            return res.status(500).json({
                status: "error",
                error: "No payments found",
            });
        }
        res.status(200).json({
            status: "success",
            data: payments,
        });
        //
    }));
};
exports.getPaymentsByUserId = getPaymentsByUserId;
const editPayment = (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).json({
            status: "error",
            error: "Unauthorized",
        });
    }
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            status: "error",
            error: errors.array(),
        });
    }
    const bearerToken = req.headers.authorization.split(" ")[1];
    jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res.status(401).json({
                status: "error",
                error: err,
            });
        }
        const paymentId = req.body.paymentId;
        const payment = yield paymentModel_1.default.findById(paymentId);
        if (!payment) {
            return res.status(500).json({
                status: "error",
                error: "Payment not found",
            });
        }
        payment.approved = true;
        payment.adminId = decoded.userId;
        payment.save().then((result) => {
            res.status(200).json({
                status: "Payment approved successfully",
            });
        });
        //
    }));
};
exports.editPayment = editPayment;
