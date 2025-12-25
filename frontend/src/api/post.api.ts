// src/api/post.api.ts
import { apiFetch } from "./http";

const API_ORIGIN =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:3000";

export type PostFromDB = {
  post_id: number;
  user_id: number;
  title: string;
  content?: string | null;

  // ✅ sau normalize luôn là mảng string url
  images?: string[];

  status?: "visible" | "hidden";
  created_at?: string;
  updated_at?: string;
  deleted?: "true" | "false";
  is_violation?: number;
};

export type Pagination = {
  currentPage: number;
  limitItems: number;
  skip: number;
  totalPage: number;
};

export type ListPostsParams = {
  page?: number;
  limit?: number;
  status?: "visible" | "hidden";
  keyword?: string;
};

export type ListPostsResponse = {
  code: number;
  message?: string;
  data: PostFromDB[];
  pagination?: Pagination;
};

function resolveStaticUrl(url: string) {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/")) return `${API_ORIGIN}${url}`;
  return `${API_ORIGIN}/${url}`;
}

function normalizeImages(images: any): string[] {
  if (!images) return [];

  // BE đôi khi trả array
  if (Array.isArray(images)) {
    return images.map((x) => resolveStaticUrl(String(x)));
  }

  // BE create trả string JSON: "[\"/images/...\",\"/images/...\"]"
  if (typeof images === "string") {
    const s = images.trim();

    // nếu là json array string
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) {
          return parsed.map((x) => resolveStaticUrl(String(x)));
        }
      } catch {
        // fallthrough
      }
    }

    // nếu là 1 đường dẫn đơn
    return [resolveStaticUrl(s)];
  }

  return [];
}

function normalizePost(p: any): PostFromDB {
  return {
    ...p,
    images: normalizeImages(p?.images),
  };
}

/** GET /post (list + filter + pagination) */
export async function listPostsApi(
  params: ListPostsParams = {}
): Promise<ListPostsResponse> {
  const qs = new URLSearchParams();
  if (params.status) qs.set("status", params.status);
  if (params.keyword) qs.set("keyword", params.keyword);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));

  const path = `/post${qs.toString() ? `?${qs.toString()}` : ""}`;
  const res = await apiFetch<ListPostsResponse>(path, { method: "GET" });

  return {
    ...res,
    data: (res?.data || []).map(normalizePost),
  };
}

export type CreatePostPayload = {
  title: string;
  content?: string;
  status?: "visible" | "hidden";
  images?: File[];
  is_violation?: number;
};

/** POST /post/create (multipart: images[]) */
export async function createPostApi(payload: CreatePostPayload) {
  const fd = new FormData();
  fd.append("title", payload.title);
  if (payload.content) fd.append("content", payload.content);
  if (payload.status) fd.append("status", payload.status);
  if (payload.is_violation !== undefined)
    fd.append("is_violation", String(payload.is_violation));

  // ✅ đúng field multer: upload.array("images", 10)
  (payload.images || []).forEach((f) => fd.append("images", f));

  const res = await apiFetch<any>("/post/create", {
    method: "POST",
    body: fd,
  });

  // normalize data trả về
  if (res?.data) res.data = normalizePost(res.data);
  return res;
}

/** (tuỳ chọn) GET /post/detail/:id */
export async function getPostDetailApi(id: number | string) {
  const res = await apiFetch<any>(`/post/detail/${id}`, { method: "GET" });
  if (res?.data) res.data = normalizePost(res.data);
  return res;
}

/** (tuỳ chọn) GET /post/my-posts */
export async function myPostsApi() {
  const res = await apiFetch<any>("/post/my-posts", { method: "GET" });
  return {
    ...res,
    data: (res?.data || []).map(normalizePost),
  };
}
