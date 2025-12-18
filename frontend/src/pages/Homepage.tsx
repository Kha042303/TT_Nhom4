// src/pages/HomePage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/http";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  BookOpen,
  Search,
  ChevronDown,
  Heart,
  MessageCircle,
  Bell,
  User2,
  BookText,
  ScrollText,
  GraduationCap,
  Baby,
  Gem,
  UtensilsCrossed,
  LayoutGrid,
  Facebook,
  Twitter,
  Instagram,
} from "lucide-react";

type Book = {
  book_id: number;
  title: string;
  author?: string;
  publisher?: string;
  price?: number;
  stock?: number;
  category?: string;
  description?: string;
  image_url?: string;
  status?: string;
};

function pickBooksFromResponse(res: any): { books: Book[]; totalPage?: number } {
  // hỗ trợ nhiều kiểu response hay gặp
  const books: Book[] =
    res?.data ||
    res?.books ||
    res?.items ||
    res?.rows ||
    (Array.isArray(res) ? res : []);

  const totalPage =
    res?.pagination?.totalPage ||
    res?.pagination?.total_pages ||
    res?.totalPage ||
    res?.total_pages;

  return { books, totalPage };
}

function normalizeImageUrl(raw: unknown) {
  if (typeof raw !== "string") return "";
  const s = raw.trim();
  if (!s) return "";

  // url đầy đủ
  if (s.startsWith("http://") || s.startsWith("https://")) return s;

  // đã là /images/...
  if (s.startsWith("/images/")) return s;

  // là images/...
  if (s.startsWith("images/")) return `/${s}`;

  // nếu backend chỉ lưu filename: abc.jpg -> /images/abc.jpg
  if (!s.startsWith("/")) return `/images/${s}`;

  // các trường hợp còn lại
  return s;
}

export default function HomePage() {
  const { user, loading } = useAuth();

  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [booksError, setBooksError] = useState<string>("");

  const [page, setPage] = useState(1);
  const LIMIT = 8;

  const fetchBooks = async (pageNum: number) => {
    setBooksLoading(true);
    setBooksError("");
    try {
      const res = await apiFetch<any>(`/book?page=${pageNum}&limit=${LIMIT}`, {
        method: "GET",
      });
      const { books: list } = pickBooksFromResponse(res);
      setBooks(list || []);
    } catch (e: any) {
      setBooksError(e?.message || "Không tải được danh sách sách");
      setBooks([]);
    } finally {
      setBooksLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const categories = useMemo(
    () => [
      { label: "Tiểu Thuyết", Icon: BookText },
      { label: "Phi Hư Cấu", Icon: ScrollText },
      { label: "Sách Giáo Khoa", Icon: GraduationCap },
      { label: "Sách Thiếu Nhi", Icon: Baby },
      { label: "Sách Hiếm", Icon: Gem },
      { label: "Truyện Tranh", Icon: MessageCircle },
      { label: "Sách Nấu Ăn", Icon: UtensilsCrossed },
      { label: "Tất Cả", Icon: LayoutGrid },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* HEADER */}
      <Header user={user} loading={loading} />

      {/* HERO + SEARCH */}
      <section className="bg-sky-500">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Sách hay gần bạn, trao đổi nhanh!
          </h1>
          <p className="mt-3 text-white/90">
            Tìm cuốn sách tuyệt vời tiếp theo từ cộng đồng yêu sách.
          </p>

          {/* Search bar (UI only) */}
          <div className="mt-8 mx-auto max-w-3xl">
            <div className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-lg">
              <button className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-700 hover:bg-slate-50 border border-slate-200">
                <span className="opacity-80">☰</span>
                <span className="text-sm font-medium">Danh mục</span>
                <ChevronDown size={16} className="opacity-60" />
              </button>

              <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2 border border-transparent">
                <Search size={18} className="text-slate-400" />
                <input
                  className="w-full outline-none text-slate-700 placeholder:text-slate-400"
                  placeholder="Tìm kiếm theo tiêu đề, tác giả, ISBN..."
                />
              </div>

              <button className="rounded-xl bg-sky-600 px-5 py-2.5 text-white font-semibold hover:bg-sky-700">
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY QUICK ICONS */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
            {categories.map(({ label, Icon }) => (
              <button
                key={label}
                className="group flex flex-col items-center gap-2"
              >
                <div className="h-14 w-14 rounded-full bg-sky-50 flex items-center justify-center border border-sky-100 group-hover:bg-sky-100">
                  <Icon size={22} className="text-sky-600" />
                </div>
                <div className="text-xs sm:text-sm text-slate-700">{label}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-6xl px-4 pb-16">
        {/* Section header + tabs */}
        <div className="mt-2 bg-white rounded-2xl border p-6">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">Sách Mới Về</h2>
            </div>

            {/* keep your existing pagination logic, just restyle */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                className="rounded-xl border px-3 py-2 hover:bg-slate-50 disabled:opacity-50"
                disabled={page <= 1 || booksLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Trang trước
              </button>
              <div className="text-sm text-slate-600">Trang: {page}</div>
              <button
                className="rounded-xl border px-3 py-2 hover:bg-slate-50 disabled:opacity-50"
                disabled={booksLoading || books.length < LIMIT}
                onClick={() => setPage((p) => p + 1)}
              >
                Trang sau
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-6 text-sm">
            <button className="pb-2 border-b-2 border-sky-600 text-sky-600 font-semibold">
              Sách Mới Về
            </button>
            <button className="pb-2 border-b-2 border-transparent text-slate-500 hover:text-slate-700">
              Dành cho bạn
            </button>
            <button className="pb-2 border-b-2 border-transparent text-slate-500 hover:text-slate-700">
              Nổi bật
            </button>
            <button className="pb-2 border-b-2 border-transparent text-slate-500 hover:text-slate-700">
              Phổ biến
            </button>
          </div>

          {/* BOOK GRID */}
          {booksLoading ? (
            <div className="mt-6 text-slate-600">Đang tải sách...</div>
          ) : booksError ? (
            <div className="mt-6 text-sm text-red-500">{booksError}</div>
          ) : books.length === 0 ? (
            <div className="mt-6 text-sm text-slate-500">
              Chưa có sách để hiển thị.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {books.map((b) => {
                const img = normalizeImageUrl(b.image_url);
                const priceText =
                  typeof b.price === "number"
                    ? b.price > 0
                      ? `${b.price.toLocaleString("vi-VN")} đ`
                      : "Miễn phí để đổi"
                    : "Miễn phí để đổi";

                return (
                  <div
                    key={b.book_id}
                    className="group rounded-2xl border bg-white overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="relative">
                      <div className="aspect-[4/3] w-full bg-slate-100 overflow-hidden">
                        {img ? (
                          <img
                            src={img}
                            alt={b.title}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm text-slate-500">
                            No Image
                          </div>
                        )}
                      </div>

                      <button className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/95 border shadow-sm flex items-center justify-center hover:bg-white">
                        <Heart size={18} className="text-slate-600" />
                      </button>
                    </div>

                    <div className="p-4">
                      <div className="font-semibold leading-snug line-clamp-2">
                        {b.title}
                      </div>
                      <div className="mt-1 text-sm text-slate-500 line-clamp-1">
                        by {b.author || "—"}
                      </div>

                      <div className="mt-2 text-sm font-semibold text-emerald-600">
                        {priceText}
                      </div>

                      <div className="mt-1 text-xs text-slate-400 line-clamp-1">
                        {b.publisher ? `NXB ${b.publisher}` : b.category ? b.category : ""}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load more style button (UI giống hình, vẫn dùng page state) */}
          <div className="mt-10 flex justify-center">
            <button
              className="rounded-xl border border-sky-300 text-sky-700 px-8 py-3 hover:bg-sky-50 disabled:opacity-50"
              disabled={booksLoading || books.length < LIMIT}
              onClick={() => setPage((p) => p + 1)}
            >
              Tải Thêm Sách
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
