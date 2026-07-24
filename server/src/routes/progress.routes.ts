import { Router } from "express";
import { saveProgress, getAllProgress } from "../controllers/progress.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { saveProgress, getAllProgress, getRecentActivity } from "../controllers/progress.controller";

const router = Router();
router.use(requireAuth);
router.post("/", saveProgress);
router.get("/", getAllProgress);
router.get("/recent", getRecentActivity);

export default router;