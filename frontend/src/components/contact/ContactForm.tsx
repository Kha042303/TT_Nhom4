import { ChevronDown, Mail, Send, User } from "lucide-react";

export default function ContactForm({
  topics,
}: {
  topics: string[]; // UI-only: sau này BE trả về topics thì truyền vào đây
}) {
  return (
    <div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-sky-100 flex items-center justify-center">
            <Send className="text-sky-600" size={18} />
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
            Gửi tin nhắn cho chúng tôi
          </h2>
        </div>

        {/* UI-only: không xử lý submit */}
        <form className="mt-6 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Họ và tên"
              placeholder="Nguyễn Văn A"
              leftIcon={<User size={18} className="text-slate-400" />}
            />
            <Field
              label="Email"
              placeholder="email@example.com"
              leftIcon={<Mail size={18} className="text-slate-400" />}
              type="email"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Chủ đề
            </label>
            <div className="relative mt-2">
              <select
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-11 py-3 text-slate-700 shadow-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
                defaultValue={topics?.[0] ?? ""}
              >
                {(topics ?? []).map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center">
                  <Send size={16} className="text-slate-400" />
                </div>
              </div>

              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                <ChevronDown size={18} className="text-slate-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">
              Nội dung tin nhắn
            </label>
            <textarea
              rows={6}
              placeholder="Nhập nội dung bạn cần hỗ trợ hoặc góp ý..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-700 shadow-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <button
            type="button"
            className="w-full rounded-xl bg-sky-500 px-6 py-3 font-bold text-white shadow hover:bg-sky-600 active:bg-sky-700"
          >
            Gửi Tin Nhắn <span aria-hidden className="ml-1">➜</span>
          </button>

          <p className="text-xs text-slate-500">
            * Đây là giao diện. Khi nối API, bạn sẽ map dữ liệu & xử lý gửi form
            ở bước sau.
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  leftIcon,
  type = "text",
}: {
  label: string;
  placeholder: string;
  leftIcon: React.ReactNode;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <div className="relative mt-2">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <div className="h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center">
            {leftIcon}
          </div>
        </div>
        <input
          type={type}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-white px-11 py-3 text-slate-700 shadow-sm outline-none focus:border-sky-300 focus:ring-4 focus:ring-sky-100"
        />
      </div>
    </div>
  );
}
