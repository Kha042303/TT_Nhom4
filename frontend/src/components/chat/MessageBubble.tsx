import { CheckCheck } from "lucide-react";
import type { Message } from "./chat.type";

export default function MessageBubble({
  message,
}: {
  message: Message;
}) {
  if (message.from === "other") {
    return (
      <div className="flex items-end gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-200 to-sky-200" />
        <div>
          <div className="max-w-[560px] rounded-2xl border bg-white px-4 py-3 shadow-sm">
            {message.text ? <div className="text-slate-800">{message.text}</div> : null}
            {message.image ? (
              <div className="mt-3 rounded-2xl overflow-hidden border">
                <img src={message.image} className="w-full h-52 object-cover" />
              </div>
            ) : null}
          </div>
          <div className="mt-1 text-xs text-slate-400">{message.time}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <div className="max-w-[560px]">
        <div className="rounded-2xl bg-sky-500 text-white px-4 py-3 shadow-sm">
          {message.text}
        </div>
        <div className="mt-1 text-xs text-slate-400 flex items-center justify-end gap-1">
          {message.time} <CheckCheck size={14} className="text-sky-500" />
        </div>
      </div>
    </div>
  );
}
