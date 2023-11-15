import express from "express";
const router = express.Router();

//Controllers
import * as openPlayersController from "../controllers/openPlayersController";

router.get(
  "/getOpenPlayers/week/:gameWeek",
  openPlayersController.getWeeklyRankOpen
);

router.get(
  "/getOpenPlayers/month/:gameMonth",
  openPlayersController.getMonthlyRankOpen
);

export default router;
