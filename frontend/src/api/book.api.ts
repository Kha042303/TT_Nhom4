// src/api/book.api.ts
import { apiFetch, toAbsoluteImageUrl } from "./http";

export type Book = {
  book_id: number;
  title: string;
  author?: string;
  publisher?: string;
  price?: number;
  stock?: number;
  seller_note?: string;
  description?: string;
  category?: string;
  status?: "active" | "inactive";
  image_url?: string[] | string;
  user_id?: number;
  published_year?: number;
  user?: any;
};

export type CreateBookPayload = {
  title: string;
  author?: string;
  publisher?: string;
  category?: string;
  description?: string;
  seller_note?: string;
  price?: number;
  stock?: number;
  status?: "active" | "inactive";
  images?: File[];
  published_year?: number;
};

/* ================= GOOGLE BOOKS ================= */

export type ExternalBookCandidate = {
  id: string;
  title: string;
  author?: string;
  publisher?: string;
  publishedDate?: string;
  description?: string;
  category?: string;
  thumbnail?: string;
};

function pickFirstString(v: any): string | undefined {
  if (!v) return undefined;
  if (typeof v === "string") return v.trim() || undefined;
  return undefined;
}

function normalizeThumbnail(url?: string): string | undefined {
  const u = pickFirstString(url);
  if (!u) return undefined;
  return u.startsWith("http://")
    ? "https://" + u.slice("http://".length)
    : u;
}

export async function searchExternalBooksByTitleApi(
  title: string,
  opts?: { maxResults?: number; signal?: AbortSignal }
): Promise<ExternalBookCandidate[]> {
  const q = (title || "").trim();
  if (q.length < 2) return [];

  const maxResults = Math.min(Math.max(opts?.maxResults ?? 8, 1), 20);

  const url =
    "https://www.googleapis.com/books/v1/volumes" +
    `?q=${encodeURIComponent(`intitle:${q}`)}` +
    `&maxResults=${maxResults}` +
    `&printType=books`;

  const res = await fetch(url, { signal: opts?.signal });
  if (!res.ok) return [];

  const json: any = await res.json();
  const items: any[] = Array.isArray(json?.items) ? json.items : [];

  return items
    .map((it) => {
      const id = String(it?.id ?? "");
      const info = it?.volumeInfo ?? {};
      const title = pickFirstString(info?.title) || "";
      if (!id || !title) return null;

      const authors = Array.isArray(info?.authors)
        ? info.authors.filter(Boolean)
        : [];
      const author = authors.length ? String(authors[0]) : undefined;

      const publisher = pickFirstString(info?.publisher);
      const publishedDate = pickFirstString(info?.publishedDate);
      const description = pickFirstString(info?.description);

      const categories = Array.isArray(info?.categories)
        ? info.categories.filter(Boolean)
        : [];
      const category = categories.length ? String(categories[0]) : undefined;

      const thumb =
        normalizeThumbnail(info?.imageLinks?.thumbnail) ||
        normalizeThumbnail(info?.imageLinks?.smallThumbnail);

      return {
        id,
        title,
        author,
        publisher,
        publishedDate,
        description,
        category,
        thumbnail: thumb,
      } satisfies ExternalBookCandidate;
    })
    .filter(Boolean) as ExternalBookCandidate[];
}

/* ================= NORMALIZE ================= */

function normalizeImages(img: any): string[] {
  if (!img) return [];

  if (Array.isArray(img))
    return img.filter(Boolean).map(toAbsoluteImageUrl);

  if (typeof img === "string") {
    const s = img.trim();
    if (!s) return [];
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed))
        return parsed.filter(Boolean).map(toAbsoluteImageUrl);
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

/* ================= CRUD ================= */

// POST /api/v1/book/create
export async function createBookApi(payload: CreateBookPayload) {
  const form = new FormData();
  form.append("title", payload.title);

  if (payload.author) form.append("author", payload.author);
  if (payload.publisher) form.append("publisher", payload.publisher);
  if (payload.category) form.append("category", payload.category);
  if (payload.description) form.append("description", payload.description);
  if (payload.seller_note) form.append("seller_note", payload.seller_note);
  if (payload.status) form.append("status", payload.status);
  if (typeof payload.price === "number")
    form.append("price", String(payload.price));
  if (typeof payload.stock === "number")
    form.append("stock", String(payload.stock));
  if (typeof payload.published_year === "number")
    form.append("published_year", String(payload.published_year));

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

/* ================= SEARCH + CATEGORY ================= */

// ✅ CHỈ SỬA PHẦN NÀY
export async function listBooksApi(params?: {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  keyword?: string;
  sortKey?: string;
  sortValue?: "ASC" | "DESC";
  userId?: number | string; // <--- THÊM DÒNG NÀY
}) {
  const q = new URLSearchParams();

  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  if (params?.status) q.set("status", params.status);
  if (params?.keyword) q.set("keyword", params.keyword);

  // ✅ FIX QUAN TRỌNG: KHÔNG gửi "Tất Cả" lên backend
  if (params?.category && params.category !== "Tất Cả") {
    q.set("category", params.category);
  }

  if (params?.sortKey) q.set("sortKey", params.sortKey);
  if (params?.sortValue) q.set("sortValue", params.sortValue);

  // --- THÊM ĐOẠN NÀY ---
  if (params?.userId) q.set("user_id", String(params.userId));
  // ---------------------

  const suffix = q.toString() ? `?${q.toString()}` : "";
  const res = await apiFetch<any>(`/book${suffix}`, { method: "GET" });

  const listRaw =
    res?.data ||
    res?.books ||
    res?.items ||
    res?.rows ||
    (Array.isArray(res) ? res : []);

  const books = (Array.isArray(listRaw) ? listRaw : []).map(
    normalizeBook
  ) as Book[];

  return { books, raw: res };
}
