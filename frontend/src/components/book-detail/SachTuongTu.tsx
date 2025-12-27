// src/components/book-detail/SachTuongTu.tsx
import SimilarBookCard from "./CardSachTT";
import type { SimilarBookUI } from "./types"; // Import từ file types.ts

// Định nghĩa Props: books là mảng SimilarBookUI, mặc định là mảng rỗng nếu không truyền
type Props = {
  books?: SimilarBookUI[];
};

export default function SachTuongTu({ books = [] }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-900">Sách tương tự</h2>
        <button type="button" className="text-sky-600 font-bold hover:text-sky-700">
          Xem tất cả →
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {books.length > 0 ? (
          books.map((b, idx) => (
            <SimilarBookCard 
              key={idx} 
              book={b} // Truyền đúng object b vào
            />
          ))
        ) : (
          // Hiển thị khung xương (Skeleton) khi đang tải hoặc không có sách
          Array.from({ length: 5 }).map((_, idx) => (
            <SimilarBookCard key={idx} book={undefined} />
          ))
        )}
      </div>
    </div>
  );
}