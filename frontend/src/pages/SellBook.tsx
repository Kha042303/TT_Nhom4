import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";

import SectionCard from "../components/sell/SectionCard";
import { Input, Label, Select, Textarea } from "../components/sell/FormField";
import ImageDropzone from "../components/sell/ImageDropzone";
import TipsCard from "../components/sell/TipsCard";
import SafetyCard from "../components/sell/SafetyCard";

import { ArrowLeft, BookOpen, User2, UploadCloud } from "lucide-react";

export default function SellBook() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header user={user} loading={loading} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        {/* Back */}
        <div className="mb-5">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-sky-600">
            <ArrowLeft size={16} />
            Quay lại trang chủ
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: FORM */}
          <div className="lg:col-span-2 space-y-6">
            {/* Page title card */}
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h1 className="text-xl font-bold">Đăng Bán Sách Cũ</h1>
              <p className="mt-1 text-sm text-slate-500">
                Điền thông tin chi tiết để sách của bạn tiếp cận đúng người cần.
              </p>
            </div>

            {/* Book info */}
            <SectionCard title="Thông tin sách" icon={<BookOpen size={18} />}>
              <div className="space-y-4">
                <div>
                  <Label required>Tiêu đề sách</Label>
                  <Input placeholder="Nhập tên sách đầy đủ (Ví dụ: Nhà Giả Kim)" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label required>Tác giả</Label>
                    <Input placeholder="Tên tác giả" />
                  </div>

                  <div>
                    <Label>Thể loại</Label>
                    <Select defaultValue="tieuthuyet">
                      <option value="tieuthuyet">Tiểu thuyết</option>
                      <option value="kinhte">Kinh tế</option>
                      <option value="thieunhi">Thiếu nhi</option>
                      <option value="giaokhoa">Giáo khoa</option>
                      <option value="khac">Khác</option>
                    </Select>
                  </div>

                  <div>
                    <Label required>Tình trạng sách</Label>
                    <Select defaultValue="99">
                      <option value="99">Như mới (99%) - Không trầy xước</option>
                      <option value="90">Tốt (90%) - Có dấu hiệu sử dụng nhẹ</option>
                      <option value="80">Khá (80%) - Có trầy xước</option>
                      <option value="70">Cũ (70%) - Có hư hỏng nhỏ</option>
                    </Select>
                  </div>

                  <div>
                    <Label>Giá bán (VNĐ)</Label>
                    <div className="relative">
                      <Input placeholder="VD: 50000" />
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
                    placeholder="Mô tả thêm về nội dung, lý do bán, hoặc tình trạng cụ thể của sách..."
                  />
                </div>

                <ImageDropzone />
              </div>
            </SectionCard>

            {/* Seller info */}
            <SectionCard title="Thông tin người bán" icon={<User2 size={18} />}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Tên người bán</Label>
                    <Input placeholder="Người dùng mẫu" />
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
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-500 text-white px-4 py-3 font-semibold shadow hover:bg-sky-600"
                  >
                    <UploadCloud size={18} />
                    Đăng Bán Ngay
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

          {/* RIGHT: SIDEBAR */}
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
