import { Search } from "lucide-react";
import type { Contact } from "./chat.type";

export default function ChatSidebar({
  title = "Tin Nhắn",
  search,
  onSearchChange,
  contacts,
  activeContactId,
  onSelect,
}: {
  title?: string;
  search: string;
  onSearchChange: (v: string) => void;
  contacts: Contact[];
  activeContactId: number;
  onSelect: (id: number) => void;
}) {
  return (
    <aside className="border-r bg-slate-50/40">
      <div className="p-5 border-b bg-white">
        <div className="text-xl font-bold">{title}</div>

        <div className="mt-4 relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-sky-300"
            placeholder="Tìm kiếm người dùng..."
          />
        </div>
      </div>

      <div className="p-3 space-y-2 overflow-auto h-[calc(100%-112px)]">
        {contacts.map((c) => {
          const active = c.id === activeContactId;
          return (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              className={[
                "w-full text-left rounded-2xl border bg-white p-3 hover:shadow-sm transition",
                active ? "border-sky-200 ring-2 ring-sky-100" : "border-slate-200",
              ].join(" ")}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={c.avatar}
                    className="h-12 w-12 rounded-full object-cover"
                    alt={c.name}
                  />
                  {c.active ? (
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-semibold truncate">{c.name}</div>
                    <div className="text-xs text-slate-400">{c.time}</div>
                  </div>
                  <div className="text-sm text-slate-500 truncate">
                    {c.lastMessage}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
