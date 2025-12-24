import { Link } from "react-router-dom";
import { XCircle, RotateCcw, Home } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function PaymentFailPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={null as any} loading={false} />

      <main className="mx-auto max-w-3xl px-4 pb-12 pt-12">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
            <XCircle size={28} />
          </div>

          <h1 className="mt-5 text-center text-2xl font-black text-slate-900">
            Thanh toán thất bại
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-center text-sm font-semibold text-slate-600">
            Giao dịch chưa hoàn tất hoặc đã bị huỷ. Bạn có thể thử lại.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/upgrade-seller"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white hover:bg-slate-800"
            >
              <RotateCcw size={18} />
              Thử thanh toán lại
            </Link>

            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-900 hover:bg-slate-50"
            >
              <Home size={18} />
              Về trang chủ
            </Link>
          </div>

          <div className="mt-6 text-center text-xs font-bold text-slate-500">
            Nếu lỗi lặp lại, vui lòng liên hệ hỗ trợ.
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
