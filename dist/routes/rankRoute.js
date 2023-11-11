"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const rankController_1 = require("../controllers/rankController");
router.get("/weekly", rankController_1.getWeeklyRank);
router.get("/monthly", rankController_1.getMonthlyRank);
module.exports = router;
