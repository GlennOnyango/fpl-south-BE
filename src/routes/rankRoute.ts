import express from "express";
const router = express.Router();

import { getWeeklyRank } from "../controllers/rankController";

router.get("/weekly", getWeeklyRank);

export = router;
