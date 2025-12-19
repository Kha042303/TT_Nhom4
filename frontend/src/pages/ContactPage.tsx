import ContactForm from "../components/contact/ContactForm";
import { Mail, MapPin, Phone } from "lucide-react";
import { useAuth } from "../context/AuthContext";
// ✅ ĐỔI PATH cho đúng file Header/Footer bạn đang có
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function ContactPage() {
  // UI-only: sau này nối API thì thay bằng data từ BE
  const contactInfo = {
    address:
      "123 Đường Sách Nguyễn Văn Bình, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
    emails: ["hotro@sachcutraodoi.vn", "hoptac@sachcutraodoi.vn"],
    phone: "(028) 3838 3838",
    workingTime: "Thứ 2 - Thứ 6 8:00 - 17:00",
  };

  const topics = [
    "Hỗ trợ tài khoản",
    "Báo cáo vấn đề",
    "Đăng bán sách",
    "Thanh toán",
    "Góp ý khác",
  ];
  const { user, loading } = useAuth();
  return (
    <>
      <Header user={user} loading={loading} />

      <div className="min-h-screen bg-white">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-sky-500" />
          <div className="absolute inset-0 opacity-20">
            <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.6),transparent_35%),radial-gradient(circle_at_80%_30%,rgba(255,255,255,0.45),transparent_35%),radial-gradient(circle_at_40%_80%,rgba(255,255,255,0.35),transparent_40%)]" />
          </div>

          <div className="relative mx-auto max-w-6xl px-4 py-16 text-center text-white">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Liên Hệ Với Chúng Tôi
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-white/90 leading-relaxed">
              Chúng tôi luôn sẵn sàng lắng nghe ý kiến đóng góp, giải đáp thắc mắc
              và hỗ trợ bạn trong quá trình trao đổi sách.
            </p>
          </div>
        </section>

        {/* CONTENT */}
        <main className="mx-auto max-w-6xl px-4 py-14">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* LEFT */}
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                Thông tin liên lạc
              </h2>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Bạn gặp khó khăn khi đăng bán sách, tìm kiếm sách cũ hay có câu hỏi
                về cộng đồng? Hãy liên hệ ngay với đội ngũ hỗ trợ của Sách Cũ Trao
                Đổi. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
              </p>

              <div className="mt-8 space-y-4">
                <InfoRow
                  icon={<MapPin className="text-sky-600" size={18} />}
                  title="Địa chỉ"
                  desc={contactInfo.address}
                />
                <InfoRow
                  icon={<Mail className="text-sky-600" size={18} />}
                  title="Email"
                  desc={
                    <div className="space-y-1">
                      {contactInfo.emails.map((e) => (
                        <div key={e} className="text-slate-700">
                          {e}
                        </div>
                      ))}
                    </div>
                  }
                />
                <InfoRow
                  icon={<Phone className="text-sky-600" size={18} />}
                  title="Điện thoại"
                  desc={
                    <div className="space-y-1">
                      <div className="text-slate-700">{contactInfo.phone}</div>
                      <div className="text-sm text-slate-500">
                        {contactInfo.workingTime}
                      </div>
                    </div>
                  }
                />
              </div>

              {/* FAQ card (UI-only) */}
              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Câu hỏi thường gặp?
                </h3>
                <p className="mt-2 text-slate-600">
                  Tìm kiếm câu trả lời nhanh chóng cho các vấn đề phổ biến trong
                  kho kiến thức của chúng tôi.
                </p>

                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-2 font-semibold text-sky-600 hover:text-sky-700"
                >
                  Xem FAQ <span aria-hidden>→</span>
                </button>
              </div>
            </div>

            {/* RIGHT: FORM */}
            <ContactForm topics={topics} />
          </div>
        </main>

        <div className="h-8" />
      </div>

      <Footer />
    </>
  );
}

function InfoRow({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="h-12 w-12 rounded-2xl bg-sky-50 flex items-center justify-center">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="font-extrabold text-slate-900">{title}</div>
        <div className="mt-1 text-slate-600 leading-relaxed">{desc}</div>
      </div>
    </div>
  );
}
