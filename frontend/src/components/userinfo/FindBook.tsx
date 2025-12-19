import { Megaphone } from "lucide-react";
import FindRequestCard from "./ItemFindBook";
import type { FindRequestUI } from "./types";

export default function FindBook({
  requests,
  totalCount,
}: {
  requests?: FindRequestUI[];
  totalCount?: number;
}) {
  const list = requests ?? [];

  return (
    <section>
      <div className="flex items-center gap-2">
        <Megaphone className="text-sky-600" size={20} />
        <h2 className="text-2xl font-extrabold text-slate-900">
          Yêu cầu tìm sách
        </h2>
        <span className="ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-sm font-extrabold text-slate-700">
          {typeof totalCount === "number" ? totalCount : "—"}
        </span>
      </div>

      <div className="mt-4 space-y-4">
        {(list.length ? list : Array.from({ length: 2 })).map((r, idx) => (
          <FindRequestCard
            key={idx}
            request={typeof r === "object" ? (r as FindRequestUI) : undefined}
          />
        ))}
      </div>
    </section>
  );
}
