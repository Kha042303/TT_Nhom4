// src/lib/http.ts
const API_BASE = "http://localhost:3000/api/v1";


export type ApiError = {
  message?: string;
  error?: string;
};

function getToken() {
  return localStorage.getItem("token") || "";
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  // ✅ Dùng Headers để không bị lỗi index "Authorization"
  const headers = new Headers(options.headers);

  // Chỉ set Content-Type JSON khi body KHÔNG phải FormData
  const bodyAny = options.body as any;
  const isFormData =
    typeof FormData !== "undefined" && bodyAny instanceof FormData;

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Nếu backend dùng Bearer token:
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include", // quan trọng để dùng cookie-based auth
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const msg = data?.message || data?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}
