"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postCreatePayment = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const paymentModel_1 = __importDefault(require("../models/paymentModel"));
const postCreatePayment = (req, res, next) => {
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
