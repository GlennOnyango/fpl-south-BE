import express from "express";
import { getMyWeeks } from "../controllers/weeksController";
const router = express.Router();


router.get("/", getMyWeeks);
export default router;
