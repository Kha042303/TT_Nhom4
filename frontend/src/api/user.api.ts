// src/api/user.api.ts
import axios from "axios";

const baseURL =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:3000";

const http = axios.create({
  baseURL,
  withCredentials: true, // nếu bạn có dùng refresh token cookie
});

// ✅ tự động gắn Authorization Bearer
http.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function forgotPasswordApi(email: string) {
  const res = await http.post("/api/v1/user/forgot-password", { email });
  return res.data;
}

export async function resetPasswordApi(password: string, token: string) {
  const res = await http.post("/api/v1/user/reset-password", { password, token });
  return res.data;
}

// ✅ thêm API profile (cần token)
export async function getProfileApi() {
  const res = await http.get("/api/v1/user/profile");
  return res.data;
}
