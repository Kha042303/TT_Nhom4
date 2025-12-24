// src/api/http.ts

export const API_ORIGIN =
  (import.meta as any).env?.VITE_API_BASE_URL ||
  (import.meta as any).env?.VITE_SERVER_ORIGIN ||
  "http://localhost:3000";

export const API_PREFIX =
  (import.meta as any).env?.VITE_API_PREFIX || "/api/v1";

/** Dùng để render ảnh static từ BE ( /images/... ) */
export const FILE_ORIGIN =
  (import.meta as any).env?.VITE_FILE_BASE ||
  (import.meta as any).env?.VITE_SERVER_ORIGIN ||
  (import.meta as any).env?.VITE_API_BASE_URL ||
  "http://localhost:3000";

function getToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token") ||
    ""
  );
}

function isAbsoluteUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

export function buildApiUrl(path: string) {
  if (!path) return `${API_ORIGIN}${API_PREFIX}`;
  if (isAbsoluteUrl(path)) return path;

  const p = path.startsWith("/") ? path : `/${path}`;
  const origin = String(API_ORIGIN).replace(/\/$/, "");
  const prefix = String(API_PREFIX).startsWith("/")
    ? String(API_PREFIX)
    : `/${API_PREFIX}`;

  return `${origin}${prefix}${p}`;
}

async function parseResponse(res: Response) {
  // 204 No Content
  if (res.status === 204) return null;

  const text = await res.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/**
 * apiFetch("/user/login") -> GET/POST http://localhost:3000/api/v1/user/login
 */
export async function apiFetch<T = any>(
  path: string,
  init: RequestInit = {},
  tokenOverride?: string
): Promise<T> {
  const url = buildApiUrl(path);

  const token = tokenOverride ?? getToken();

  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const isFormData =
    typeof FormData !== "undefined" && init.body instanceof FormData;

  // JSON body thì set Content-Type
  if (!isFormData && init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...init,
    headers,
    // Nếu BE của bạn không dùng cookie refresh thì có thể bỏ dòng này,
    // nhưng giữ cũng không sao
    credentials: "include",
  });

  const data = await parseResponse(res);

const appCode =
  data && typeof data === "object" && "code" in (data as any)
    ? Number((data as any).code)
    : null;

if (!res.ok || (appCode !== null && appCode >= 400)) {
  const msg =
    (data as any)?.message ||
    (data as any)?.error ||
    `HTTP ${res.status} ${res.statusText}`;
  throw new Error(msg);
}


  return data as T;
}

/** Convert path ảnh từ BE -> URL tuyệt đối để FE (port khác) load được */
export function toAbsoluteImageUrl(raw?: string) {
  if (!raw) return "";
  const s = String(raw).trim();
  if (!s) return "";

  if (isAbsoluteUrl(s)) return s;

  const origin = String(FILE_ORIGIN).replace(/\/$/, "");
  if (s.startsWith("/")) return `${origin}${s}`;
  return `${origin}/${s}`;
}

/**
 * Helper: BE có thể trả image_url dạng:
 * - string "/images/a.png"
 * - array ["/images/a.png", ...]
 * - string JSON '["/images/a.png"]'
 */
export function pickFirstImage(raw: unknown): string {
  let v: any = raw;

  if (Array.isArray(v)) v = v[0];

  if (typeof v === "string") {
    const t = v.trim();
    if (t.startsWith("[") && t.endsWith("]")) {
      try {
        const arr = JSON.parse(t);
        if (Array.isArray(arr) && typeof arr[0] === "string") v = arr[0];
      } catch {
        // ignore
      }
    }
  }

  if (typeof v !== "string") return "";
  return toAbsoluteImageUrl(v);
}
