import express from "express";
import { getMyWeeks } from "../controllers/weeksController";
import { checkAuth } from "../middleware/authMiddleware";
const router = express.Router();

router.get(
  "/",
  checkAuth,

  getMyWeeks
);
export default router;
