// src/components/community/DangBai.tsx
import { useState } from "react";
import { toast } from "sonner";
import { createPostApi } from "../../api/post.api";

export default function DangBai({
  disabled,
  onCreated,
}: {
  disabled?: boolean;
  onCreated?: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    if (!picked.length) return;

    // gộp vào list hiện tại, tối đa 10 ảnh (khớp BE upload.array("images", 10))
    setFiles((prev) => {
      const merged = [...prev, ...picked];
      return merged.slice(0, 10);
    });

    // reset input để chọn lại cùng file vẫn trigger change
    e.target.value = "";
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }

    setSubmitting(true);
    try {
      const rs = await createPostApi({
        title: title.trim(),
        content: content.trim(),
        images: files, // ✅ mảng File
        status: "visible",
      });

      if (rs?.code && rs.code !== 200 && rs.code !== 201) {
        toast.error(rs?.message || "Đăng bài thất bại");
        return;
      }

      toast.success("Đăng bài thành công");
      setTitle("");
      setContent("");
      setFiles([]);
      onCreated?.();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Lỗi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="text-sm font-extrabold text-slate-900">Đăng bài tìm sách</div>

      <div className="mt-3 space-y-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Tiêu đề..."
          className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-200"
          disabled={disabled || submitting}
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Mô tả nội dung..."
          className="w-full min-h-[96px] rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-sky-200"
          disabled={disabled || submitting}
        />

        <div className="flex items-center justify-between gap-3 flex-wrap">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onPickFiles}
              className="hidden"
              disabled={disabled || submitting}
            />
            Chọn ảnh (tối đa 10)
          </label>

          <button
            type="submit"
            className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-extrabold text-white hover:bg-sky-700 disabled:opacity-50"
            disabled={disabled || submitting}
          >
            {submitting ? "Đang đăng..." : "Đăng bài"}
          </button>
        </div>

        {files.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {files.map((f, idx) => (
              <div
                key={idx}
                className="relative overflow-hidden rounded-xl border border-slate-200"
              >
                <img
                  src={URL.createObjectURL(f)}
                  className="h-24 w-full object-cover"
                  alt={f.name}
                />
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="absolute right-1 top-1 rounded-lg bg-black/60 px-2 py-1 text-xs font-bold text-white"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        )}

        {disabled && (
          <div className="text-xs text-amber-600 font-semibold">
            Vui lòng đăng nhập để đăng bài.
          </div>
        )}
      </div>
    </form>
  );
}
