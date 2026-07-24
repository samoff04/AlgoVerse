import { User } from "../models/User";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export async function awardActivity(userId: string, xpAmount: number) {
  const user = await User.findById(userId);
  if (!user) return null;

  const today = todayStr();
  if (user.lastActiveDate !== today) {
    user.streak = user.lastActiveDate === yesterdayStr() ? user.streak + 1 : 1;
    user.lastActiveDate = today;
  }
  user.xp += xpAmount;
  await user.save();
  return user;
}