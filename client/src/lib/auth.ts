import { api } from "./api";

export async function registerUser(name: string, email: string, password: string) {
  const { data } = await api.post("/auth/register", { name, email, password });
  localStorage.setItem("token", data.token);
  return data.user;
}

export async function loginUser(email: string, password: string) {
  const { data } = await api.post("/auth/login", { email, password });
  localStorage.setItem("token", data.token);
  return data.user;
}

export async function fetchMe() {
  const { data } = await api.get("/auth/me");
  return data.user;
}

export function logout() {
  localStorage.removeItem("token");
}

export function loginWithGoogle() {
  window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
}