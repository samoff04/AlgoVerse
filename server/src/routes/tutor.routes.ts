import { Router } from "express";
import { askTutor } from "../controllers/tutor.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.post("/", requireAuth, askTutor);

export default router;