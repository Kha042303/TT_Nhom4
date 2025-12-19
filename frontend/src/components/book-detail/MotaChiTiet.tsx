export default function MotaChiTiet() {
  // UI-only: không state tab, không handler
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="px-6 pt-4">
        <div className="flex flex-wrap gap-6 border-b border-slate-200">
          <button type="button" className="pb-3 font-extrabold text-sky-600 border-b-2 border-sky-600">
            Mô tả chi tiết
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Placeholder content (UI-only) */}
        <div className="space-y-3 text-slate-600 leading-relaxed">
          <div className="h-4 w-full bg-slate-100 animate-pulse rounded" />
          <div className="h-4 w-11/12 bg-slate-100 animate-pulse rounded" />
          <div className="h-4 w-10/12 bg-slate-100 animate-pulse rounded" />
          <div className="h-4 w-9/12 bg-slate-100 animate-pulse rounded" />
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-extrabold text-slate-900">Lưu ý từ người bán:</div>
          <div className="mt-2 text-slate-600">
            <span className="inline-block h-4 w-10/12 bg-slate-100 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
