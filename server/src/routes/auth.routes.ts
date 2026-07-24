import { Router } from "express";
import passport, { googleAuthEnabled } from "../config/passport";
import { register, login, getMe, googleCallback } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, getMe);

if (googleAuthEnabled) {
  router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
  router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: "/login" }), googleCallback);
} else {
  router.get("/google", (_req, res) => {
    res.status(503).json({ error: "Google sign-in is not configured on this server yet." });
  });
}

export default router;