import type { SimilarBookUI } from "./types";

function formatVND(n?: number) {
  if (typeof n !== "number") return undefined;
  return new Intl.NumberFormat("vi-VN").format(n) + " đ";
}

export default function CardSachTT({ book }: { book?: SimilarBookUI }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow transition">
      <div className="aspect-[4/3] bg-slate-100">
        {book?.cover ? (
          <img src={book.cover} alt={book.title ?? "book"} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full animate-pulse bg-slate-100" />
        )}
      </div>

      <div className="p-3">
        <div className="font-extrabold text-slate-900 line-clamp-2">
          {book?.title ?? <span className="inline-block h-4 w-full bg-slate-100 animate-pulse rounded" />}
        </div>
        <div className="mt-1 text-sm text-slate-500 line-clamp-1">
          {book?.author ?? <span className="inline-block h-4 w-2/3 bg-slate-100 animate-pulse rounded" />}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <div className="font-extrabold text-slate-900">
            {formatVND(book?.price) ?? <span className="inline-block h-4 w-16 bg-slate-100 animate-pulse rounded" />}
          </div>
          <span className="text-xs text-slate-500">
            {book?.condition ?? ""}
          </span>
        </div>
      </div>
    </div>
  );
}
