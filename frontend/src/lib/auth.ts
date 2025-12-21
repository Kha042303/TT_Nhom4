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

export async function loginApi(email: string, password: string) {
  const data: LoginResponse = await apiFetch("/user/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  const token =
    data?.token || data?.accessToken || data?.access_token || data?.data?.token;

  const user: User | undefined =
    data?.user || data?.data?.user || data?.data || data?.userInfo;
if (token) {
  localStorage.setItem("token", token);
  localStorage.setItem("accessToken", token); 
}

  if (user) localStorage.setItem("user", JSON.stringify(user));

  return { token: token || "", user: user || null, raw: data };
}

export async function profileApi() {
  const data: any = await apiFetch("/user/profile", { method: "GET" });
  const user = data?.user || data?.data || data;
  localStorage.setItem("user", JSON.stringify(user));
  return user as User;
}

export async function logoutApi() {
  try {
    await apiFetch("/user/logout", { method: "POST" });
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

// ✅ Đăng ký
export async function registerApi(payload: {
  full_name?: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}) {
  return apiFetch("/user/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
