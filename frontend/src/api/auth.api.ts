import { apiFetch } from "./http";

// --- ĐỊNH NGHĨA TYPE (Mô phỏng cấu trúc JSON trả về) ---

// Khớp với cấu trúc object trong bảng 'roles'
export interface Role {
  role_id: number;
  role_name: string;
  description?: string;
}

// Khớp với cấu trúc object trong bảng 'user_roles'
export interface UserRole {
  id?: number;
  user_id?: number;
  role_id: number; // <-- Quan trọng: đây là cột trong bảng user_roles
  role?: Role;     // <-- Object role lồng bên trong (do API include)
  is_active?: boolean;
}

// Khớp với object User trong JSON (Bao gồm cả mảng user_roles được include vào)
export type User = {
  user_id: number;
  full_name?: string;
  email: string;
  phone?: string;
  address?: string;
  status?: string;
  
  // Frontend cần trường này để hứng dữ liệu 'user_roles' từ JSON
  user_roles?: UserRole[]; 
  
  // Các trường dự phòng khác
  plan_name?: string;
  plan?: string;
  roles?: string[];
};

// --- LOGIC API (Giữ nguyên) ---

// ... (Giữ nguyên các hàm extractToken, loginApi, profileApi như cũ) ...

// RÚT GỌN ĐỂ BẠN DỄ COPY (Các hàm bên dưới không thay đổi logic)
function extractUser(data: any): User | null {
  const u = data?.user || data?.data?.user || data?.userInfo || data?.data || null;
  if (u && (u.user_id || u.email)) return u as User;
  return null;
}
// (Bạn giữ nguyên các hàm extractToken, getToken, setToken...)
// Chỉ cần đảm bảo hàm profileApi trả về đúng User là được.

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
  try { return JSON.parse(raw) as User; } catch { return null; }
}

export async function loginApi(email: string, password: string) {
  const data: any = await apiFetch("/user/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const token = data?.token || data?.accessToken || data?.data?.token || "";
  const user = extractUser(data);

  if (!token) throw new Error(data?.message || "Đăng nhập thất bại");

  if (typeof window !== "undefined") {
    setToken(token);
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }
  return { token, user, raw: data };
}

// Trong file src/api/auth.api.ts

export async function profileApi() {
  const data: any = await apiFetch("/user/profile", { method: "GET" });
  
  // Lấy user mới từ server
  const newUser = extractUser(data) || (data as User);

  if (typeof window !== "undefined" && newUser) {
    const oldUserRaw = localStorage.getItem("user");
    const oldUser = oldUserRaw ? JSON.parse(oldUserRaw) : null;
    if (!newUser.user_roles && oldUser?.user_roles) {
      newUser.user_roles = oldUser.user_roles;
    }

    localStorage.setItem("user", JSON.stringify(newUser));
  }

  return newUser as User;
} 


export async function logoutApi() {
  try {
    await apiFetch("/user/logout", { method: "POST" });
  } catch (error) {
    console.warn("Lỗi API Logout (không quan trọng):", error);
  } finally {
    clearAuthStorage();

    if (typeof window !== "undefined") {
       window.location.href = "/signin";
    }
  }
}

export async function registerApi(payload: any) {
  return await apiFetch("/user/register", { method: "POST", body: JSON.stringify(payload) });
}