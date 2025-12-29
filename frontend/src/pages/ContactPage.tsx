// src/pages/ContactPage.tsx
import { useEffect, useState, type ReactNode } from "react";
import ContactForm from "../components/contact/ContactForm";
import { Mail, MapPin, Phone } from "lucide-react";

// ✅ auth theo API bạn đã gửi
import { profileApi, type User } from "../api/auth.api";

// ✅ ĐỔI PATH cho đúng file Header/Footer bạn đang có
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

function safeGetTokenFromStorage() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token") ||
    ""
  );
}

export default function ContactPage() {
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

  // ✅ thay useAuth bằng state local theo api/auth.api.ts
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
            </div>

            {/* RIGHT: FORM */}
   
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
  icon: ReactNode;
  title: string;
  desc: ReactNode;
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
