// src/components/book-detail/SachTuongTuContainer.tsx
import { useEffect, useState } from "react";
import { listBooksApi, pickBookImages } from "../../api/book.api";
import SachTuongTu from "./SachTuongTu";
import type { SimilarBookUI } from "./types"; // Import cùng 1 file types.ts để khớp kiểu

type Props = {
  currentBookId: number;
  category?: string;
};

export default function SachTuongTuContainer({ currentBookId, category }: Props) {
  // QUAN TRỌNG: Phải khai báo <SimilarBookUI[]> để TypeScript hiểu đây là mảng các object sách
  const [books, setBooks] = useState<SimilarBookUI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category || category === "Tất Cả") {
      setLoading(false);
      return;
    }

    const fetchSimilarBooks = async () => {
      try {
        setLoading(true);
        const { books: rawBooks } = await listBooksApi({
          category: category,
          limit: 6,
          status: "active",
        });

        // Lọc bỏ cuốn hiện tại
        const filteredList = rawBooks.filter((b) => Number(b.book_id) !== Number(currentBookId));

        // Map dữ liệu
        const uiList: SimilarBookUI[] = filteredList.slice(0, 5).map((b) => ({
          id: b.book_id,
          title: b.title,
          author: b.author,
          price: b.price,
          cover: pickBookImages(b)[0] || "https://placehold.co/150",
          condition: "Tốt",
          location: "Toàn quốc",
        }));

        setBooks(uiList);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarBooks();
  }, [category, currentBookId]);

  // Nếu loading xong mà không có sách thì ẩn
  if (!loading && books.length === 0) {
    return null;
  }

  // Truyền props xuống:
  // Nếu đang loading thì truyền mảng rỗng (để hiện skeleton)
  // Nếu đã xong thì truyền mảng books thật
  return <SachTuongTu books={loading ? [] : books} />;
}