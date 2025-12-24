import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import { profileApi, type User } from "../api/auth.api";
import { createBookApi } from "../api/book.api";

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

export default function SellBook() {
  const nav = useNavigate();

  // ===== auth (không dùng AuthContext) =====
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== form state =====
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("tieuthuyet");
  const [condition, setCondition] = useState("99"); // UI-only, sẽ gộp vào description
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async () => {
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề sách");
      return;
    }

    setSubmitting(true);
    try {
      const descWithCondition =
        `${description || ""}\n\nTình trạng: ${condition}%`.trim();

      const res = await createBookApi({
        title: title.trim(),
        author: author.trim() || undefined,
        category,
        description: descWithCondition || undefined,
        price: price.trim() ? Number(price) : undefined,
        stock: 1,
        status: "active",
        images,
      });

      toast.success(res?.message || "Đăng bán thành công!");
      nav("/"); // hoặc nav("/my-books")
    } catch (e: any) {
      // thường gặp nếu user không có role seller: 403
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
              <p className="mt-1 text-sm text-slate-500">
                Điền thông tin chi tiết để sách của bạn tiếp cận đúng người cần.
              </p>
            </div>

            <SectionCard title="Thông tin sách" icon={<BookOpen size={18} />}>
              <div className="space-y-4">
                <div>
                  <Label required>Tiêu đề sách</Label>
                  <Input
                    value={title}
                    onChange={(e: any) => setTitle(e.target.value)}
                    placeholder="Nhập tên sách đầy đủ (Ví dụ: Nhà Giả Kim)"
                  />
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
                    value={description}
                    onChange={(e: any) => setDescription(e.target.value)}
                    placeholder="Mô tả thêm về nội dung, lý do bán, hoặc tình trạng cụ thể của sách..."
                  />
                </div>

                {/* ✅ cần lấy được files để gửi API */}
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
                    <Input placeholder="Nhập SĐT để người mua gọi" autoComplete="tel" />
                  </div>
                </div>

                <div>
                  <Label>Khu vực giao dịch</Label>
                  <Input placeholder="Ví dụ: Quận Cầu Giấy, Hà Nội" autoComplete="street-address" />
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

                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-xl border bg-white px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Lưu nháp
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
