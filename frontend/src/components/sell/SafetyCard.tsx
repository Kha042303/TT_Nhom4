import { Shield } from "lucide-react";

export default function SafetyCard() {
  return (
    <aside className="rounded-2xl border bg-white p-6 text-center shadow-sm">
      <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-50 border flex items-center justify-center text-slate-500">
        <Shield />
      </div>
      <div className="mt-3 font-semibold">Giao dịch an toàn</div>
      <div className="mt-2 text-sm text-slate-500">
        Không chuyển khoản trước khi nhận hàng. Nên giao dịch trực tiếp tại nơi công cộng.
      </div>
    </aside>
  );
}
