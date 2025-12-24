// src/api/book.api.ts
import { apiFetch, toAbsoluteImageUrl } from "./http";

export type Book = {
  book_id: number;
  title: string;
  author?: string;
  publisher?: string;
  price?: number;
  stock?: number;
  description?: string;
  category?: string;
  status?: "active" | "inactive";
  image_url?: string[] | string; // BE có thể trả string JSON
  user_id?: number;

  user?: any;
};

export type CreateBookPayload = {
  title: string;
  author?: string;
  publisher?: string;
  category?: string;
  description?: string;
  price?: number;
  stock?: number;
  status?: "active" | "inactive";
  images?: File[];
};

function normalizeImages(img: any): string[] {
  if (!img) return [];

  // Array sẵn
  if (Array.isArray(img)) return img.filter(Boolean).map(toAbsoluteImageUrl);

  // String: có thể là JSON string hoặc 1 path
  if (typeof img === "string") {
    const s = img.trim();
    if (!s) return [];
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed.filter(Boolean).map(toAbsoluteImageUrl);
      // nếu parse ra string/object -> fallback
      return [toAbsoluteImageUrl(s)];
    } catch {
      return [toAbsoluteImageUrl(s)];
    }
  }

  return [];
}

function normalizeBook(raw: any): Book {
  const images = normalizeImages(raw?.image_url);
  return { ...raw, image_url: images };
}

export function pickBookImages(book?: Book | null): string[] {
  if (!book) return [];
  return normalizeImages(book.image_url);
}

// POST /api/v1/book/create  (multipart field: images)
export async function createBookApi(payload: CreateBookPayload) {
  const form = new FormData();
  form.append("title", payload.title);

  if (payload.author) form.append("author", payload.author);
  if (payload.publisher) form.append("publisher", payload.publisher);
  if (payload.category) form.append("category", payload.category);
  if (payload.description) form.append("description", payload.description);
  if (payload.status) form.append("status", payload.status);

  if (typeof payload.price === "number") form.append("price", String(payload.price));
  if (typeof payload.stock === "number") form.append("stock", String(payload.stock));

  (payload.images || []).forEach((f) => form.append("images", f));

  const res = await apiFetch<any>("/book/create", {
    method: "POST",
    body: form,
  });

  const data = res?.data ?? res;
  return { ...res, data: normalizeBook(data) as Book };
}

// GET /api/v1/book/detail/:id
export async function getBookDetailApi(bookId: number | string) {
  const res = await apiFetch<any>(`/book/detail/${bookId}`, { method: "GET" });
  const raw = res?.data ?? res;
  return normalizeBook(raw) as Book;
}

// GET /api/v1/book?page=&limit=&status=&keyword=&category=
export async function listBooksApi(params?: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  keyword?: string;
  sortKey?: string;
  sortValue?: "ASC" | "DESC";
}) {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  if (params?.category) q.set("category", params.category);
  if (params?.status) q.set("status", params.status);
  if (params?.keyword) q.set("keyword", params.keyword);
  if (params?.sortKey) q.set("sortKey", params.sortKey);
  if (params?.sortValue) q.set("sortValue", params.sortValue);

  const suffix = q.toString() ? `?${q.toString()}` : "";
  const res = await apiFetch<any>(`/book${suffix}`, { method: "GET" });

  const listRaw =
    res?.data ||
    res?.books ||
    res?.items ||
    res?.rows ||
    (Array.isArray(res) ? res : []);

  const books = (Array.isArray(listRaw) ? listRaw : []).map(normalizeBook) as Book[];
  return { books, raw: res };
}
