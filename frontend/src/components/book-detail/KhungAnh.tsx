import { useMemo, useState } from "react";

export default function KhungAnh({
  images,
  statusLabel,
}: {
  images?: string[];
  statusLabel?: string;
}) {
  const safeImages = useMemo(() => (images ?? []).filter(Boolean), [images]);
  const [active, setActive] = useState(0);

  const activeSrc = safeImages[active];

  // ✅ chỉ hiển thị thumbs khi có từ 2 ảnh trở lên
  const showThumbs = safeImages.length > 1;
  const thumbs = showThumbs ? safeImages.slice(0, 4) : [];

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm">
        {statusLabel ? (
          <div className="absolute left-4 top-4 z-10 rounded-full bg-sky-600 px-3 py-1 text-xs font-extrabold text-white">
            {statusLabel}
          </div>
        ) : null}

        {/* ✅ giảm chiều cao khung ảnh để đỡ trống */}
        <div className="aspect-[16/9] w-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
          {activeSrc ? (
            <img
              src={activeSrc}
              alt="book"
              className="h-full w-full object-contain"
              draggable={false}
            />
          ) : (
            // ✅ skeleton gọn (không padding + không bo quá lớn)
            <div className="h-full w-full bg-slate-100 animate-pulse" />
          )}
        </div>
      </div>

      {/* ✅ Không render thumbs khi không có ảnh / chỉ có 1 ảnh */}
      {showThumbs ? (
        <div className="mt-4 grid grid-cols-4 gap-3">
          {thumbs.map((src, idx) => {
            const selected = idx === active;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActive(idx)}
                className={[
                  "relative aspect-[16/9] overflow-hidden rounded-xl border bg-white shadow-sm",
                  selected ? "border-sky-500 ring-4 ring-sky-100" : "border-slate-200",
                ].join(" ")}
              >
                <img
                  src={src}
                  alt={`thumb-${idx}`}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
