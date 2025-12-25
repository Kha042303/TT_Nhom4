import type { BookMeta } from "./types";

function MetaItem({ label, value }: { label: string; value?: string | number }) {
  const display =
    value === 0 || value
      ? String(value)
      : null;

  return (
    <div>
      <div className="text-xs font-bold text-slate-500">{label}</div>
      <div className="mt-1 font-semibold text-slate-900">
        {display ?? (
          <span className="inline-block h-5 w-44 bg-slate-100 animate-pulse rounded-md" />
        )}
      </div>
    </div>
  );
}

export default function ThongTinSach({ meta }: { meta?: BookMeta }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-2 gap-4">
        <MetaItem label="Nhà xuất bản" value={meta?.publisher} />
        <MetaItem label="Năm xuất bản" value={meta?.year} />
        <MetaItem label="Ngôn ngữ" value={meta?.language} />
      </div>
    </div>
  );
}
