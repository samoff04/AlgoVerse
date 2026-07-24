import express from "express";
import cors from "cors";
import passport from "./config/passport";
import authRoutes from "./routes/auth.routes";
import progressRoutes from "./routes/progress.routes";
import tutorRoutes from "./routes/tutor.routes";
import complexityRoutes from "./routes/complexity.routes";
import interviewRoutes from "./routes/interview.routes";
import recommendRoutes from "./routes/recommend.routes";
import interviewChatRoutes from "./routes/interviewChat.routes";
import contestRoutes from "./routes/contest.routes";

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/tutor", tutorRoutes);
app.use("/api/complexity", complexityRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/recommend", recommendRoutes);
app.use("/api/interview-chat", interviewChatRoutes);
app.use("/api/contest", contestRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

export default app;