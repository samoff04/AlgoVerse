import { Router } from "express";
import { analyzeComplexity } from "../controllers/complexity.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.post("/", requireAuth, analyzeComplexity);

export default router;