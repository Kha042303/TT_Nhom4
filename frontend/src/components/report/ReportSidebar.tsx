import { HelpCircle, Mail } from "lucide-react";

export default function SupportSidebar() {
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-slate-900">Gặp Vấn Đề?</h1>
      <p className="mt-3 text-slate-600 leading-relaxed">
        Chúng tôi rất tiếc nếu bạn có trải nghiệm không mong muốn. Hãy cho chúng
        tôi biết chi tiết vấn đề để chúng tôi có thể hỗ trợ bạn nhanh nhất.
      </p>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="font-extrabold text-slate-900">Kênh hỗ trợ khác</div>

        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center">
              <Mail className="text-sky-600" size={18} />
            </div>
            <div>
              <div className="font-semibold text-slate-800">Email</div>
              <div className="text-sky-600 font-semibold">hotro@sachcutraodoi.vn</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center">
              <HelpCircle className="text-sky-600" size={18} />
            </div>
            <div>
              <div className="font-semibold text-slate-800">Câu hỏi thường gặp</div>
              {/* UI-only: sau này bạn đổi thành Link route FAQ */}
              <button
                type="button"
                className="text-sky-600 font-semibold hover:text-sky-700"
              >
                Xem FAQ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
