import { useEffect, useMemo, useState } from "react";
import {
  changeBookStatus,
  deleteBook,
  getAdminBooks,
  getBookDetail,
} from "../../api/admin.books";

type Book = {
  book_id: number;
  title: string;
  user_id?: number;
  author?: string;
  publisher?: string;
  price?: number;
  stock?: number;
  category?: string;
  description?: string;
  image_url?: string[]; // backend trả array theo ảnh bạn gửi
  status?: string | null; // có thể null
  created_at?: string;
};

export default function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const LIMIT = 10;

  // modal detail
  const [openDetail, setOpenDetail] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detail, setDetail] = useState<Book | null>(null);

  const hasPagination = useMemo(() => totalPage > 1, [totalPage]);

  const fetchBooks = async (p = page) => {
    setLoading(true);
    try {
      const res = await getAdminBooks(p, LIMIT, q);

      // backend bạn hiện thấy trả: { data: [...] }
      const list: Book[] = res.data?.data || [];

      setBooks(list);

      // nếu backend có pagination kiểu users: res.data.pagination
   const pg = res.data?.pagination;

if (pg?.totalPage) {
  setPage(pg.currentPage || p);
  setTotalPage(pg.totalPage || 1);
} else {
  setPage(p);
  setTotalPage(1);
}
    } catch (e) {
      alert("Không thể tải danh sách sách!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks(1);
  };

  const openDetailModal = async (id: number) => {
    setOpenDetail(true);
    setDetail(null);
    setDetailLoading(true);
    try {
      const res = await getBookDetail(id);
      // tùy backend: { data: {...} } hoặc { book: {...} }
      const d = res.data?.data || res.data?.book || res.data;
      setDetail(d);
    } catch (e) {
      alert("Không thể tải chi tiết sách!");
      setOpenDetail(false);
    } finally {
      setDetailLoading(false);
    }
  };

const handleChangeStatus = async (b: Book) => {
  if (!confirm(`Đổi trạng thái sách ID=${b.book_id}?`)) return;

  // ✅ toggle status
  const nextStatus =
    (b.status ?? "active") === "active" ? "inactive" : "active";

  try {
    await changeBookStatus(b.book_id, nextStatus);
    fetchBooks(page);
  } catch (e) {
    alert("Đổi trạng thái thất bại!");
  }
};


  const handleDelete = async (id: number) => {
    if (!confirm(`Xóa sách ID=${id}?`)) return;
    try {
      await deleteBook(id);
      fetchBooks(page);
    } catch (e) {
      alert("Xóa thất bại!");
    }
  };

  const renderStatus = (status: string | null | undefined) => {
    const s = (status ?? "active").toString().toLowerCase();
    const isActive = s === "active" || s === "approved" || s === "published";
    return (
      <span
        className={`inline-flex min-w-[80px] justify-center rounded-full px-3 py-1 text-xs font-semibold ${
          isActive ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
        }`}
      >
        {(status ?? "active").toString().toUpperCase()}
      </span>
    );
  };

  const firstImage = (b: Book) => {
    const img = b.image_url?.[0];
    if (!img) return null;
    // backend trả "/images/books/....png" → ghép host
    return `http://localhost:3000${img}`;
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý sách</h1>
          <p className="text-sm text-gray-500">
            Danh sách sách trong hệ thống (Admin)
          </p>
        </div>

        <form onSubmit={onSearch} className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm theo tên sách..."
            className="w-72 rounded-lg border px-3 py-2 text-sm"
          />
          <button className="rounded-lg bg-[#3470FD] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
            Tìm
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow">
        <table className="w-full table-fixed text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="w-20 p-4 text-left font-medium">ID</th>
              <th className="w-[70px] p-4 text-left font-medium">Ảnh</th>
              <th className="w-[360px] p-4 text-left font-medium">Tên sách</th>
              <th className="w-[200px] p-4 text-left font-medium">Tác giả</th>
              <th className="w-28 p-4 text-center font-medium">Tồn</th>
              <th className="w-32 p-4 text-center font-medium">Trạng thái</th>
              <th className="w-60 p-4 text-center font-medium">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : books.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              books.map((b) => (
                <tr key={b.book_id} className="border-t hover:bg-gray-50">
                  <td className="p-4 align-middle">{b.book_id}</td>

                  <td className="p-4 align-middle">
                    {firstImage(b) ? (
                      <img
                        src={firstImage(b)!}
                        alt="book"
                        className="h-10 w-10 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-gray-100" />
                    )}
                  </td>

                  <td className="p-4 align-middle">
                    <div className="truncate font-medium">{b.title}</div>
                    <div className="truncate text-xs text-gray-500">
                      UserID: {b.user_id ?? "-"} • Category: {b.category ?? "-"}
                    </div>
                  </td>

                  <td className="p-4 align-middle truncate">{b.author || "-"}</td>

                  <td className="p-4 text-center align-middle">
                    {typeof b.stock === "number" ? b.stock : "-"}
                  </td>

                  <td className="p-4 text-center align-middle">
                    {renderStatus(b.status)}
                  </td>

                  <td className="p-4 text-center align-middle">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openDetailModal(b.book_id)}
                        className="rounded-lg border px-4 py-1.5 text-sm hover:bg-gray-100"
                      >
                        Xem
                      </button>

                      <button
                        onClick={() => handleChangeStatus(b)}
                        className="rounded-lg border px-4 py-1.5 text-sm hover:bg-gray-100"
                      >
                        Đổi trạng thái
                      </button>

                      <button
                        onClick={() => handleDelete(b.book_id)}
                        className="rounded-lg bg-red-600 px-4 py-1.5 text-sm text-white hover:bg-red-500"
                      >
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-end gap-3 text-sm">
        <button
          disabled={page <= 1 || !hasPagination}
          onClick={() => fetchBooks(page - 1)}
          className="rounded-lg border px-3 py-1.5 disabled:opacity-50"
        >
          Trước
        </button>

        <span>
          {page} / {totalPage}
        </span>

        <button
          disabled={page >= totalPage || !hasPagination}
          onClick={() => fetchBooks(page + 1)}
          className="rounded-lg border px-3 py-1.5 disabled:opacity-50"
        >
          Sau
        </button>
      </div>

      {/* Detail Modal */}
      {openDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow">
            <div className="flex items-center justify-between border-b p-4">
              <div className="font-semibold">Chi tiết sách</div>
              <button
                onClick={() => setOpenDetail(false)}
                className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-100"
              >
                Đóng
              </button>
            </div>

            <div className="p-4">
              {detailLoading ? (
                <div className="py-10 text-center text-gray-500">Đang tải...</div>
              ) : !detail ? (
                <div className="py-10 text-center text-gray-500">
                  Không có dữ liệu
                </div>
              ) : (
                <div className="flex gap-4">
                  <div className="w-32 shrink-0">
                    {detail.image_url?.[0] ? (
                      <img
                        src={`http://localhost:3000${detail.image_url[0]}`}
                        alt="book"
                        className="h-32 w-32 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-lg bg-gray-100" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="text-lg font-semibold">{detail.title}</div>
                    <div className="mt-1 text-sm text-gray-600">
                      Tác giả: {detail.author || "-"} • NXB: {detail.publisher || "-"}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {renderStatus(detail.status)}
                      <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                        Stock: {detail.stock ?? "-"}
                      </span>
                      <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                        Price: {detail.price ?? "-"}
                      </span>
                    </div>

                    <div className="mt-3 text-sm text-gray-700">
                      <div className="font-semibold">Mô tả</div>
                      <div className="mt-1 line-clamp-4">
                        {detail.description || "-"}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t p-4 text-right">
              <button
                onClick={() => setOpenDetail(false)}
                className="rounded-lg bg-[#3470FD] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
