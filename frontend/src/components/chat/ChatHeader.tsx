import { Phone, Video, Info } from "lucide-react";
import type { Contact } from "./chat.type";
import InterestedBookCard from "./InterestedBookCard";

export default function ChatHeader({
  contact,
  interestedBook,
}: {
  contact: Contact;
  interestedBook?: { cover: string; title: string };
}) {
  return (
    <div className="border-b bg-white px-5 py-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={contact.avatar}
          className="h-11 w-11 rounded-full object-cover"
          alt={contact.name}
        />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-semibold truncate">{contact.name}</div>
            <span className="text-[11px] px-2 py-0.5 rounded-full border border-sky-200 bg-sky-50 text-sky-700 font-semibold">
              TRAO ĐỔI
            </span>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            Đang hoạt động
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {interestedBook ? (
          <InterestedBookCard cover={interestedBook.cover} title={interestedBook.title} />
        ) : null}

        <button className="h-10 w-10 rounded-xl hover:bg-slate-50 flex items-center justify-center">
          <Phone size={18} className="text-slate-600" />
        </button>
        <button className="h-10 w-10 rounded-xl hover:bg-slate-50 flex items-center justify-center">
          <Video size={18} className="text-slate-600" />
        </button>
        <button className="h-10 w-10 rounded-xl hover:bg-slate-50 flex items-center justify-center">
          <Info size={18} className="text-slate-600" />
        </button>
      </div>
    </div>
  );
}
