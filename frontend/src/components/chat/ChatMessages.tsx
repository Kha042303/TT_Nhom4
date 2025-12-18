import type { Message } from "./chat.type";
import MessageBubble from "./MessageBubble";

export default function ChatMessages({
  dateLabel = "Hôm nay, 20 Tháng 10",
  messages,
}: {
  dateLabel?: string;
  messages: Message[];
}) {
  return (
    <div className="flex-1 bg-slate-50 px-5 py-6 overflow-auto">
      <div className="flex justify-center">
        <div className="text-xs px-4 py-1 rounded-full bg-slate-200/60 text-slate-500">
          {dateLabel}
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </div>
    </div>
  );
}
