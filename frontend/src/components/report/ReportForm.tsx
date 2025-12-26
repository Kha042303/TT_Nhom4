import React, { useMemo, useState, useEffect } from "react";
import { ImagePlus, Loader2, Send, X } from "lucide-react";
import { toast } from "sonner";
import { createReportApi, type ReportType } from "../../api/report.api";

// Cập nhật Props để nhận dữ liệu từ URL
interface ReportFormProps {
  defaultEmail?: string;
  initialType?: string | null;
  initialId?: string | null;
}

export default function ReportIssueForm({
  defaultEmail,
  initialType,
  initialId,
}: ReportFormProps) {
  const [reportType, setReportType] = useState<ReportType>("post");
  const [targetId, setTargetId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [email, setEmail] = useState(defaultEmail || "");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // LOGIC MỚI: Tự động điền khi có props truyền vào
  useEffect(() => {
    const validTypes: ReportType[] = ["post", "user", "book", "chat"];
    
    // Nếu URL có type hợp lệ thì set
    if (initialType && validTypes.includes(initialType as ReportType)) {
      setReportType(initialType as ReportType);
    }

    // Nếu URL có ID thì set
    if (initialId) {
      setTargetId(initialId);
    }
  }, [initialType, initialId]);

  const token = useMemo(() => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token") ||
      ""
    );
  }, []);

  const reset = () => {
    setReportType("post");
    setTargetId("");
    setTitle("");
    setDetail("");
    setFile(null);
    // giữ email để user khỏi nhập lại
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Vui lòng đăng nhập để gửi báo cáo.");
      return;
    }

    const tid = parseInt(targetId, 10);
    if (!Number.isFinite(tid) || tid <= 0) {
      toast.error("Target ID phải là số > 0.");
      return;
    }

    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề.");
      return;
    }

    if (!detail.trim()) {
      toast.error("Vui lòng nhập mô tả chi tiết.");
      return;
    }

    // notes: gộp mô tả + email + file meta (BE hiện chưa hỗ trợ upload ảnh report)
    const notes = [
      detail.trim(),
      email.trim() ? `Email: ${email.trim()}` : null,
      file ? `Attachment: ${file.name} (${Math.round(file.size / 1024)}KB)` : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    setSubmitting(true);
    try {
      const rs = await createReportApi({
        report_type: reportType,
        target_id: tid,
        content: title.trim(),
        notes,
      });

      if (rs?.code !== 200) {
        toast.error(rs?.message || "Gửi báo cáo thất bại");
        return;
      }

      toast.success("Đã gửi báo cáo thành công!");
      reset();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Lỗi");
    } finally {
      setSubmitting(false);
    }
  };

  // Biến kiểm tra xem có phải đang điền tự động không (để hiện style khác biệt)
  const isAutoFilled = !!initialId;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="p-6 md:p-8">
        <h2 className="text-xl font-extrabold text-slate-900">Biểu mẫu báo cáo</h2>
        <div className="mt-4 h-px w-full bg-slate-200" />

        <form onSubmit={onSubmit} className="mt-6 space-y-6">
          {/* Report type */}
          <div>
            <div className="text-sm font-bold text-slate-800">
              Bạn muốn báo cáo đối tượng nào?
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <RadioCard
                name="report_type"
                value="post"
                checked={reportType === "post"}
                onChange={() => setReportType("post")}
              >
                Bài viết (post)
              </RadioCard>

              <RadioCard
                name="report_type"
                value="user"
                checked={reportType === "user"}
                onChange={() => setReportType("user")}
              >
                Người dùng (user)
              </RadioCard>

              <RadioCard
                name="report_type"
                value="book"
                checked={reportType === "book"}
                onChange={() => setReportType("book")}
              >
                Sách (book)
              </RadioCard>

              <RadioCard
                name="report_type"
                value="chat"
                checked={reportType === "chat"}
                onChange={() => setReportType("chat")}
              >
                Tin nhắn (chat)
              </RadioCard>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              * Khớp với BE: report_type chỉ nhận post/user/book/chat.
            </p>
          </div>

          {/* Target ID */}
          <div>
            <label className="text-sm font-bold text-slate-800">
              Target ID <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              inputMode="numeric"
              min={1}
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              placeholder="VD: post_id / user_id / book_id / chat_id"
              // Thêm style bg-slate-100 nếu tự điền
              className={`mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-700 shadow-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100 ${
                isAutoFilled ? "bg-slate-100 font-semibold" : "bg-white"
              }`}
            />
            {isAutoFilled && (
              <p className="mt-1 text-xs text-emerald-600 font-medium">
                * ID đã được điền tự động từ trang trước.
              </p>
            )}
          </div>

          {/* Title -> content */}
          <div>
            <label className="text-sm font-bold text-slate-800">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Tóm tắt ngắn gọn vấn đề..."
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          {/* Description -> notes */}
          <div>
            <label className="text-sm font-bold text-slate-800">
              Mô tả chi tiết <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Vui lòng mô tả chi tiết vấn đề..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          {/* Email (không có trong DB -> gộp vào notes) */}
          <div>
            <label className="text-sm font-bold text-slate-800">
              Email của bạn <span className="text-slate-400">(tuỳ chọn)</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            />
            <div className="mt-2 text-xs text-slate-500">
              Hiện DB chưa có cột email, FE sẽ gộp email vào phần ghi chú (notes).
            </div>
          </div>

          {/* Upload (BE report hiện chưa có upload) */}
          <div>
            <div className="text-sm font-bold text-slate-800">
              Ảnh chụp màn hình <span className="text-slate-400">(Tùy chọn)</span>
            </div>

            <label
              htmlFor="report-file"
              className="mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center hover:bg-slate-100"
            >
              <div className="h-14 w-14 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center">
                <ImagePlus className="text-slate-400" size={22} />
              </div>

              <div className="mt-3 font-semibold text-sky-600">
                Tải ảnh lên{" "}
                <span className="font-semibold text-slate-600">
                  hoặc kéo thả vào đây
                </span>
              </div>

              <div className="mt-1 text-xs text-slate-500">
                PNG, JPG, GIF tối đa 10MB
              </div>

              <input
                id="report-file"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>

            {file ? (
              <div className="mt-2 text-xs text-slate-600">
                Đã chọn: <span className="font-semibold">{file.name}</span>
              </div>
            ) : null}

            <div className="mt-2 text-xs text-slate-500">
              * Backend report hiện chưa có endpoint upload file, nên FE chỉ lưu metadata ảnh vào notes.
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={reset}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              <X size={18} />
              Hủy bỏ
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 font-bold text-white shadow hover:bg-sky-600 disabled:opacity-60"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {submitting ? "Đang gửi..." : "Gửi báo cáo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RadioCard({
  name,
  value,
  children,
  checked,
  onChange,
}: {
  name: string;
  value: string;
  children: React.ReactNode;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="group cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition peer-checked:border-sky-400 peer-checked:bg-sky-50">
        <div className="h-4 w-4 rounded-full border border-slate-300 bg-white peer-checked:border-sky-500 peer-checked:bg-sky-500" />
        <div className="font-semibold text-slate-800">{children}</div>
      </div>
    </label>
  );
}