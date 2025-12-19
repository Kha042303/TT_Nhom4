import { Heart } from "lucide-react";
import type { SellingBookUI } from "./types";

function formatVND(n?: number) {
  if (typeof n !== "number") return undefined;
  return new Intl.NumberFormat("vi-VN").format(n) + "đ";
}

export default function ItemBookSell({ book }: { book?: SellingBookUI }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="relative">
        {/* condition badge */}
        <div className="absolute right-3 top-3 z-10">
          {book?.condition_badge ? (
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-extrabold text-white">
              {book.condition_badge}
            </span>
          ) : (
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-extrabold text-slate-700">
              —
            </span>
          )}
        </div>

        {/* image */}
        <div className="aspect-[4/3] bg-slate-100">
          {book?.cover_url ? (
            <img
              src={book.cover_url}
              alt={book.title ?? "book"}
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            <div className="h-full w-full bg-slate-100 animate-pulse" />
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="font-extrabold text-slate-900 line-clamp-2">
          {book?.title ?? (
            <span className="inline-block h-4 w-full rounded bg-slate-100 animate-pulse" />
          )}
        </div>

        <div className="mt-1 text-sm text-slate-500">
          {book?.author ?? (
            <span className="inline-block h-4 w-2/3 rounded bg-slate-100 animate-pulse" />
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-lg font-extrabold text-sky-600">
            {formatVND(book?.price) ?? (
              <span className="inline-block h-5 w-20 rounded bg-slate-100 animate-pulse" />
            )}
          </div>

          <button
            type="button"
            className="h-10 w-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center"
          >
            <Heart size={18} className="text-slate-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
