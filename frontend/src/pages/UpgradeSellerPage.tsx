// src/pages/UpgradeSellerPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Phone, Mail } from "lucide-react";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import UpgradePlanCard from "../components/upgrade/UpgradePlanCard";
import UpgradeSellerForm from "../components/upgrade/UpgradeSellerForm";

import { profileApi, type User } from "../api/auth.api";
import { createMomoPayment } from "../api/payment.api";

export default function UpgradeSellerPage() {
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
  const SELLER_ROLE_ID = 2;
  const PRICE_VND = 80000;

  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  const canPay = !loading && !!user;

  const handlePay = async () => {
    setPayError(null);
    setPaying(true);
    try {
      const resp = await createMomoPayment({
        role_id: SELLER_ROLE_ID,
        typePayment: "momo",
        amount: PRICE_VND,
      });

      const payUrl = resp?.data?.payUrl;
      if (!payUrl) throw new Error("Không nhận được payUrl từ MoMo");
      window.location.href = payUrl;
    } catch (e: any) {
      setPayError(e?.message || "Tạo thanh toán thất bại");
    } finally {
      setPaying(false);
    }
  };
  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user as any} loading={loading} />
      <main className="mx-auto max-w-6xl px-4 pb-12 pt-10">
        <div className="text-center">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
            Nâng cấp lên Người bán
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm md:text-base text-slate-600">
            Trở thành đối tác của Sách Cũ Online để bắt đầu đăng bán những cuốn sách của bạn.
            Vui lòng hoàn tất biểu mẫu dưới đây để kích hoạt tài khoản.
          </p>
        </div>
        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <section className="lg:col-span-5">
            <UpgradePlanCard
              priceVnd={PRICE_VND}
              onPay={handlePay}
              paying={paying}
              payDisabled={!canPay}
            />
            {!canPay ? (
              <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs font-semibold text-amber-900">
                Bạn cần <b>đăng nhập</b> để thanh toán và nâng cấp tài khoản.
              </div>
            ) : null}

            {payError ? (
              <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-semibold text-rose-900">
                {payError}
              </div>
            ) : null}
          </section>
          <section className="lg:col-span-7">
            <UpgradeSellerForm
              loadingUser={loading}
              currentUser={{
                fullName:
                  (user as any)?.full_name ??
                  (user as any)?.fullName ??
                  (user as any)?.username ??
                  (user as any)?.name ??
                  "",
                email: (user as any)?.email ?? "",
                phone: (user as any)?.phone ?? (user as any)?.phone_number ?? "",
              }}
              onSubmit={(data) => {
                console.log("Upgrade request:", data);
              }}
            />
          </section>
        </div>
        <div className="mt-12 border-t border-slate-200 pt-10">
          <div className="text-center">
            <div className="text-lg font-black text-slate-900">Cần hỗ trợ trực tiếp?</div>
          </div>
          <div className="mt-6 flex flex-col items-center justify-center gap-4 md:flex-row">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                <Phone size={18} />
              </span>
              <div>
                <div className="text-[11px] font-bold text-slate-500">ZALO HOTLINE</div>
                <div className="text-sm font-extrabold text-slate-900">0912.345.678</div>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <Mail size={18} />
              </span>
              <div>
                <div className="text-[11px] font-bold text-slate-500">EMAIL HỖ TRỢ</div>
                <div className="text-sm font-extrabold text-slate-900">
                  hotro@sachcuonline.vn
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
