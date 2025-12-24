import { Link } from "react-router-dom";
import { CheckCircle2, ArrowLeft, Home } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={null as any} loading={false} />

      <main className="mx-auto max-w-3xl px-4 pb-12 pt-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 size={28} />
          </div>

          <h1 className="mt-5 text-center text-2xl font-black text-slate-900">
            Thanh toán thành công
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-center text-sm font-semibold text-slate-600">
            Hệ thống đã ghi nhận giao dịch. Quyền Người bán sẽ được kích hoạt theo gói của bạn.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white hover:bg-slate-800"
            >
              <Home size={18} />
              Về trang chủ
            </Link>

            <Link
              to="/upgrade-seller"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-900 hover:bg-slate-50"
            >
              <ArrowLeft size={18} />
              Quay lại nâng cấp
            </Link>
          </div>

          <div className="mt-6 text-center text-xs font-bold text-slate-500">
            Nếu quyền chưa cập nhật ngay, hãy thử đăng xuất/đăng nhập lại.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
