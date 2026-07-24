import { Router } from "express";
import { getRecommendation } from "../controllers/recommend.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.get("/", requireAuth, getRecommendation);

export default router;