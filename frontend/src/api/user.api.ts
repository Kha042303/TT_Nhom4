// src/api/user.api.ts
import { apiFetch } from "./http";

export type UserPublic = {
  user_id: number;
  full_name?: string;
  email?: string;
  address?: string;
  phone?: string;
  created_at?: string;
  status?: "active" | "inactive" | "banned";
};

function formatJoined(createdAt?: string) {
  if (!createdAt) return "—";
  const t = new Date(createdAt).getTime();
  if (Number.isNaN(t)) return "—";
  const diff = Date.now() - t;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days < 7) return `Tham gia ${Math.max(1, days)} ngày trước`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `Tham gia ${weeks} tuần trước`;
  const months = Math.floor(days / 30);
  if (months < 12) return `Tham gia ${months} tháng trước`;
  const years = Math.floor(days / 365);
  return `Tham gia ${years} năm trước`;
}

export async function getUserByIdApi(userId: number | string): Promise<UserPublic | null> {
  try {
    const res = await apiFetch<any>(`/user/profileid/${userId}`, { method: "GET" });
    // Kiểm tra cấu trúc trả về của API, đôi khi nó nằm trong res.data
    const u = res?.data ?? res;
    return u?.user_id ? (u as UserPublic) : null;
  } catch {
    return null;
  }
}
export function mapUserToSeller(u: UserPublic | null) {
  return {
    user_id: u?.user_id, 

    name: u?.full_name || (u?.user_id ? `User #${u.user_id}` : "Người bán"),
    online: true,
    joinedText: formatJoined(u?.created_at),
    rating: 0,
    reviewCount: 0,

    phone: u?.phone,
    email: u?.email,
    address: u?.address,
    status: u?.status,
  };
}

// ... giữ nguyên các hàm API khác (forgotPasswordApi, resetPasswordApi, getProfileApi)
export async function forgotPasswordApi(email: string) {
  return apiFetch<any>("/user/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function resetPasswordApi(password: string, token: string) {
  return apiFetch<any>("/user/reset-password", {
    method: "POST",
    body: JSON.stringify({ password, token }),
  });
}

export async function getProfileApi() {
  return apiFetch<any>("/user/profile", { method: "GET" });
}
// Thêm vào cuối file src/api/user.api.ts
export async function updateProfileApi(data: {
  full_name?: string;
  phone?: string;
  address?: string;
}) {
  return apiFetch<any>("/user/profile/editmyprofile", {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}