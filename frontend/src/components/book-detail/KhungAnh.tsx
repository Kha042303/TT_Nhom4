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

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm">
        {statusLabel ? (
          <div className="absolute left-4 top-4 z-10 rounded-full bg-sky-600 px-3 py-1 text-xs font-extrabold text-white">
            {statusLabel}
          </div>
        ) : null}

        {/* main image */}
        <div className="aspect-[4/3] w-full bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center">
          {activeSrc ? (
            <img
              src={activeSrc}
              alt="book"
              className="h-full w-full object-contain"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full p-6 flex items-center justify-center">
              <div className="h-full w-full rounded-2xl bg-slate-100 animate-pulse" />
            </div>
          )}
        </div>
      </div>

      {/* thumbs */}
      <div className="mt-4 grid grid-cols-4 gap-3">
        {(safeImages.length ? safeImages : Array.from({ length: 4 })).map((src, idx) => {
          const selected = idx === active;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActive(idx)}
              className={[
                "relative aspect-[4/3] overflow-hidden rounded-xl border bg-white shadow-sm",
                selected ? "border-sky-500 ring-4 ring-sky-100" : "border-slate-200",
              ].join(" ")}
            >
              {typeof src === "string" ? (
                <img
                  src={src}
                  alt={`thumb-${idx}`}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              ) : (
                <div className="h-full w-full bg-slate-100 animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
