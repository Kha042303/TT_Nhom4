import { useEffect, useMemo, useState } from "react";
import {
  getAdminPosts,
  getPostDetail,
  changePostStatus,
  deletePost,
} from "../../api/admin.posts";

type Post = {
  post_id: number;
  title: string;
  content?: string;
  status?: string | null;
  user_id?: number;
  images?: string[];
};

const HOST = "http://localhost:3000";

export default function AdminPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const LIMIT = 8;

  const [openDetail, setOpenDetail] = useState(false);
  const [detail, setDetail] = useState<Post | null>(null);

  const hasPagination = useMemo(() => totalPage > 1, [totalPage]);

  const fetchPosts = async (p = page) => {
    setLoading(true);
    try {
      const res = await getAdminPosts(p, LIMIT, keyword);
      setPosts(res.data?.data || []);

      const pg = res.data?.pagination;
      if (pg?.totalPage) {
        setPage(pg.currentPage);
        setTotalPage(pg.totalPage);
      } else {
        setPage(p);
        setTotalPage(1);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
    // eslint-disable-next-line
  }, []);

  const renderStatus = (status?: string | null) => {
    const active = status === "visible";
    return (
      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          active
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {active ? "VISIBLE" : "HIDDEN"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý bài viết</h1>
          <p className="text-sm text-gray-500">
            Admin quản lý toàn bộ bài viết trong hệ thống
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchPosts(1);
          }}
          className="flex gap-2"
        >
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm theo tiêu đề..."
            className="w-72 rounded-lg border px-3 py-2 text-sm"
          />
          <button className="rounded-lg bg-[#3470FD] px-4 py-2 text-sm text-white">
            Tìm
          </button>
        </form>
      </div>

      {/* ===== TABLE ===== */}
      <div className="rounded-xl bg-white shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left w-20">ID</th>
              <th className="p-4 text-left w-24">Ảnh</th>
              <th className="p-4 text-left">Tiêu đề</th>
              <th className="p-4 text-center">Trạng thái</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              posts.map((p) => (
                <tr key={p.post_id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{p.post_id}</td>

                  {/* IMAGE */}
                  <td className="p-4">
                    {p.images?.[0] ? (
                      <img
                        src={`${HOST}${p.images[0]}`}
                        className="h-10 w-10 rounded-md object-cover"
                        alt="post"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-gray-100" />
                    )}
                  </td>

                  <td className="p-4">
                    <div className="font-medium truncate max-w-[420px]">
                      {p.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      User ID: {p.user_id}
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    {renderStatus(p.status)}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={async () => {
                          const res = await getPostDetail(p.post_id);
                          setDetail(res.data.data);
                          setOpenDetail(true);
                        }}
                        className="rounded-lg border px-3 py-1.5 text-sm"
                      >
                        Xem
                      </button>

                      <button
                        onClick={() =>
                          changePostStatus(
                            p.post_id,
                            p.status === "visible"
                              ? "hidden"
                              : "visible"
                          ).then(() => fetchPosts(page))
                        }
                        className="rounded-lg border px-3 py-1.5 text-sm"
                      >
                        Đổi trạng thái
                      </button>

                      <button
                        onClick={() =>
                          confirm("Xóa bài viết?")
                          && deletePost(p.post_id).then(() => fetchPosts(page))
                        }
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white"
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

      {/* ===== PAGINATION ===== */}
      <div className="flex justify-end gap-3 text-sm">
        <button
          disabled={page <= 1 || !hasPagination}
          onClick={() => fetchPosts(page - 1)}
          className="rounded-lg border px-3 py-1.5 disabled:opacity-50"
        >
          Trước
        </button>

        <span>
          {page} / {totalPage}
        </span>

        <button
          disabled={page >= totalPage || !hasPagination}
          onClick={() => fetchPosts(page + 1)}
          className="rounded-lg border px-3 py-1.5 disabled:opacity-50"
        >
          Sau
        </button>
      </div>

      {/* ===== DETAIL MODAL ===== */}
      {openDetail && detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-xl rounded-xl bg-white shadow">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="font-semibold">Chi tiết bài viết</h3>
              <button onClick={() => setOpenDetail(false)}>✕</button>
            </div>

            <div className="p-4 space-y-3">
              {detail.images?.[0] && (
                <img
                  src={`${HOST}${detail.images[0]}`}
                  className="h-48 w-full rounded-lg object-cover"
                  alt="post"
                />
              )}

              <div className="text-lg font-semibold">{detail.title}</div>
              {renderStatus(detail.status)}
              <div className="whitespace-pre-wrap text-sm text-gray-700">
                {detail.content || "-"}
              </div>
            </div>

            <div className="border-t p-4 text-right">
              <button
                onClick={() => setOpenDetail(false)}
                className="rounded-lg bg-[#3470FD] px-4 py-2 text-sm text-white"
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
