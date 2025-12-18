import { useEffect, useState } from "react";
import { getAdminReports, getReportDetail, updateReportNote } from "../../api/admin.reports";

type Report = {
  report_id: number;
  user_id: number;
  report_type: "post" | "user" | "book" | "chat";
  target_id: number;          
  content?: string | null;
  notes?: string | null;
  generated_at: string;
};

export default function AdminReports() {
  const [list, setList] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<Report | null>(null);
  const [note, setNote] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await getAdminReports({ page: 1, limit: 50 });
      setList(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const openDetail = async (id: number) => {
    const res = await getReportDetail(id);
    const d = res.data?.data;
    setDetail(d);
    setNote(d?.notes || "");
    setOpen(true);
  };

  const saveNote = async () => {
    if (!detail) return;
    await updateReportNote(detail.report_id, note);
    setOpen(false);
    fetchReports();
  };

  const renderType = (type: string) => {
    const map: any = { post: "Bài viết", user: "Người dùng", book: "Sách", chat: "Chat" };
    return map[type] || type;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý report</h1>
        <p className="text-sm text-gray-500">Admin xử lý các báo cáo từ người dùng</p>
      </div>

      <div className="rounded-xl bg-white shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Người gửi</th>
              <th className="p-4 text-left">Loại</th>
              <th className="p-4 text-left">target_id</th>
              <th className="p-4 text-left">Nội dung</th>
              <th className="p-4 text-center">Thời gian</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-8 text-center text-gray-500">Đang tải...</td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={7} className="p-8 text-center text-gray-500">Không có report</td></tr>
            ) : (
              list.map((r) => (
                <tr key={r.report_id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{r.report_id}</td>
                  <td className="p-4">User #{r.user_id}</td>
                  <td className="p-4 font-medium">{renderType(r.report_type)}</td>
                  <td className="p-4">{r.target_id}</td>
                  <td className="p-4 truncate max-w-[320px]">{r.content || "-"}</td>
                  <td className="p-4 text-center">{new Date(r.generated_at).toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => openDetail(r.report_id)}
                      className="rounded-lg border px-3 py-1.5 text-sm"
                    >
                      Xem
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {open && detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-xl rounded-xl bg-white shadow">
            <div className="flex justify-between border-b p-4">
              <h3 className="font-semibold">Report #{detail.report_id}</h3>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="p-4 space-y-3 text-sm">
              <div><b>Người gửi:</b> User #{detail.user_id}</div>
              <div><b>Loại:</b> {renderType(detail.report_type)}</div>
              <div><b>target_id:</b> {detail.target_id}</div>

              <div>
                <b>Nội dung report:</b>
                <div className="mt-1 rounded bg-gray-50 p-2">{detail.content || "-"}</div>
              </div>

              <div>
                <b>Ghi chú admin</b>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="mt-1 w-full rounded border p-2"
                  rows={3}
                  placeholder="Đã xử lý / Cảnh cáo / Bỏ qua..."
                />
              </div>
            </div>

            <div className="border-t p-4 text-right">
              <button
                onClick={saveNote}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
              >
                Lưu ghi chú
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
