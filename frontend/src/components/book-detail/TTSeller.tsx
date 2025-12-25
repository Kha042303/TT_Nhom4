import { Mail, MapPin, MessageSquareText, Phone, Star, ShieldCheck } from "lucide-react";
import type { SellerInfo } from "./types";

function statusText(s?: SellerInfo["status"]) {
  if (s === "active") return "Đang hoạt động";
  if (s === "inactive") return "Không hoạt động";
  if (s === "banned") return "Bị khóa";
  return "—";
}

export default function TTSeller({
  seller,
  onMessage,
  disabled,
}: {
  seller?: SellerInfo;
  onMessage?: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm font-extrabold text-slate-900">THÔNG TIN NGƯỜI BÁN</div>

        <div className="flex items-center gap-2">
          <span
            className={[
              "h-2 w-2 rounded-full",
              seller?.online ? "bg-emerald-500" : "bg-slate-300",
            ].join(" ")}
          />
          <span className="text-xs text-slate-500">{seller?.online ? "Online" : "Offline"}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-slate-100 border border-slate-200" />
        <div className="min-w-0">
          <div className="font-extrabold text-slate-900">
            {seller?.name ?? (
              <span className="inline-block h-5 w-40 bg-slate-100 animate-pulse rounded-md" />
            )}
          </div>

          <div className="text-sm text-slate-500">{seller?.joinedText ?? "—"}</div>

          <div className="mt-1 flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1 font-bold text-amber-600">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              {typeof seller?.rating === "number" ? seller.rating.toFixed(1) : "—"}
            </span>
            <span className="text-slate-500">({seller?.reviewCount ?? "—"} đánh giá)</span>
          </div>
        </div>
      </div>

      {/* ✅ thêm thông tin liên hệ */}
      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-sm">
        <div className="flex items-start gap-2 text-slate-700">
          <Phone size={16} className="mt-0.5 text-slate-400" />
          <div className="min-w-0">
            <div className="text-xs text-slate-500">Số điện thoại</div>
            <div className="font-semibold break-words">{seller?.phone ?? "—"}</div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-slate-700">
          <Mail size={16} className="mt-0.5 text-slate-400" />
          <div className="min-w-0">
            <div className="text-xs text-slate-500">Email</div>
            <div className="font-semibold break-words">{seller?.email ?? "—"}</div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-slate-700">
          <MapPin size={16} className="mt-0.5 text-slate-400" />
          <div className="min-w-0">
            <div className="text-xs text-slate-500">Địa chỉ</div>
            <div className="font-semibold break-words">{seller?.address ?? "—"}</div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-slate-700">
          <ShieldCheck size={16} className="mt-0.5 text-slate-400" />
          <div className="min-w-0">
            <div className="text-xs text-slate-500">Trạng thái</div>
            <div className="font-semibold break-words">{statusText(seller?.status)}</div>
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={!!disabled}
        onClick={onMessage}
        className={[
          "mt-5 w-full rounded-xl px-4 py-3 font-extrabold text-white shadow inline-flex items-center justify-center gap-2",
          disabled ? "bg-slate-300 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-700",
        ].join(" ")}
      >
        <MessageSquareText size={18} />
        Nhắn tin cho người bán
      </button>

      <div className="mt-3 text-center text-xs text-slate-500">Thường phản hồi trong vòng 5 phút</div>
    </div>
  );
}
