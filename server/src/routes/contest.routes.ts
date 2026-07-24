import { Router } from "express";
import { createContest, joinContest, getContest } from "../controllers/contest.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.use(requireAuth);
router.post("/", createContest);
router.post("/join", joinContest);
router.get("/:code", getContest);

export default router;