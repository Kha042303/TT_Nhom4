import { Link } from "react-router-dom";
import {
  Plus,
  UserPlus,
  Camera,
  ClipboardList,
  Rocket,
  Sun,
  FileText,
  MessageSquareText,
  HelpCircle,
  Gavel,
  Headset,
  Image as ImageIcon,
} from "lucide-react";

// ⚠️ ĐỔI PATH đúng dự án bạn
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function PostGuidePage() {
  const steps = [
    {
      icon: <UserPlus className="text-sky-600" size={22} />,
      title: "1. Tạo Tài Khoản",
      desc: "Đăng ký thành viên để bắt đầu quản lý kho sách của bạn và tham gia cộng đồng.",
    },
    {
      icon: <Camera className="text-sky-600" size={22} />,
      title: "2. Chụp Ảnh Sách",
      desc: "Chụp bìa trước, bìa sau và gáy sách. Ảnh đẹp giúp sách dễ tìm chủ mới hơn.",
    },
    {
      icon: <ClipboardList className="text-sky-600" size={22} />,
      title: "3. Điền Thông Tin",
      desc: "Cung cấp chi tiết về tựa đề, tác giả, tình trạng sách và mong muốn trao đổi.",
    },
    {
      icon: <Rocket className="text-sky-600" size={22} />,
      title: "4. Đăng & Chờ Duyệt",
      desc: "Kiểm tra lại và đăng bài. Bài viết sẽ được duyệt trong vòng 24 giờ.",
    },
  ];

  const tips = [
    {
      icon: <Sun className="text-emerald-600" size={18} />,
      title: "Ánh sáng tự nhiên",
      desc: "Chụp ảnh sách gần cửa sổ hoặc ngoài trời để màu sắc trung thực nhất.",
      bg: "bg-emerald-50",
    },
    {
      icon: <FileText className="text-amber-600" size={18} />,
      title: "Mô tả chi tiết tình trạng",
      desc: "Trung thực về các vết rách, ố vàng (nếu có) để tạo niềm tin với người nhận.",
      bg: "bg-amber-50",
    },
    {
      icon: <MessageSquareText className="text-violet-600" size={18} />,
      title: "Phản hồi nhanh chóng",
      desc: "Trả lời tin nhắn và bình luận của người quan tâm càng sớm càng tốt.",
      bg: "bg-violet-50",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nếu Header bạn bắt buộc props user/loading thì giữ như này */}
      <Header user={null as any} loading={false} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-sky-500" />
        <div className="absolute inset-0 opacity-20">
          {/* icon watermark kiểu nhẹ */}
          <div className="absolute left-12 top-10">
            <BookMark />
          </div>
          <div className="absolute right-12 top-16">
            <DocMark />
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-16 text-center text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Hướng Dẫn Đăng Tin Trao Đổi Sách
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/90 leading-relaxed">
            Chia sẻ những cuốn sách cũ của bạn với cộng đồng chỉ trong vài bước
            đơn giản. Kết nối tri thức, lan tỏa niềm vui.
          </p>

          {/* UI-only: nút link (route tuỳ bạn) */}
          <div className="mt-8 flex justify-center">
            <Link
              to="/sell" // hoặc "/posts/create" tùy route của bạn
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-sky-600 shadow hover:bg-sky-50"
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sky-100">
                <Plus size={16} className="text-sky-600" />
              </span>
              Đăng Bài Ngay
            </Link>
          </div>
        </div>
      </section>

      {/* 4 STEPS */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
            Quy Trình 4 Bước Đơn Giản
          </h2>
          <p className="mt-2 text-slate-600">
            Dễ dàng đưa cuốn sách của bạn lên kệ chỉ trong vài phút.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {steps.map((s) => (
            <div key={s.title} className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full border-2 border-sky-100 bg-white flex items-center justify-center shadow-sm">
                <div className="h-11 w-11 rounded-full bg-sky-50 flex items-center justify-center">
                  {s.icon}
                </div>
              </div>
              <div className="mt-5 font-extrabold text-slate-900">{s.title}</div>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TIPS (không có hình minh họa) */}
      <section className="border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
            Mẹo Để Sách Được Trao Đổi Nhanh
          </h2>

          {/* 3 mục dàn hàng ngang */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {tips.map((t) => (
              <div
                key={t.title}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`h-12 w-12 rounded-2xl ${t.bg} flex items-center justify-center`}
                  >
                    {t.icon}
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900">{t.title}</div>
                    <p className="mt-1 text-slate-600 leading-relaxed">{t.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* support cards */}
          <div className="mt-14">
            <div className="text-center font-extrabold text-slate-900">
              Bạn cần hỗ trợ thêm?
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <SupportCard
                icon={<Gavel className="text-slate-600" size={18} />}
                title="Quy định cộng đồng"
                to="/quydinh"
              />
              <SupportCard
                icon={<Headset className="text-slate-600" size={18} />}
                title="Liên hệ hỗ trợ"
                to="/contact"
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

function SupportCard({
  icon,
  title,
  to,
}: {
  icon: React.ReactNode;
  title: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:bg-slate-50 flex items-center justify-center gap-3 font-bold text-slate-800"
    >
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50">
        {icon}
      </span>
      {title}
    </Link>
  );
}

/** watermark icon trái */
function BookMark() {
  return (
    <div className="h-24 w-24 rounded-3xl bg-white/10 flex items-center justify-center">
      <svg
        width="46"
        height="46"
        viewBox="0 0 24 24"
        fill="none"
        className="text-white/50"
      >
        <path
          d="M4 19V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M4 19a2 2 0 0 0 2 2h12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/** watermark icon phải */
function DocMark() {
  return (
    <div className="h-24 w-24 rounded-3xl bg-white/10 flex items-center justify-center">
      <svg
        width="46"
        height="46"
        viewBox="0 0 24 24"
        fill="none"
        className="text-white/50"
      >
        <path
          d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M14 2v6h6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
