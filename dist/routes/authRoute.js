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
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//Controllers
const authController = __importStar(require("../controllers/authController"));
const express_validator_1 = require("express-validator");
//models
const userModel_1 = __importDefault(require("../models/userModel"));
const checkTeamId_1 = require("../stats/checkTeamId");
router.post("/login", (0, express_validator_1.body)("email").isEmail().withMessage("Please enter a valid email address"), (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"), authController.postLogin);
router.post("/register", (0, express_validator_1.body)("email").isEmail().withMessage("Please enter a valid email address"), (0, express_validator_1.body)("email").custom((value, { req }) => {
    return userModel_1.default.findByEmail(value).then((userDoc) => {
        if (userDoc) {
            return Promise.reject("Email address already exists");
        }
    });
}), (0, express_validator_1.body)("password")
    .isLength({ min: 5 })
    .withMessage("Password must be at least 5 characters long"), (0, express_validator_1.body)("teamId").notEmpty().withMessage("team id is required"), (0, express_validator_1.body)("teamId").custom((value, { req }) => {
    return userModel_1.default.findByTeamId(value).then((userDoc) => {
        if (userDoc) {
            return Promise.reject("Team id already exists");
        }
    });
}), (0, express_validator_1.body)("teamId").custom((value, { req }) => __awaiter(void 0, void 0, void 0, function* () {
    const { status, username } = yield (0, checkTeamId_1.checkTeamIdWithUserName)(value);
    if (!status) {
        req.body.userName = username;
        return Promise.reject("Invalid Team ID");
    }
})), (0, express_validator_1.body)("teamId").custom((value, { req }) => {
    return userModel_1.default.findByTeamId(value).then((userDoc) => {
        if (userDoc) {
            return Promise.reject("Team id already exists");
        }
    });
}), (0, express_validator_1.body)("phoneNumber").notEmpty().withMessage("phone number is required"), authController.postCreateUser);
router.post("/approve", authController.postApproveUser);
router.get("/", (0, express_validator_1.header)("Authorization")
    .notEmpty()
    .withMessage("Authorization header is required"), (0, express_validator_1.header)("Authorization").custom((value, { req }) => {
    const token = value.split(" ")[1];
    try {
        jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return true;
    }
    catch (err) {
        return false;
    }
}), authController.getAuthorizeToken);
exports.default = router;
