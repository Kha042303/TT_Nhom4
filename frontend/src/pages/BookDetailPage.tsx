import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Flag } from "lucide-react";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import KhungAnh from "../components/book-detail/KhungAnh";
import TinhTrangSach from "../components/book-detail/TinhTrangSach";
import TTSeller from "../components/book-detail/TTSeller";
import ThongTinSach from "../components/book-detail/ThongTinSach";
import MotaChiTiet from "../components/book-detail/MotaChiTiet";

// ✅ THAY ĐỔI 1: Import Container thay vì Component hiển thị trực tiếp
import SachTuongTuContainer from "../components/book-detail/SachTuongTuContainer";

import type { BookDetailUI } from "../components/book-detail/types";

import { getBookDetailApi, pickBookImages, type Book } from "../api/book.api";
import { getUserByIdApi, mapUserToSeller, type UserPublic } from "../api/user.api";
import { profileApi, type User } from "../api/auth.api";

function safeGetTokenFromStorage() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token") ||
    ""
  );
}

export default function BookDetailPage() {
  const { id } = useParams();
  const nav = useNavigate();

  // --- PHẦN 1: XỬ LÝ AUTH (Giữ nguyên) ---
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const tk = localStorage.getItem("token") || localStorage.getItem("accessToken");
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

  // --- PHẦN 2: XỬ LÝ BOOK DETAIL (Giữ nguyên) ---
  const [detailLoading, setDetailLoading] = useState(true);
  const [err, setErr] = useState("");
  const [bookRaw, setBookRaw] = useState<Book | null>(null);
  const [sellerUser, setSellerUser] = useState<UserPublic | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      setDetailLoading(true);
      setErr("");
      setBookRaw(null);
      setSellerUser(null);

      try {
        const b = await getBookDetailApi(id);
        setBookRaw(b);

        if (b?.user_id) {
          const u = await getUserByIdApi(b.user_id);
          setSellerUser(u);
        }
      } catch (e: any) {
        setErr(e?.message || "Không tải được chi tiết sách");
      } finally {
        setDetailLoading(false);
      }
    })();
  }, [id]);

  const handleMessageSeller = () => {
    const sellerId = bookRaw?.user_id;
    if (!sellerId) return;

    const next = `/chat?sellerId=${sellerId}`;
    const token = safeGetTokenFromStorage();

    if (!token) {
      nav(`/signin?next=${encodeURIComponent(next)}`, { replace: true });
      return;
    }

    nav(next);
  };

  const bookUI: BookDetailUI = useMemo(() => {
    if (!bookRaw) return {} as any;

    const images = pickBookImages(bookRaw);

    let condition = "—";
    if (typeof bookRaw.stock === "number") {
      condition = bookRaw.stock > 0 ? `Còn hàng (${bookRaw.stock})` : "Hết hàng";
    } else if (bookRaw.status) {
      condition = bookRaw.status === "active" ? "Đang bán" : "Tạm ẩn";
    }

    const location = sellerUser?.address?.trim() ? sellerUser.address.trim() : "—";
    const seller = mapUserToSeller(sellerUser);

    return {
      title: bookRaw.title,
      author: bookRaw.author || "—",
      badge: bookRaw.category || "Danh mục",
      price: typeof bookRaw.price === "number" ? bookRaw.price : undefined,
      oldPrice: undefined,
      discountPercent: undefined,
      condition,
      location,
      statusLabel: bookRaw.status === "active" ? "ĐANG BÁN" : "TẠM ẨN",
      images,

      meta: {
        publisher: bookRaw.publisher || "—",
        year: typeof bookRaw.published_year === "number" ? bookRaw.published_year : undefined,
        pages: "—",
        language: "Tiếng Việt",
      },

      seller,
    };
  }, [bookRaw, sellerUser]);

  // ❌ ĐÃ XÓA: Phần similarBooks giả (mock data) ở đây

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user} loading={loading} />

      <main className="mx-auto max-w-6xl px-4 pb-12">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 py-4 text-sm text-slate-500">
          <Link to="/" className="hover:text-slate-700">Trang chủ</Link>
          <ChevronRight size={16} className="text-slate-400" />
          <Link to="/books" className="hover:text-slate-700">Sách cũ</Link>
          <ChevronRight size={16} className="text-slate-400" />
          <span className="text-slate-700 line-clamp-1">
            {bookUI.title || (detailLoading ? "Đang tải..." : "Chi tiết sách")}
          </span>
        </div>

        {err ? <div className="rounded-2xl border bg-white p-6 text-red-600">{err}</div> : null}

        {/* Top section */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT */}
          <div className="lg:col-span-7 space-y-4">
            <KhungAnh images={bookUI.images} statusLabel={bookUI.statusLabel} />
            <MotaChiTiet description={bookRaw?.description} sellerNote={bookRaw?.seller_note} />
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-5 space-y-4">
            <TinhTrangSach
              badge={bookUI.badge}
              viewsText={bookUI.viewsText}
              title={bookUI.title}
              author={bookUI.author}
              price={bookUI.price}
              oldPrice={bookUI.oldPrice}
              discountPercent={bookUI.discountPercent}
              condition={bookUI.condition}
              description={bookRaw?.description}
              location={bookUI.location}
            />
            <ThongTinSach meta={bookUI.meta} />
          </div>
        </section>

        <section className="mt-6">
          <TTSeller
            seller={bookUI.seller}
            onMessage={handleMessageSeller}
            disabled={!bookRaw?.user_id}
          />
          <div className="mt-3 flex justify-end">
            <Link 
              to={`/report?type=book&id=${bookRaw?.book_id}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-red-600 hover:underline transition-colors"
            >
              <Flag size={14} /> Báo cáo sách này
            </Link>
          </div>
        </section>

        {/* ✅ THAY ĐỔI 2: Sử dụng SachTuongTuContainer */}
        <section className="mt-10">
          {bookRaw ? (
            <SachTuongTuContainer 
              currentBookId={bookRaw.book_id} 
              category={bookRaw.category} 
            />
          ) : null}
        </section>
      </main>

      <Footer />
    </div>
  );
}