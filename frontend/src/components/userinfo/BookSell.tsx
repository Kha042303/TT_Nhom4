import { Store } from "lucide-react";
import BookMiniCard from "./ItemBookSell";
import type { SellingBookUI } from "./types";

export default function BookSell({
  books,
  totalCount,
}: {
  books?: SellingBookUI[];
  totalCount?: number;
}) {
  const list = books ?? [];

  return (
    <section>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Store className="text-emerald-600" size={20} />
          <h2 className="text-2xl font-extrabold text-slate-900">
            Sách đang bán
          </h2>
          <span className="ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-sm font-extrabold text-slate-700">
            {typeof totalCount === "number" ? totalCount : "—"}
          </span>
        </div>

        <button type="button" className="text-sky-600 font-bold hover:text-sky-700">
          Xem tất cả
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(list.length ? list : Array.from({ length: 3 })).map((b, idx) => (
          <BookMiniCard
            key={idx}
            book={typeof b === "object" ? (b as SellingBookUI) : undefined}
          />
        ))}
      </div>
    </section>
  );
}
