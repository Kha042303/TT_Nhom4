// src/pages/HomePage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { profileApi, type User } from "../api/auth.api";
import { listBooksApi, pickBookImages, type Book } from "../api/book.api";
import {
  Search,
  ChevronDown,
  Heart,
  MessageCircle,
  BookText,
  ScrollText,
  GraduationCap,
  Baby,
  Gem,
  UtensilsCrossed,
  LayoutGrid,
} from "lucide-react";

export default function HomePage() {
  /* ===== AUTH ===== */
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const tk =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken");
      if (!tk) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const u = await profileApi();
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
      } catch {
        setUser(null);
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ===== BOOK STATE ===== */
  const [books, setBooks] = useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = useState(false);
  const [booksError, setBooksError] = useState("");

  const [page, setPage] = useState(1);
  const LIMIT = 8;

  /* ===== SEARCH + CATEGORY ===== */
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<string>("Tất Cả");

  useEffect(() => {
    (async () => {
      setBooksLoading(true);
      setBooksError("");
      try {
        const { books } = await listBooksApi({
          page,
          limit: LIMIT,
          status: "active", // ✅ chỉ sách đang đăng bán
          keyword,
          category,
        });
        setBooks(books);
      } catch (e: any) {
        setBooks([]);
        setBooksError(e?.message || "Không tải được danh sách sách");
      } finally {
        setBooksLoading(false);
      }
    })();
  }, [page, keyword, category]);

  /* ===== CATEGORY MAP (QUAN TRỌNG) ===== */
  const categories = useMemo(
    () => [
      { label: "Tiểu thuyết", value: "tieuthuyet", Icon: BookText },
      { label: "Kinh tế", value: "kinhte", Icon: ScrollText },
      { label: "Giáo khoa", value: "giaokhoa", Icon: GraduationCap },
      { label: "Thiếu nhi", value: "thieunhi", Icon: Baby },
      { label: "Khác", value: "khac", Icon: Gem },
      { label: "Tất cả", value: "Tất Cả", Icon: LayoutGrid },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header user={user} loading={loading} />

      {/* ===== HERO + SEARCH ===== */}
      <section className="bg-sky-500">
        <div className="mx-auto max-w-6xl px-4 py-14 text-center text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Sách hay gần bạn, trao đổi nhanh!
          </h1>
          <p className="mt-3 text-white/90">
            Tìm cuốn sách tuyệt vời tiếp theo từ cộng đồng yêu sách.
          </p>

          <div className="mt-8 mx-auto max-w-3xl">
            <div className="flex items-center gap-2 rounded-2xl bg-white p-2 shadow-lg">
              <button className="flex items-center gap-2 rounded-xl px-3 py-2 text-slate-700 border border-slate-200">
                <span className="text-sm font-medium">
                  {
                    categories.find((c) => c.value === category)?.label ??
                    "Tất cả"
                  }
                </span>
                
              </button>

              <div className="flex-1 flex items-center gap-2 rounded-xl px-3 py-2">
                <Search size={18} className="text-slate-400" />
                <input
                  className="w-full outline-none text-slate-700 placeholder:text-slate-400"
                  placeholder="Tìm theo tiêu đề, tác giả, NXB..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
              </div>

              <button
                className="rounded-xl bg-sky-600 px-5 py-2.5 text-white font-semibold hover:bg-sky-700"
                onClick={() => setPage(1)}
              >
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORY ICONS ===== */}
      <section className="bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-10">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
            {categories.map(({ label, value, Icon }) => (
              <button
                key={value}
                onClick={() => {
                  setCategory(value);
                  setPage(1);
                }}
                className="group flex flex-col items-center gap-2"
              >
                <div className="h-14 w-14 rounded-full bg-sky-50 flex items-center justify-center border border-sky-100 group-hover:bg-sky-100">
                  <Icon size={22} className="text-sky-600" />
                </div>
                <div className="text-xs sm:text-sm text-slate-700">
                  {label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOOK LIST + PAGINATION ===== */}
      <main className="mx-auto max-w-6xl px-4 pb-16">
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-end justify-between gap-3">
            <h2 className="text-2xl font-bold">Sách Mới Về</h2>

            {/* PAGINATION */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                className="rounded-xl border px-3 py-2 hover:bg-slate-50 disabled:opacity-50"
                disabled={page <= 1 || booksLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Trang trước
              </button>

              <div className="text-sm text-slate-600">
                Trang: {page}
              </div>

              <button
                className="rounded-xl border px-3 py-2 hover:bg-slate-50 disabled:opacity-50"
                disabled={booksLoading || books.length < LIMIT}
                onClick={() => setPage((p) => p + 1)}
              >
                Trang sau
              </button>
            </div>
          </div>

          {booksLoading ? (
            <div className="mt-6 text-slate-600">Đang tải sách...</div>
          ) : booksError ? (
            <div className="mt-6 text-sm text-red-500">{booksError}</div>
          ) : books.length === 0 ? (
            <div className="mt-6 text-sm text-slate-500">
              Không tìm thấy sách phù hợp.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {books.map((b) => {
                const img = pickBookImages(b)[0] || "";
                const priceText =
                  typeof b.price === "number" && b.price > 0
                    ? `${b.price.toLocaleString("vi-VN")} đ`
                    : "Miễn phí để đổi";

                return (
                  <Link
                    key={b.book_id}
                    to={`/book-detail/${b.book_id}`}
                    className="group rounded-2xl border bg-white overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-[4/3] bg-slate-100">
                      {img ? (
                        <img
                          src={img}
                          alt={b.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-400">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="font-semibold line-clamp-2">
                        {b.title}
                      </div>
                      <div className="text-sm text-slate-500">
                        {b.author || "—"}
                      </div>
                      <div className="mt-1 text-emerald-600 font-semibold">
                        {priceText}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
