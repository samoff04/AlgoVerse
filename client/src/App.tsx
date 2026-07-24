import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { fetchMe } from "./lib/auth";
import { useAuthStore } from "./stores/authStore";
import { AIChatbot } from "./components/chatbot/AIChatbot";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AuthCallbackPage from "./pages/AuthCallbackPage";
import DashboardPage from "./pages/DashboardPage";
import AlgorithmPage from "./pages/AlgorithmPage";
import PlaygroundPage from "./pages/PlaygroundPage";
import VisualizePage from "./pages/VisualizePage";
import InterviewListPage from "./pages/InterviewListPage";
import InterviewProblemPage from "./pages/InterviewProblemPage";
import ContestLobbyPage from "./pages/ContestLobbyPage";
import ContestRoomPage from "./pages/ContestRoomPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import LinkedListPage from "./pages/LinkedListPage";
import StackPage from "./pages/StackPage";
import TreePage from "./pages/TreePage";

export default function App() {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    fetchMe().then(setUser).catch(() => setLoading(false));
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/learn/:algoId" element={<AlgorithmPage />} />
        <Route path="/playground" element={<PlaygroundPage />} />
        <Route path="/visualize" element={<VisualizePage />} />
        <Route path="/interview" element={<InterviewListPage />} />
        <Route path="/interview/:problemId" element={<InterviewProblemPage />} />
        <Route path="/contest" element={<ContestLobbyPage />} />
        <Route path="/contest/:code" element={<ContestRoomPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/structures/linked-list" element={<LinkedListPage />} />
        <Route path="/structures/stack" element={<StackPage />} />
        <Route path="/structures/tree" element={<TreePage />} />
      </Routes>
      <AIChatbot />
    </>
  );
}