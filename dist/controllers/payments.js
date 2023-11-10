"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRequestPayment = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const postRequestPayment = (req, res, next) => {
    console.log(req.body);
    //get bearer token from request header
    //verify token
    const bearerToken = req.headers.authorization.split(" ")[1];
    jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).json({
                status: "error",
                error: err,
            });
        }
        //
    });
};
exports.postRequestPayment = postRequestPayment;
