import { Router } from "express";
import { interviewChat } from "../controllers/interviewChat.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { interviewChat, generateReport } from "../controllers/interviewChat.controller";

const router = Router();
router.post("/", requireAuth, interviewChat);
router.post("/report", requireAuth, generateReport);

export default router;