import { MessageCircle, ThumbsUp } from "lucide-react";
import type { FindRequestUI } from "./types";

export default function ItemFindBook({ request }: { request?: FindRequestUI }) {
  const status = request?.status_badge;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-slate-100 border border-slate-200" />
            <div>
              <div className="font-extrabold text-slate-900">
                {/* UI-only: tên user lấy từ API sau */}
                Nguyen Van Sach
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {request?.created_at_text ?? (
                  <span className="inline-block h-3 w-24 rounded bg-slate-100 animate-pulse" />
                )}
              </div>
            </div>
          </div>

          <span
            className={[
              "rounded-full px-3 py-1 text-xs font-extrabold",
              status === "Đã Tìm Thấy"
                ? "bg-slate-100 text-slate-700"
                : "bg-orange-50 text-orange-700",
            ].join(" ")}
          >
            {status ?? "Đang Tìm Kiếm"}
          </span>
        </div>

        <div className="mt-4 text-lg font-extrabold text-slate-900">
          {request?.title ?? (
            <span className="inline-block h-5 w-3/4 rounded bg-slate-100 animate-pulse" />
          )}
        </div>

        <div className="mt-2 text-slate-600 leading-relaxed">
          {request?.content ? (
            <p>{request.content}</p>
          ) : (
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
              <div className="h-4 w-11/12 rounded bg-slate-100 animate-pulse" />
              <div className="h-4 w-9/12 rounded bg-slate-100 animate-pulse" />
            </div>
          )}
        </div>

        <div className="mt-4 h-px bg-slate-200" />

        <div className="mt-3 flex items-center gap-6 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2">
            <ThumbsUp size={16} className="text-slate-400" />
            {typeof request?.likes === "number" ? request.likes : "—"} Thích
          </span>
          <span className="inline-flex items-center gap-2">
            <MessageCircle size={16} className="text-slate-400" />
            {typeof request?.comments === "number" ? request.comments : "—"} Bình luận
          </span>
        </div>
      </div>
    </div>
  );
}
