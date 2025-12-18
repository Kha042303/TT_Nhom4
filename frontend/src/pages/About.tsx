// src/pages/About.tsx
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useAuth } from "../context/AuthContext";
import {
  BookOpen,
  Globe,
  Camera,
  MessageCircle,
  Repeat,
  ArrowRight,
  Leaf,
  Users,
  ShieldCheck,
  Heart,
  CheckCircle2,
} from "lucide-react";

export default function About() {
  const { user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header user={user} loading={loading} />

      {/* HERO */}
      <section className="bg-sky-500">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Kết Nối Đam Mê - Chia Sẻ Tri Thức
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-white/90 leading-relaxed">
            Nền tảng trao đổi sách cũ phi lợi nhuận, nơi những cuốn sách tìm thấy
            chủ nhân mới và câu chuyện được viết tiếp.
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12 space-y-14">
        {/* SECTION 1 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-50 text-sky-700 border border-sky-100 px-3 py-1 text-xs font-semibold">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-100">
                <BookOpen size={14} />
              </span>
              Sứ mệnh của chúng tôi
            </div>

            <h2 className="mt-4 text-2xl md:text-3xl font-bold">
              Lan tỏa văn hóa đọc &amp; Bảo vệ môi trường
            </h2>

            <p className="mt-4 text-slate-600 leading-relaxed">
              Chúng tôi tin rằng giá trị của một cuốn sách không nằm ở việc nó mới
              hay cũ, mà ở tri thức nó mang lại. Sứ mệnh của “Sách Cũ Trao Đổi”
              là tạo ra một cộng đồng nơi mọi người có thể dễ dàng cho đi những
              cuốn sách đã đọc và nhận lại những cuốn sách mình cần, hoàn toàn
              miễn phí hoặc với chi phí tượng trưng, qua đó giảm thiểu lãng phí
              và bảo vệ môi trường.
            </p>

            <div className="mt-8 flex gap-14">
              <div>
                <div className="text-2xl font-extrabold text-sky-600">5000+</div>
                <div className="mt-1 text-xs text-slate-500">Thành viên hoạt động</div>
              </div>
              <div>
                <div className="text-2xl font-extrabold text-sky-600">12000+</div>
                <div className="mt-1 text-xs text-slate-500">Sách đã trao đổi</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white shadow-sm p-8 flex items-center justify-center min-h-[260px]">
            <div className="h-28 w-28 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
              <BookOpen size={48} />
            </div>
          </div>
        </section>

        {/* SECTION 2 */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="order-2 lg:order-1 rounded-2xl border bg-white shadow-sm p-8 flex items-center justify-center min-h-[260px]">
            <div className="h-28 w-28 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <Globe size={48} />
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 text-xs font-semibold">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-100">
                <Globe size={14} />
              </span>
              Tầm nhìn
            </div>

            <h2 className="mt-4 text-2xl md:text-3xl font-bold">
              Kết nối cộng đồng yêu sách toàn quốc
            </h2>

            <p className="mt-4 text-slate-600 leading-relaxed">
              Chúng tôi hướng tới việc trở thành nền tảng trao đổi sách cũ đáng
              tin cậy nhất tại Việt Nam. Không chỉ là nơi trao đổi vật chất, chúng
              tôi mong muốn xây dựng những mối quan hệ ý nghĩa giữa những người
              yêu sách, từ thành thị đến nông thôn, xóa bỏ rào cản về chi phí trong
              việc tiếp cận tri thức.
            </p>

            <div className="mt-5 space-y-3 text-sm">
              {[
                "Xây dựng thư viện số cộng đồng đa dạng.",
                "Thúc đẩy thói quen đọc sách trong giới trẻ.",
                "Hỗ trợ các dự án sách từ thiện.",
              ].map((t) => (
                <div key={t} className="flex items-start gap-2 text-slate-700">
                  <CheckCircle2 className="text-emerald-500 mt-0.5" size={18} />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="pt-6">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold">Cách Thức Hoạt Động</h2>
            <p className="mt-3 text-sm text-slate-500 max-w-2xl mx-auto">
              Đơn giản, minh bạch và hoàn toàn miễn phí. Hãy bắt đầu hành trình
              trao đổi sách của bạn chỉ với 3 bước.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <HowStep
              icon={<Camera size={22} />}
              title="1. Đăng Sách Cũ"
              desc="Chụp ảnh và mô tả tình trạng cuốn sách bạn muốn trao đổi. Đăng lên hệ thống chỉ trong vài giây."
            />
            <HowStep
              icon={<MessageCircle size={22} />}
              title="2. Kết Nối & Thỏa Thuận"
              desc="Tìm sách bạn cần và chat trực tiếp với chủ sở hữu. Thỏa thuận hình thức trao đổi phù hợp."
            />
            <HowStep
              icon={<Repeat size={22} />}
              title="3. Trao Đổi Sách"
              desc="Gặp mặt trực tiếp hoặc gửi qua đường bưu điện. Nhận sách mới và tận hưởng niềm vui đọc sách."
            />
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 text-white px-6 py-3 font-semibold shadow hover:bg-sky-600"
            >
              Tham Gia Ngay <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* CORE VALUES */}
        <section className="pt-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold">Giá Trị Cốt Lõi</h2>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard
              icon={<Leaf className="text-emerald-600" size={22} />}
              title="Bền Vững"
              desc="Góp phần bảo vệ môi trường bằng cách tái sử dụng tài nguyên."
            />
            <ValueCard
              icon={<Users className="text-sky-600" size={22} />}
              title="Cộng Đồng"
              desc="Xây dựng cộng đồng gắn kết, sẻ chia và hỗ trợ lẫn nhau."
            />
            <ValueCard
              icon={<ShieldCheck className="text-amber-600" size={22} />}
              title="Tin Cậy"
              desc="Đề cao sự trung thực và minh bạch trong mọi giao dịch."
            />
            <ValueCard
              icon={<Heart className="text-rose-600" size={22} />}
              title="Phi Lợi Nhuận"
              desc="Hoạt động vì cộng đồng, không thu phí giao dịch sách."
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ---------- small UI components (UI-only) ---------- */

function HowStep({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto h-14 w-14 rounded-full bg-white border shadow-sm flex items-center justify-center text-sky-600">
        {icon}
      </div>
      <div className="mt-4 font-semibold">{title}</div>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="h-10 w-10 rounded-xl bg-slate-50 border flex items-center justify-center">
        {icon}
      </div>
      <div className="mt-4 font-semibold">{title}</div>
      <p className="mt-2 text-sm text-slate-600 leading-relaxed">{desc}</p>
    </div>
  );
}
