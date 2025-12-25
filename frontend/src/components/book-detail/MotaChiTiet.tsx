import { useMemo, useState } from "react";

function stripHtml(s: string) {
  return String(s || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function splitParagraphs(s?: string) {
  const t = (s ?? "").replace(/\r\n/g, "\n").trim();
  if (!t) return [] as string[];
  return t
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}
type TabKey = "desc" | "note";

export default function MotaChiTiet({
  description,
  sellerNote,
  defaultTab = "desc",
}: {
  description?: string;
  sellerNote?: string;
  defaultTab?: TabKey;
  defaultExpanded?: boolean;
  clampLines?: number;
}) {
  const [tab, setTab] = useState<TabKey>(defaultTab);
  const safeDesc = useMemo(() => stripHtml(description ?? ""), [description]);
  const safeNote = useMemo(() => {
    const note = stripHtml(sellerNote ?? "");
    if (note && safeDesc && note === safeDesc) return ""; 
    return note;
  }, [sellerNote, safeDesc]);
  const noteParas = useMemo(() => splitParagraphs(safeNote), [safeNote]);
  const hasNote = !!safeNote;
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="px-6 pt-4">
        <div className="flex flex-wrap gap-6 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setTab("desc")}
            className={[
              "pb-3 font-extrabold",
              tab === "desc"
                ? "text-sky-600 border-b-2 border-sky-600"
                : "text-slate-500 hover:text-slate-700",
            ].join(" ")}
          >
            Mô tả chi tiết
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-sm font-extrabold text-slate-900"></div>
          <div className="mt-2 text-slate-700 leading-relaxed space-y-3">
            {hasNote ? (
              noteParas.map((p, idx) => (
                <p key={idx} className="whitespace-pre-wrap">
                  {p}
                </p>
              ))
            ) : (
              <p className="text-slate-500">Chưa có mô tả.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
