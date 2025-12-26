import { useState } from "react";
import { Link } from "react-router-dom"; 
import { Phone, Video, Info, Flag, AlertTriangle } from "lucide-react";
import type { Contact } from "./chat.type";
import InterestedBookCard from "./InterestedBookCard";

export default function ChatHeader({
  contact,
  interestedBook,
}: {
  contact: Contact;
  interestedBook?: { cover: string; title: string };
}) {
  const [menuOpen, setMenuOpen] = useState(false);

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
        
        {/* NÚT INFO CÓ DROPDOWN BÁO CÁO */}
        <div className="relative">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="h-10 w-10 rounded-xl hover:bg-slate-50 flex items-center justify-center"
          >
            <Info size={18} className="text-slate-600" />
          </button>

          {menuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10 cursor-default" 
                  onClick={() => setMenuOpen(false)} 
                />
                <div className="absolute right-0 top-12 z-20 w-52 rounded-xl border border-slate-100 bg-white p-1 shadow-lg ring-1 ring-black/5">
                  <Link
                    // SỬA: Dùng contact.id thay vì contact.user_id
                    to={`/report?type=chat&id=${contact.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Flag size={16} /> Báo cáo cuộc chat
                  </Link>
                  <Link
                    // SỬA: Dùng contact.id thay vì contact.user_id
                    to={`/report?type=user&id=${contact.id}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <AlertTriangle size={16} /> Báo cáo người dùng
                  </Link>
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
}