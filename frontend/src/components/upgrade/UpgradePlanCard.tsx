import { CheckCircle2, Info, WalletCards, Loader2, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

type Props = {
  priceVnd?: number;
  title?: string;
  subtitle?: string;
  priceNote?: string;

  onPay?: () => void;
  paying?: boolean;
  payDisabled?: boolean;
};

export default function UpgradePlanCard({
  priceVnd =0,
  title = "Gói Nâng cấp Người bán",
  subtitle = "Thanh toán MoMo để kích hoạt quyền Người bán",
  priceNote = "Phí kích hoạt (một lần)",
  onPay,
  paying = false,
  payDisabled = false,
}: Props) {
  const formatVnd = (n: number) =>
    n.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + "đ";

  const benefits = [
    { title: "Đăng bán sách không giới hạn", desc: "Thoải mái đăng tải toàn bộ tủ sách của bạn" },
    { title: 'Huy hiệu "Người bán uy tín"', desc: "Tăng độ tin cậy với người mua hàng" },
    { title: "Công cụ quản lý đơn hàng", desc: "Theo dõi trạng thái và doanh thu dễ dàng" },
    { title: "Hỗ trợ ưu tiên 24/7", desc: "Giải đáp thắc mắc nhanh chóng qua Zalo" },
  ];
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="relative bg-slate-900 px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-extrabold text-white">
              <Sparkles size={14} />
              NÂNG CẤP TÀI KHOẢN
            </div>

            <div className="mt-3 text-lg font-black text-white">{title}</div>
            <div className="mt-1 text-xs font-semibold text-slate-200">{subtitle}</div>
          </div>

          <div className="shrink-0 rounded-2xl bg-white px-3 py-2 shadow-sm">
            <div className="text-[10px] font-black text-slate-500">THANH TOÁN</div>
            <div className="mt-0.5 text-sm font-black text-slate-900">MoMo</div>
          </div>
        </div>

        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-white/5" />
      </div>

      <div className="px-6 py-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-black text-slate-500">GIÁ GÓI</div>
            <div className="mt-1 text-4xl font-black tracking-tight text-slate-900">
              {formatVnd(priceVnd)}
            </div>
            <div className="mt-1 text-xs font-bold text-slate-500">{priceNote}</div>
          </div>

          <div className="hidden sm:flex flex-col items-end gap-2">
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700">
              <ShieldCheck size={16} />
              Giao dịch an toàn
            </div>
            <div className="text-[11px] font-semibold text-slate-500">Hỗ trợ: Zalo/Email</div>
          </div>
        </div>
        {onPay ? (
          <button
            onClick={onPay}
            disabled={payDisabled || paying}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-black text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {paying ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Đang tạo giao dịch...
              </>
            ) : (
              <>
                <WalletCards size={18} />
                Thanh toán MoMo
                <ArrowRight size={18} />
              </>
            )}
          </button>
        ) : null}
        <div className="mt-7">
          <div className="text-xs font-black text-slate-900">QUYỀN LỢI</div>
          <ul className="mt-4 space-y-4">
            {benefits.map((it, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-900">
                  <CheckCircle2 size={16} />
                </span>
                <div>
                  <div className="text-sm font-bold text-slate-900">{it.title}</div>
                  <div className="text-xs text-slate-500">{it.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700">
              <Info size={16} />
            </span>
            <div className="text-xs text-slate-600">
              Bạn sẽ được chuyển sang MoMo để thanh toán. Sau khi thanh toán, hệ thống sẽ tự động cập nhật quyền{" "}
              <b>Người bán</b> và chuyển về trang kết quả.
            </div>
          </div>
          <div className="mt-3 text-center text-[11px] font-bold text-slate-500">
            Lưu ý: Trạng thái giao dịch phụ thuộc kết quả xử lý từ MoMo.
          </div>
        </div>
      </div>
    </div>
  );
}
