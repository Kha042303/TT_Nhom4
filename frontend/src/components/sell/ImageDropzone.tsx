import React, { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

export default function ImageDropzone() {
  // UI-only: preview cho đẹp (không đụng backend)
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const onPick = (files: FileList | null) => {
    if (!files) return;
    const list = Array.from(files).slice(0, 5);
    const urls = list.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  };

  return (
    <div>
      <div className="text-sm font-medium text-slate-700">
        Hình ảnh sách <span className="text-slate-400">(Tối đa 5 ảnh)</span>
      </div>

      <div
        className="mt-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-6 text-center"
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <div className="mx-auto h-12 w-12 rounded-2xl bg-white border flex items-center justify-center text-sky-600">
          <ImagePlus />
        </div>
        <div className="mt-3 font-medium">Nhấn để tải ảnh lên</div>
        <div className="mt-1 text-sm text-slate-500">
          Hoặc kéo thả ảnh vào khu vực này
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => onPick(e.target.files)}
        />
      </div>

      {previews.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
          {previews.map((src, idx) => (
            <div key={src} className="relative rounded-xl overflow-hidden border bg-white">
              <img src={src} className="h-24 w-full object-cover" />
              <button
                type="button"
                className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/90 border flex items-center justify-center"
                onClick={() => setPreviews((p) => p.filter((_, i) => i !== idx))}
                aria-label="remove"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
