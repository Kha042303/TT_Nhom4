// src/lib/auth.ts
import { apiFetch } from "./http";

export type User = {
  user_id: number;
  full_name?: string;
  email: string;
  status?: "active" | "inactive" | "banned";
  roles?: string[];
  user_roles?: Array<{ role?: { role_name?: string } }>;
};

type LoginResponse = any;

function extractToken(data: any): string {
  return (
    data?.token ||
    data?.accessToken ||
    data?.access_token ||
    data?.data?.token ||
    data?.data?.accessToken ||
    data?.data?.access_token ||
    data?.data?.data?.token ||
    data?.data?.data?.access_token ||
    ""
  );
}

function extractUser(data: any): User | null {
  const u =
    data?.user ||
    data?.data?.user ||
    data?.userInfo ||
    data?.data ||
    data?.data?.data ||
    null;

  // nếu u là string/token thì loại bỏ
  if (!u || typeof u !== "object") return null;

  // cố gắng map về User tối thiểu
  if (u.user_id || u.email) return u as User;

  return u as User;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token") || localStorage.getItem("accessToken");
}

export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
  localStorage.setItem("accessToken", token);
}

export function clearAuthStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
}

export function getUserFromStorage(): User | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export async function loginApi(email: string, password: string) {
  const data: LoginResponse = await apiFetch("/user/login", {
    method: "POST",
    // apiFetch đã set Content-Type nếu body là JSON
    body: JSON.stringify({ email, password }),
 
  });

  const token = extractToken(data);
  const user = extractUser(data);

  if (!token) {
    // backend không trả token => coi như fail
    const message =
      data?.message ||
      data?.error ||
      "Đăng nhập thất bại: không nhận được token từ server";
    throw new Error(message);
  }

  if (typeof window !== "undefined") {
    setToken(token);
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }

  return { token, user, raw: data };
}

export async function profileApi() {
  const data: any = await apiFetch("/user/profile", { method: "GET" });
  const user = extractUser(data) || (data as User);

  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }

  return user as User;
}

export async function logoutApi() {
  try {
    await apiFetch("/user/logout", { method: "POST" });
  } finally {
    clearAuthStorage();
  }
}

export type RegisterPayload = {
  full_name?: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
};

export async function registerApi(payload: RegisterPayload) {
  // Nếu backend của bạn dùng endpoint khác (vd: "/user/signup") thì đổi lại tại đây
  const data: any = await apiFetch("/user/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
}
