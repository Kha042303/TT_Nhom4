import { Image as ImageIcon, Paperclip, Mic, Send, Heart } from "lucide-react";

export default function ChatComposer({
  value,
  onChange,
  onSend,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend?: () => void; // UI-only (nối BE sau)
}) {
  return (
    <div className="border-t bg-white px-4 py-3 sticky bottom-0">
      <div className="flex items-center gap-2">
        <button className="h-10 w-10 rounded-xl hover:bg-slate-50 flex items-center justify-center">
          <ImageIcon size={18} className="text-slate-500" />
        </button>
        <button className="h-10 w-10 rounded-xl hover:bg-slate-50 flex items-center justify-center">
          <Paperclip size={18} className="text-slate-500" />
        </button>

        <div className="flex-1">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-sky-300"
            placeholder="Nhập tin nhắn của bạn..."
            onKeyDown={(e) => {
              if (e.key === "Enter") onSend?.();
            }}
          />
        </div>

        <button
          type="button"
          onClick={onSend}
          className="h-10 w-10 rounded-full bg-sky-500 text-white flex items-center justify-center hover:bg-sky-600"
        >
          <Send size={18} />
        </button>

        <button className="h-10 w-10 rounded-xl hover:bg-slate-50 flex items-center justify-center">
          <Mic size={18} className="text-slate-500" />
        </button>
      </div>

      <div className="mt-2 text-xs text-slate-400 flex items-center justify-between">
        <span className="inline-flex items-center gap-1">
          <Heart size={14} /> Hãy lịch sự khi trao đổi.
        </span>
        <span className="hidden sm:inline">Enter để gửi</span>
      </div>
    </div>
  );
}
