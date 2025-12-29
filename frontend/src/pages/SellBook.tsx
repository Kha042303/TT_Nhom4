import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import { profileApi, type User } from "../api/auth.api";
import {
  createBookApi,
  searchExternalBooksByTitleApi,
  type ExternalBookCandidate,
} from "../api/book.api";

import SectionCard from "../components/sell/SectionCard";
import { Input, Label, Select, Textarea } from "../components/sell/FormField";
import ImageDropzone from "../components/sell/ImageDropzone";
import TipsCard from "../components/sell/TipsCard";
import SafetyCard from "../components/sell/SafetyCard";

import { ArrowLeft, BookOpen, User2, UploadCloud } from "lucide-react";

function safeGetTokenFromStorage() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token") ||
    ""
  );
}

function mapExternalCategoryToLocalOption(cat?: string) {
  const s = (cat || "").toLowerCase();
  if (!s) return null;

  if (s.includes("thiếu") || s.includes("kid") || s.includes("children")) return "thieunhi";
  if (s.includes("kinh") || s.includes("econom") || s.includes("business") || s.includes("finance"))
    return "kinhte";
  if (s.includes("giáo") || s.includes("textbook") || s.includes("education")) return "giaokhoa";
  if (s.includes("tiểu thuyết") || s.includes("fiction") || s.includes("novel")) return "tieuthuyet";

  return "khac";
}

function parsePublishedYearFromDate(dateStr?: string): number | undefined {
  const s = (dateStr || "").trim();
  if (!s) return undefined;
  const m = s.match(/^(\d{4})/);
  if (!m) return undefined;
  const y = Number(m[1]);
  return Number.isFinite(y) ? y : undefined;
}

export default function SellBook() {
  const nav = useNavigate();

  // ===== auth =====
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const token = safeGetTokenFromStorage();
      if (!token) {
        setUser(null);
        setLoading(false);
        nav("/signin", { replace: true });
        return;
      }

      try {
        const u = await profileApi();
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
      } catch {
        setUser(null);
        localStorage.removeItem("user");
        nav("/signin", { replace: true });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");

  // ✅ NEW: năm xuất bản
  const [publishedYear, setPublishedYear] = useState<string>("");

  const [category, setCategory] = useState("tieuthuyet");

  // ✅ Bạn muốn: tình trạng lưu vào description
  const [condition, setCondition] = useState("99");

  const [price, setPrice] = useState<string>("");

  // ✅ Bạn muốn: mô tả chi tiết lưu vào seller_note
  const [sellerNote, setSellerNote] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // ===== AUTO-FILL theo TIÊU ĐỀ (Google Books) =====
  const [titleSug, setTitleSug] = useState<ExternalBookCandidate[]>([]);
  const [titleOpen, setTitleOpen] = useState(false);
  const [titleLoading, setTitleLoading] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string>("");

  useEffect(() => {
    const q = title.trim();
    if (q.length < 3) {
      setTitleSug([]);
      setTitleLoading(false);
      return;
    }

    const ac = new AbortController();
    const t = window.setTimeout(async () => {
      try {
        setTitleLoading(true);
        const list = await searchExternalBooksByTitleApi(q, { maxResults: 8, signal: ac.signal });
        setTitleSug(Array.isArray(list) ? list : []);
      } catch (e: any) {
        if (e?.name !== "AbortError") setTitleSug([]);
      } finally {
        setTitleLoading(false);
      }
    }, 450);

    return () => {
      window.clearTimeout(t);
      ac.abort();
    };
  }, [title]);

  const applyTitleCandidate = (it: ExternalBookCandidate) => {
    if (it.title) setTitle(it.title);
    if (it.author) setAuthor(it.author);
    if (it.publisher) setPublisher(it.publisher);

    // ✅ năm xuất bản từ Google Books
    const y = parsePublishedYearFromDate(it.publishedDate);
    if (y && !publishedYear.trim()) setPublishedYear(String(y));

    // ✅ mô tả (bạn muốn lưu seller_note) lấy từ Google Books nếu user chưa nhập
    if (it.description && !sellerNote.trim()) setSellerNote(it.description);

    // preview ảnh bìa (tham khảo)
    if (it.thumbnail) setCoverPreview(it.thumbnail);

    // map category (nếu có)
    const mapped = mapExternalCategoryToLocalOption(it.category);
    if (mapped) setCategory(mapped);

    setTitleOpen(false);
    toast.success("Đã tự điền thông tin theo tiêu đề");
  };

  const onSubmit = async () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề sách");
      return;
    }

    // validate year
    let yearNum: number | undefined = undefined;
    if (publishedYear.trim()) {
      const y = Number(publishedYear.trim());
      const currentYear = new Date().getFullYear();
      if (!Number.isFinite(y) || y < 1000 || y > currentYear + 1) {
        toast.error("Năm xuất bản không hợp lệ");
        return;
      }
      yearNum = y;
    }

    setSubmitting(true);
    try {
      // ✅ Bạn yêu cầu: tình trạng nằm trong description
      const description = `Tình trạng: ${condition}%`;

      const res = await createBookApi({
        title: title.trim(),
        author: author.trim() || undefined,
        publisher: publisher.trim() || undefined,
        category,

        // ✅ tình trạng -> description
        description,

        // ✅ mô tả -> seller_note
        seller_note: sellerNote.trim() || undefined,

        price: price.trim() ? Number(price) : undefined,
        stock: 1,
        status: "active",
        images,

        published_year: yearNum,
      });

      toast.success(res?.message || "Đăng bán thành công!");
      nav("/");
    } catch (e: any) {
      toast.error(e?.message || "Đăng bán thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header user={user} loading={loading} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-5">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600"
          >
            <ArrowLeft size={16} />
            Quay lại trang chủ
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h1 className="text-xl font-bold">Đăng Bán Sách Cũ</h1>
              <p className="mt-1 text-sm text-slate-500"></p>
            </div>

            <SectionCard title="Thông tin sách" icon={<BookOpen size={18} />}>
              <div className="space-y-4">
                {/* Title auto-fill */}
                <div className="relative">
                  <Label required>Tiêu đề sách</Label>

                  <div className="relative">
                    <Input
                      value={title}
                      onChange={(e: any) => setTitle(e.target.value)}
                      placeholder="Gõ tiêu đề (≥ 3 ký tự) để tìm..."
                      onFocus={() => setTitleOpen(true)}
                      onBlur={() => window.setTimeout(() => setTitleOpen(false), 150)}
                      onKeyDown={(e: any) => {
                        if (e.key === "Enter" && titleSug?.[0]) {
                          e.preventDefault();
                          applyTitleCandidate(titleSug[0]);
                        }
                        if (e.key === "Escape") setTitleOpen(false);
                      }}
                    />

                    {titleOpen && (titleLoading || titleSug.length > 0) ? (
                      <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-xl border bg-white shadow">
                        {titleLoading ? (
                          <div className="px-3 py-2 text-sm text-slate-500">Đang tìm…</div>
                        ) : (
                          titleSug.map((it) => (
                            <button
                              key={it.id}
                              type="button"
                              onMouseDown={(e) => e.preventDefault()}
                              onClick={() => applyTitleCandidate(it)}
                              className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-slate-50"
                            >
                              <div className="h-12 w-10 overflow-hidden rounded-md border bg-white">
                                {it.thumbnail ? (
                                  <img
                                    src={it.thumbnail}
                                    alt="cover"
                                    className="h-full w-full object-cover"
                                  />
                                ) : null}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-semibold text-slate-900 line-clamp-1">
                                  {it.title}
                                </div>
                                <div className="text-xs text-slate-500 line-clamp-1">
                                  {it.author || "—"}
                                  {it.publisher ? ` • ${it.publisher}` : ""}
                                  {it.publishedDate ? ` • ${it.publishedDate}` : ""}
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      disabled={titleLoading || !titleSug?.length}
                      onClick={() => titleSug?.[0] && applyTitleCandidate(titleSug[0])}
                      className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                      title="Tự điền theo kết quả đầu (Enter cũng được)"
                    >
                      {titleLoading ? "Đang tìm..." : "Tự điền"}
                    </button>

                    <p className="text-xs text-slate-500"></p>
                  </div>

                  {coverPreview ? (
                    <div className="mt-3 flex gap-3 rounded-2xl border bg-slate-50 p-3">
                      <img
                        src={coverPreview}
                        alt="cover preview"
                        className="h-16 w-12 rounded-md object-cover border bg-white"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 line-clamp-1">
                          Ảnh bìa (từ nguồn ngoài)
                        </div>
                        <div className="text-xs text-slate-500">
                          Ảnh này chỉ để tham khảo — muốn đăng ảnh thì upload bên dưới.
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label required>Tác giả</Label>
                    <Input
                      value={author}
                      onChange={(e: any) => setAuthor(e.target.value)}
                      placeholder="Tên tác giả"
                    />
                  </div>

                  <div>
                    <Label>Nhà xuất bản</Label>
                    <Input
                      value={publisher}
                      onChange={(e: any) => setPublisher(e.target.value)}
                      placeholder="VD: Kim Đồng, Trẻ..."
                    />
                  </div>

                  <div>
                    <Label>Năm xuất bản</Label>
                    <Input
                      value={publishedYear}
                      onChange={(e: any) => setPublishedYear(e.target.value)}
                      placeholder="VD: 2020"
                      inputMode="numeric"
                    />
                  </div>

                  <div>
                    <Label>Thể loại</Label>
                    <Select value={category} onChange={(e: any) => setCategory(e.target.value)}>
                      <option value="tieuthuyet">Tiểu thuyết</option>
                      <option value="kinhte">Kinh tế</option>
                      <option value="thieunhi">Thiếu nhi</option>
                      <option value="giaokhoa">Giáo khoa</option>
                      <option value="khac">Khác</option>
                    </Select>
                  </div>

                  <div>
                    <Label required>Tình trạng sách</Label>
                    <Select value={condition} onChange={(e: any) => setCondition(e.target.value)}>
                      <option value="99">Như mới (99%) - Không trầy xước</option>
                      <option value="90">Tốt (90%) - Có dấu hiệu sử dụng nhẹ</option>
                      <option value="80">Khá (80%) - Có trầy xước</option>
                      <option value="70">Cũ (70%) - Có hư hỏng nhỏ</option>
                    </Select>
                
                  </div>

                  <div>
                    <Label>Giá bán (VNĐ)</Label>
                    <div className="relative">
                      <Input
                        value={price}
                        onChange={(e: any) => setPrice(e.target.value)}
                        placeholder="VD: 50000"
                        inputMode="numeric"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                        đ
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Mô tả chi tiết</Label>
                  <Textarea
                    rows={4}
                    value={sellerNote}
                    onChange={(e: any) => setSellerNote(e.target.value)}
                    placeholder="Nhập mô tả chi tiết về sách, tình trạng, v.v."
                  />
                 
                </div>

                <ImageDropzone files={images} onChange={setImages} />
              </div>
            </SectionCard>

            <SectionCard title="Thông tin người bán" icon={<User2 size={18} />}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tên người bán</Label>
                    <Input
                      placeholder="Người dùng"
                      defaultValue={user?.full_name || user?.email || ""}
                      disabled
                    />
                  </div>
                  <div>
                    <Label>Số điện thoại liên hệ</Label>
                    <Input
                      placeholder="Nhập SĐT để người mua gọi"
                      autoComplete="tel"
                      defaultValue={user?.phone}
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <Label>Khu vực giao dịch</Label>
                  <Input
                    placeholder="Ví dụ: Quận Cầu Giấy, Hà Nội"
                    autoComplete="street-address"
                    defaultValue={user?.address}
                    disabled
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={onSubmit}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 text-white px-4 py-3 font-semibold shadow hover:bg-sky-600 disabled:opacity-60"
                  >
                    <UploadCloud size={18} />
                    {submitting ? "Đang đăng..." : "Đăng Bán Ngay"}
                  </button>
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="space-y-6">
            <TipsCard />
            <SafetyCard />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
