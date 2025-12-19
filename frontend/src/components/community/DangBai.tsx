import { Image as ImageIcon, Hash, Send } from "lucide-react";

export default function DangBai() {
  // UI-only: không xử lý nhập / submit
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="p-4 flex gap-3">
        <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200" />
        <div className="flex-1">
          <textarea
            rows={3}
            placeholder="Bạn đang tìm cuốn sách nào? Mô tả chi tiết nhé..."
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
          />
        </div>
      </div>

      <div className="border-t border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm font-semibold text-slate-600">
          <button
            type="button"
            className="inline-flex items-center gap-2 hover:text-slate-900"
          >
            <ImageIcon size={18} className="text-emerald-600" />
            Ảnh
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 hover:text-slate-900"
          >
            <Hash size={18} className="text-amber-600" />
            Gắn thẻ
          </button>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-sky-600 px-5 py-2.5 font-extrabold text-white shadow hover:bg-sky-700"
        >
          <Send size={18} />
          Đăng bài
        </button>
      </div>
    </div>
  );
}
