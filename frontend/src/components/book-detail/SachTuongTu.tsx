import SimilarBookCard from "./CardSachTT";
import type { SimilarBookUI } from "./types";

export default function SachTuongTu({ books }: { books?: SimilarBookUI[] }) {
  const list = books ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-900">Sách tương tự</h2>
        {/* UI-only */}
        <button type="button" className="text-sky-600 font-bold hover:text-sky-700">
          Xem tất cả →
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {(list.length ? list : Array.from({ length: 5 })).map((b, idx) => (
          <SimilarBookCard key={idx} book={typeof b === "object" ? (b as SimilarBookUI) : undefined} />
        ))}
      </div>
    </div>
  );
}
