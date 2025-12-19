import { ImagePlus, Send, X } from "lucide-react";

export default function ReportIssueForm() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="p-6 md:p-8">
        <h2 className="text-xl font-extrabold text-slate-900">Biểu mẫu báo cáo</h2>
        <div className="mt-4 h-px w-full bg-slate-200" />

        <form className="mt-6 space-y-6">
          {/* Report type */}
          <div>
            <div className="text-sm font-bold text-slate-800">
              Bạn đang gặp vấn đề gì?
            </div>

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <RadioCard name="type" value="tech" defaultChecked>
                Lỗi kỹ thuật
              </RadioCard>
              <RadioCard name="type" value="bad_content">
                Nội dung xấu
              </RadioCard>
              <RadioCard name="type" value="account">
                Tài khoản
              </RadioCard>
              <RadioCard name="type" value="other">
                Khác
              </RadioCard>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-sm font-bold text-slate-800">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Tóm tắt ngắn gọn vấn đề..."
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-bold text-slate-800">
              Mô tả chi tiết <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              placeholder="Vui lòng mô tả chi tiết vấn đề, các bước để tái hiện lỗi (nếu có)..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-bold text-slate-800">
              Email của bạn <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            />
            <div className="mt-2 text-xs text-slate-500">
              Chúng tôi sẽ phản hồi qua email này.
            </div>
          </div>

          {/* Upload */}
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

              {/* UI-only: không xử lý onChange */}
              <input id="report-file" type="file" className="hidden" />
            </label>
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-bold text-slate-700 hover:bg-slate-50"
            >
              <X size={18} />
              Hủy bỏ
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 font-bold text-white shadow hover:bg-sky-600"
            >
              <Send size={18} />
              Gửi báo cáo
            </button>
          </div>

          <p className="text-xs text-slate-500">
            * Đây là giao diện. Khi nối API, bạn sẽ xử lý submit & upload ở bước sau.
          </p>
        </form>
      </div>
    </div>
  );
}

function RadioCard({
  name,
  value,
  children,
  defaultChecked,
}: {
  name: string;
  value: string;
  children: React.ReactNode;
  defaultChecked?: boolean;
}) {
  return (
    <label className="group cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm transition peer-checked:border-sky-400 peer-checked:bg-sky-50">
        <div className="h-4 w-4 rounded-full border border-slate-300 bg-white peer-checked:border-sky-500 peer-checked:bg-sky-500" />
        <div className="font-semibold text-slate-800">{children}</div>
      </div>
    </label>
  );
}
