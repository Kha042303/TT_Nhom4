import { Link } from "react-router-dom";
import type { SimilarBookUI } from "./types"; 

type Props = {
  book?: SimilarBookUI;
};

export default function SimilarBookCard({ book }: Props) {
  // 1. Loading Skeleton
  if (!book) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="aspect-[2/3] w-full rounded-xl bg-slate-200" />
        <div className="space-y-1">
          <div className="h-4 w-3/4 rounded bg-slate-200" />
          <div className="h-3 w-1/2 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-1/3 rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  // 2. Hiển thị
  return (
    <Link 
      // ✅ SỬA ĐÚNG THEO FILE APP.TSX CỦA BẠN
      to={`/book-detail/${book.id}`} 
      
      className="group block space-y-3"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-sm">
        <img
          src={book.cover}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/150?text=No+Image";
          }}
        />
        {book.condition && (
          <div className="absolute bottom-2 right-2 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
            {book.condition}
          </div>
        )}
      </div>

      <div>
        <h3 className="line-clamp-2 text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
          {book.title}
        </h3>
        <div className="mt-1 text-xs text-slate-500 line-clamp-1">
          {book.author || "Tác giả ẩn danh"}
        </div>
        <div className="mt-2 font-bold text-sky-600">
          {typeof book.price === "number" 
            ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(book.price)
            : "Liên hệ"}
        </div>
      </div>
    </Link>
  );
}