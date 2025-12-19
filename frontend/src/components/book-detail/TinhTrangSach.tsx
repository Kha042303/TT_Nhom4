import { MapPin, Sparkles } from "lucide-react";

function formatVND(n?: number) {
  if (typeof n !== "number") return undefined;
  return new Intl.NumberFormat("vi-VN").format(n) + " đ";
}

export default function TinhTrangSach({
  badge,
  viewsText,
  title,
  author,
  price,
  oldPrice,
  discountPercent,
  condition,
  location,
}: {
  badge?: string;
  viewsText?: string;
  title?: string;
  author?: string;
  price?: number;
  oldPrice?: number;
  discountPercent?: number;
  condition?: string;
  location?: string;
}) {
  const priceText = formatVND(price);
  const oldPriceText = formatVND(oldPrice);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
          <Sparkles size={14} />
          {badge ?? "Danh mục"}
        </span>
        <span className="text-xs text-slate-500">{viewsText ?? "— lượt xem"}</span>
      </div>

      <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-slate-900">
        {title ?? <span className="inline-block h-8 w-64 bg-slate-100 animate-pulse rounded-lg" />}
      </h1>

      <div className="mt-1 text-slate-600">
        Tác giả:{" "}
        <b className="text-slate-900">
          {author ?? <span className="inline-block h-5 w-40 bg-slate-100 animate-pulse rounded-md" />}
        </b>
      </div>

      {/* Price card */}
      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-end gap-3">
          <div className="text-3xl font-extrabold text-sky-600">
            {priceText ?? <span className="inline-block h-8 w-32 bg-slate-100 animate-pulse rounded-lg" />}
          </div>

          <div className="flex items-center gap-2 pb-1">
            <span className="text-slate-400 line-through">
              {oldPriceText ?? ""}
            </span>
            {typeof discountPercent === "number" ? (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                -{discountPercent}%
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <div className="text-[11px] font-bold text-slate-500">TÌNH TRẠNG</div>
            <div className="mt-1 flex items-center gap-2 font-semibold text-slate-900">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              {condition ?? "—"}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-500">ĐỊA ĐIỂM</div>
            <div className="mt-1 flex items-center gap-2 font-semibold text-slate-900">
              <MapPin size={16} className="text-slate-400" />
              {location ?? "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
