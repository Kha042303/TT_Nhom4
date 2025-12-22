import { CheckCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Message } from "./chat.type";

export default function MessageBubble({ message }: { message: Message }) {
  const isMe = message.from === "me";
  const [viewerSrc, setViewerSrc] = useState<string | null>(null);

  const imgs: string[] = useMemo(() => {
    const many = Array.isArray((message as any).images)
      ? ((message as any).images as string[])
      : Array.isArray(message.images)
      ? message.images
      : [];
    if (many.length > 0) return many;
    return message.image ? [message.image] : [];
  }, [message]);

  const text = (message.text ?? "").trim();
  if (!text && imgs.length === 0) return null;

  useEffect(() => {
    if (!viewerSrc) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewerSrc(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [viewerSrc]);

  const Lightbox = viewerSrc ? (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      onClick={() => setViewerSrc(null)}
    >
      <button
        type="button"
        className="absolute top-4 right-4 rounded-full bg-white/10 text-white px-3 py-2 hover:bg-white/20"
        onClick={(e) => {
          e.stopPropagation();
          setViewerSrc(null);
        }}
        aria-label="Đóng"
      >
        ✕
      </button>

      <img
        src={viewerSrc}
        alt="preview"
        className="max-h-[85vh] max-w-[92vw] object-contain rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  ) : null;

  // =========================
  // OTHER (nhận)
  // =========================
  if (!isMe) {
    return (
      <div className="flex items-end gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-200 to-sky-200" />

        <div className="max-w-[560px]">
          {text ? (
            <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
              <div className="text-slate-800">{text}</div>
            </div>
          ) : null}

          {imgs.length > 0 ? (
            <div className={`${text ? "mt-3" : ""} flex flex-wrap gap-2`}>
              {imgs.map((src, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="rounded-2xl overflow-hidden cursor-zoom-in border border-slate-200"
                  onClick={() => setViewerSrc(src)}
                  aria-label="Xem ảnh"
                >
                  <img
                    src={src}
                    className="w-[260px] max-w-[70vw] h-52 object-cover"
                    alt="chat"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          ) : null}

          <div className="mt-1 text-xs text-slate-400">{message.time}</div>
        </div>

        {Lightbox}
      </div>
    );
  }

  // =========================
  // ME (gửi)
  // =========================
  return (
    <div className="flex justify-end">
      <div className="max-w-[560px] flex flex-col items-end">
        {text ? (
          <div className="rounded-2xl border border-sky-200 bg-sky-500 text-white px-4 py-3">
            <div>{text}</div>
          </div>
        ) : null}

        {imgs.length > 0 ? (
          <div className={`${text ? "mt-3" : ""} flex flex-wrap justify-end gap-2 ml-auto`}>
            {imgs.map((src, idx) => (
              <button
                key={idx}
                type="button"
                className="rounded-2xl overflow-hidden cursor-zoom-in border border-slate-200"
                onClick={() => setViewerSrc(src)}
                aria-label="Xem ảnh"
              >
                <img
                  src={src}
                  className="w-[260px] max-w-[70vw] h-52 object-cover"
                  alt="chat"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        ) : null}

        <div className="mt-1 text-xs text-slate-400 flex items-center justify-end gap-1">
          {message.time} <CheckCheck size={14} className="text-sky-500" />
        </div>
      </div>

      {Lightbox}
    </div>
  );
}
