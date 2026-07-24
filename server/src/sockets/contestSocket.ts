import { Server, Socket } from "socket.io";
import { Contest } from "../models/Contest";

export function initContestSockets(io: Server) {
  io.on("connection", (socket: Socket) => {
    socket.on("contest:join-room", async ({ code, userId }) => {
      socket.join(code);
      const contest = await Contest.findOne({ code });
      if (contest) io.to(code).emit("contest:state", contest);
    });

    socket.on("contest:start", async ({ code }) => {
      const contest = await Contest.findOne({ code });
      if (!contest || contest.status !== "lobby") return;
      contest.status = "active";
      contest.startedAt = new Date();
      contest.participants.forEach((p) => (p.status = "solving"));
      await contest.save();
      io.to(code).emit("contest:state", contest);
    });

    socket.on("contest:submit", async ({ code, userId, score }) => {
      const contest = await Contest.findOne({ code });
      if (!contest || contest.status !== "active" || !contest.startedAt) return;

      const participant = contest.participants.find((p) => p.userId.toString() === userId);
      if (!participant || participant.status === "submitted") return;

      participant.status = "submitted";
      participant.submittedAt = new Date();
      participant.timeTakenMs = participant.submittedAt.getTime() - contest.startedAt.getTime();
      participant.score = score;

      const allDone = contest.participants.every((p) => p.status === "submitted");
      if (allDone) contest.status = "finished";

      await contest.save();
      io.to(code).emit("contest:state", contest);
    });

    socket.on("disconnect", () => {});
  });
}