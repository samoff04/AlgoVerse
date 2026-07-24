import { Router } from "express";
import { saveAttempt } from "../controllers/interview.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.post("/", requireAuth, saveAttempt);

export default router;