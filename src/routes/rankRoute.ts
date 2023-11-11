import express from "express";
const router = express.Router();

import { getMonthlyRank, getWeeklyRank } from "../controllers/rankController";

router.get("/weekly", getWeeklyRank);
router.get("/monthly", getMonthlyRank);

export = router;
