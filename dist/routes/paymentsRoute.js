"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const paymentsController = __importStar(require("../controllers/paymentsController"));
const express_validator_1 = require("express-validator");
const paymentModel_1 = __importDefault(require("../models/paymentModel"));
router.post("/pay", (0, express_validator_1.body)("phone").notEmpty().withMessage("Phone number is required"), (0, express_validator_1.body)("amount").notEmpty().withMessage("Amount is required"), (0, express_validator_1.body)("weeks").notEmpty().withMessage("Weeks are required"), (0, express_validator_1.body)("months").notEmpty().withMessage("Months are required"), (0, express_validator_1.body)("mpesaToken").notEmpty().withMessage("Mpesa token is required"), (0, express_validator_1.body)("mpesaToken").custom((value, { req }) => {
    return paymentModel_1.default.findByMpesaToken(value).then((paymentDoc) => {
        if (paymentDoc) {
            return Promise.reject("Mpesa token already exists");
        }
    });
}), paymentsController.postCreatePayment);
router.get("/", paymentsController.getPayments);
router.get("/:paymentId", paymentsController.getPaymentsByUserId);
module.exports = router;
