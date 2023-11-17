import express from "express";
const router = express.Router();

//Controllers
import * as openPlayersController from "../controllers/openPlayersController";

router.get(
  "/week/:gameWeek",
  openPlayersController.getWeeklyPaidUser
);

router.get(
  "/month/:gameMonth",
  openPlayersController.getMonthlyPaidUser
);

export default router;
