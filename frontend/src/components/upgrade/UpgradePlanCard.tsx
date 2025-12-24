import { CheckCircle2, Info } from "lucide-react";

type Props = {
  priceVnd?: number;
  title?: string;
  subtitle?: string;
};

export default function UpgradePlanCard({
  priceVnd = 50000,
  title = "Gói Người Bán Chuyên Nghiệp",
  subtitle = "Giải pháp toàn diện cho việc bán sách",
}: Props) {
  const formatVnd = (n: number) =>
    n.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + "đ";

  const benefits = [
    {
      title: "Đăng bán sách không giới hạn",
      desc: "Thoải mái đăng tải toàn bộ tủ sách của bạn",
    },
    {
      title: 'Huy hiệu "Người bán uy tín"',
      desc: "Tăng độ tin cậy với người mua hàng",
    },
    {
      title: "Công cụ quản lý đơn hàng",
      desc: "Theo dõi trạng thái và doanh thu dễ dàng",
    },
    {
      title: "Hỗ trợ ưu tiên 24/7",
      desc: "Giải đáp thắc mắc nhanh chóng qua Zalo",
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="bg-sky-600 px-6 py-4">
        <div className="text-base font-extrabold text-white">{title}</div>
        <div className="mt-1 text-xs text-sky-100">{subtitle}</div>
      </div>

      <div className="px-6 py-7">
        <div className="flex items-end justify-center gap-2">
          <div className="text-5xl font-black tracking-tight text-slate-900">
            {formatVnd(priceVnd)}
          </div>
          <div className="pb-2 text-sm text-slate-500">/ tháng</div>
        </div>

        <div className="mt-7">
          <div className="text-xs font-black text-slate-900">
            QUYỀN LỢI ĐẶC BIỆT:
          </div>

          <ul className="mt-4 space-y-4">
            {benefits.map((it, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-50 text-sky-600">
                  <CheckCircle2 size={16} />
                </span>
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {it.title}
                  </div>
                  <div className="text-xs text-slate-500">{it.desc}</div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-white text-slate-600 border border-slate-200">
                <Info size={16} />
              </span>
              <div className="text-xs text-slate-600">
                Sau khi gửi yêu cầu, hệ thống sẽ kiểm tra biên lai và kích hoạt
                quyền <b>Người bán</b>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
