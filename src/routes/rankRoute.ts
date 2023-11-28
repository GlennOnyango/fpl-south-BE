import express from "express";

const router = express.Router();

import { getMonthlyRank, getWeeklyRank } from "../controllers/rankController";
import { checkAuth } from "../middleware/authMiddleware";

router.get("/weekly", checkAuth, getWeeklyRank);
router.get("/monthly", checkAuth, getMonthlyRank);

export default router;
