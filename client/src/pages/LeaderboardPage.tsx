import { useEffect, useMemo, useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { api } from "../lib/api";
import {
  Activity,
  Award,
  ChevronDown,
  Crown,
  Flame,
  Medal,
  RefreshCw,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";

type LeaderboardUser = {
  _id?: string;
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  avatar?: string;
  profileImage?: string;
  totalSolved?: number;
  solved?: number;
  problemsSolved?: number;
  streak?: number;
  points?: number;
  xp?: number;
  score?: number;
  rank?: number;
};

type LeaderboardResponse = {
  users?: LeaderboardUser[];
  leaderboard?: LeaderboardUser[];
  data?: LeaderboardUser[];
};

type Period = "all-time" | "monthly" | "weekly";

const periods: { label: string; value: Period }[] = [
  { label: "All time", value: "all-time" },
  { label: "This month", value: "monthly" },
  { label: "This week", value: "weekly" },
];

function getDisplayName(user: LeaderboardUser) {
  return (
    user.name ||
    user.username ||
    user.email?.split("@")[0] ||
    "Anonymous user"
  );
}

function getInitials(user: LeaderboardUser) {
  return getDisplayName(user)
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function getScore(user: LeaderboardUser) {
  return user.points ?? user.xp ?? user.score ?? 0;
}

function getSolved(user: LeaderboardUser) {
  return user.totalSolved ?? user.solved ?? user.problemsSolved ?? 0;
}

function getAvatar(user: LeaderboardUser) {
  return user.avatar || user.profileImage;
}

function Avatar({
  user,
  size = "md",
}: {
  user: LeaderboardUser;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-8 w-8 text-[10px]",
    md: "h-10 w-10 text-xs",
    lg: "h-14 w-14 text-sm",
  };

  const avatar = getAvatar(user);

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-purple-500/10 font-medium text-purple-200 ${sizes[size]}`}
    >
      {avatar ? (
        <img
          src={avatar}
          alt={getDisplayName(user)}
          className="h-full w-full object-cover"
        />
      ) : (
        getInitials(user)
      )}
    </div>
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-500/[0.08]">
        <Crown size={16} className="text-yellow-300" />
      </div>
    );
  }

  if (rank === 2) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300/20 bg-slate-400/[0.08]">
        <Medal size={16} className="text-slate-300" />
      </div>
    );
  }

  if (rank === 3) {
    return (
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-500/[0.08]">
        <Medal size={16} className="text-orange-300" />
      </div>
    );
  }

  return (
    <span className="flex h-9 w-9 items-center justify-center text-sm font-medium text-white/35">
      #{rank}
    </span>
  );
}

export default function LeaderboardPage() {
  const [period, setPeriod] = useState<Period>("all-time");
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchLeaderboard(showRefresh = false) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const response = await api.get<LeaderboardResponse>(
        `/leaderboard?period=${period}`
      );

      const data =
        response.data.users ??
        response.data.leaderboard ??
        response.data.data ??
        [];

      setUsers(
        [...data]
          .sort((a, b) => getScore(b) - getScore(a))
          .map((user, index) => ({
            ...user,
            rank: index + 1,
          }))
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.error ??
          "Unable to load the leaderboard right now."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const topThree = useMemo(() => users.slice(0, 3), [users]);
  const remainingUsers = useMemo(() => users.slice(3), [users]);

  const totalParticipants = users.length;

  return (
    <AppShell>
      <div className="relative mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[10%] top-0 h-80 w-80 rounded-full bg-purple-500/[0.045] blur-3xl" />

          <div className="absolute right-[8%] top-[20%] h-96 w-96 rounded-full bg-yellow-500/[0.025] blur-3xl" />

          <div className="absolute bottom-[10%] left-[40%] h-72 w-72 rounded-full bg-blue-500/[0.025] blur-3xl" />
        </div>

        {/* Header */}
        <header className="mb-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-yellow-400/20 bg-yellow-500/10">
                <Trophy size={15} className="text-yellow-300" />
              </div>

              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-yellow-300/70">
                Competitive learning
              </span>
            </div>

            <h1 className="text-2xl font-medium tracking-tight sm:text-3xl">
              Leaderboard.
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/45">
              See how you rank against the AlgoVerse community and keep
              pushing your problem-solving skills forward.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/[0.07] px-3 py-1.5 text-xs text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Rankings live
            </div>

            <button
              onClick={() => fetchLeaderboard(true)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/50 transition hover:border-white/20 hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
            >
              <RefreshCw
                size={12}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </header>

        {/* Main Layout */}
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          {/* Main Leaderboard */}
          <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#09090c] shadow-2xl shadow-black/20">
            {/* Toolbar */}
            <div className="flex flex-col justify-between gap-3 border-b border-white/10 px-4 py-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <Users size={15} className="text-purple-300" />

                <div>
                  <p className="text-sm font-medium">
                    Global rankings
                  </p>

                  <p className="text-[10px] text-white/30">
                    {totalParticipants} participants
                  </p>
                </div>
              </div>

              <div className="relative">
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value as Period)}
                  className="h-9 appearance-none rounded-lg border border-white/10 bg-white/[0.04] px-3 pr-8 text-xs text-white/70 outline-none transition focus:border-purple-400/40"
                >
                  {periods.map((item) => (
                    <option
                      key={item.value}
                      value={item.value}
                      className="bg-[#111116]"
                    >
                      {item.label}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-white/35"
                />
              </div>
            </div>

            {/* Podium */}
            {!loading && !error && topThree.length > 0 && (
              <div className="border-b border-white/10 px-4 py-8 sm:px-8">
                <div className="mx-auto flex max-w-2xl items-end justify-center gap-3 sm:gap-6">
                  {/* Second */}
                  {topThree[1] && (
                    <div className="flex w-28 flex-col items-center sm:w-36">
                      <div className="relative">
                        <Avatar user={topThree[1]} size="lg" />

                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-[#15151b] px-2 py-0.5 text-[9px] text-white/50">
                          #2
                        </div>
                      </div>

                      <p className="mt-4 max-w-full truncate text-xs font-medium text-white/75">
                        {getDisplayName(topThree[1])}
                      </p>

                      <p className="mt-1 font-mono text-xs text-white/35">
                        {getScore(topThree[1]).toLocaleString()} pts
                      </p>

                      <div className="mt-3 h-20 w-full rounded-t-xl border border-white/10 bg-white/[0.035]" />
                    </div>
                  )}

                  {/* First */}
                  {topThree[0] && (
                    <div className="flex w-32 flex-col items-center sm:w-40">
                      <div className="relative">
                        <div className="absolute -inset-3 rounded-full bg-yellow-400/[0.08] blur-xl" />

                        <div className="relative">
                          <Avatar user={topThree[0]} size="lg" />
                        </div>

                        <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                          <Crown size={18} className="text-yellow-300" />
                        </div>

                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-yellow-400/20 bg-yellow-500/[0.12] px-2 py-0.5 text-[9px] text-yellow-300">
                          #1
                        </div>
                      </div>

                      <p className="mt-4 max-w-full truncate text-xs font-medium text-white/90">
                        {getDisplayName(topThree[0])}
                      </p>

                      <p className="mt-1 font-mono text-xs text-yellow-300/70">
                        {getScore(topThree[0]).toLocaleString()} pts
                      </p>

                      <div className="mt-3 h-28 w-full rounded-t-xl border border-yellow-400/10 bg-yellow-500/[0.045]" />
                    </div>
                  )}

                  {/* Third */}
                  {topThree[2] && (
                    <div className="flex w-28 flex-col items-center sm:w-36">
                      <div className="relative">
                        <Avatar user={topThree[2]} size="lg" />

                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-[#15151b] px-2 py-0.5 text-[9px] text-white/50">
                          #3
                        </div>
                      </div>

                      <p className="mt-4 max-w-full truncate text-xs font-medium text-white/75">
                        {getDisplayName(topThree[2])}
                      </p>

                      <p className="mt-1 font-mono text-xs text-white/35">
                        {getScore(topThree[2]).toLocaleString()} pts
                      </p>

                      <div className="mt-3 h-14 w-full rounded-t-xl border border-white/10 bg-white/[0.025]" />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="flex min-h-[360px] items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-white/40">
                  <RefreshCw size={15} className="animate-spin" />
                  Loading rankings...
                </div>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="flex min-h-[360px] flex-col items-center justify-center px-6 text-center">
                <Activity size={22} className="mb-3 text-red-300/70" />

                <p className="text-sm text-white/60">
                  Unable to load rankings
                </p>

                <p className="mt-2 max-w-sm text-xs text-white/30">
                  {error}
                </p>

                <button
                  onClick={() => fetchLeaderboard()}
                  className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-white/60 transition hover:bg-white/[0.08] hover:text-white"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && users.length === 0 && (
              <div className="flex min-h-[360px] flex-col items-center justify-center text-center">
                <Trophy size={24} className="mb-3 text-white/20" />

                <p className="text-sm text-white/50">
                  No rankings available yet
                </p>

                <p className="mt-2 text-xs text-white/25">
                  Start solving problems to appear on the leaderboard.
                </p>
              </div>
            )}

            {/* Rankings */}
            {!loading && !error && remainingUsers.length > 0 && (
              <div className="divide-y divide-white/[0.06]">
                {remainingUsers.map((user, index) => {
                  const rank = index + 4;

                  return (
                    <div
                      key={user._id || user.id || `${getDisplayName(user)}-${rank}`}
                      className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-white/[0.025] sm:px-6"
                    >
                      <RankBadge rank={rank} />

                      <Avatar user={user} size="sm" />

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white/75">
                          {getDisplayName(user)}
                        </p>

                        <p className="mt-0.5 text-[10px] text-white/30">
                          {getSolved(user)} problems solved
                        </p>
                      </div>

                      <div className="hidden items-center gap-1.5 text-[10px] text-white/30 sm:flex">
                        <Flame size={12} className="text-orange-300/70" />
                        {user.streak ?? 0} day streak
                      </div>

                      <div className="text-right">
                        <p className="font-mono text-sm font-medium text-purple-300">
                          {getScore(user).toLocaleString()}
                        </p>

                        <p className="text-[9px] uppercase tracking-wider text-white/25">
                          points
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Sidebar */}
          <aside className="flex flex-col gap-4">
            {/* Stats */}
            <section className="rounded-2xl border border-white/10 bg-[#0b0b0e]/90 p-5">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-400/20 bg-purple-500/10">
                  <Activity size={15} className="text-purple-300" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Ranking overview
                  </p>

                  <p className="text-[10px] text-white/30">
                    Current leaderboard
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
                  <span className="text-xs text-white/40">
                    Participants
                  </span>

                  <span className="text-sm font-medium text-white/80">
                    {users.length}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
                  <span className="text-xs text-white/40">
                    Top score
                  </span>

                  <span className="text-sm font-medium text-yellow-300">
                    {users[0] ? getScore(users[0]).toLocaleString() : "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5">
                  <span className="text-xs text-white/40">
                    Period
                  </span>

                  <span className="text-sm font-medium text-purple-300">
                    {periods.find((item) => item.value === period)?.label}
                  </span>
                </div>
              </div>
            </section>

            {/* How it works */}
            <section className="rounded-2xl border border-white/10 bg-[#0b0b0e]/90 p-5">
              <div className="mb-4 flex items-center gap-2">
                <Award size={15} className="text-white/40" />

                <span className="text-sm font-medium">
                  How rankings work
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-purple-400/15 bg-purple-500/[0.08]">
                    <Sparkles size={13} className="text-purple-300" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-white/70">
                      Solve problems
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-white/30">
                      Build your score by completing algorithms and challenges.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-orange-400/15 bg-orange-500/[0.08]">
                    <Flame size={13} className="text-orange-300" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-white/70">
                      Stay consistent
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-white/30">
                      Maintain your learning streak and keep improving.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-yellow-400/15 bg-yellow-500/[0.08]">
                    <Trophy size={13} className="text-yellow-300" />
                  </div>

                  <div>
                    <p className="text-xs font-medium text-white/70">
                      Climb the ranks
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-white/30">
                      Every completed challenge moves you closer to the top.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Motivation */}
            <section className="flex-1 rounded-2xl border border-purple-400/15 bg-purple-500/[0.045] p-5">
              <div className="mb-4 flex items-center gap-2">
                <Trophy size={15} className="text-purple-300" />

                <span className="text-xs font-medium uppercase tracking-[0.14em] text-purple-300/80">
                  Keep going
                </span>
              </div>

              <p className="text-sm leading-7 text-white/55">
                Rankings are only one measure of progress. The real advantage
                comes from building strong fundamentals and developing the
                ability to reason through problems independently.
              </p>

              <div className="mt-5 border-t border-purple-400/10 pt-4">
                <p className="text-[10px] uppercase tracking-[0.15em] text-white/25">
                  The goal
                </p>

                <p className="mt-2 text-sm font-medium text-purple-200/80">
                  Think deeper. Build better.
                </p>
              </div>
            </section>
          </aside>
        </div>

        {/* Footer */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/25">
          <span>
            Tip: Consistency beats intensity. Keep showing up and keep solving.
          </span>

          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
            Leaderboard engine ready
          </span>
        </div>
      </div>
    </AppShell>
  );
}