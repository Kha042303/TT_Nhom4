import React, { useMemo, useState } from "react";

type Props = {
  files?: File[]; // nếu truyền vào -> controlled
  onChange?: React.Dispatch<React.SetStateAction<File[]>>; // cho phép setImages luôn
  max?: number;
  accept?: string;
};

export default function ImageDropzone({
  files,
  onChange,
  max = 10,
  accept = "image/*",
}: Props) {
  const [inner, setInner] = useState<File[]>([]);
  const list = files ?? inner;

  const setList: React.Dispatch<React.SetStateAction<File[]>> =
    onChange ?? setInner;

  const previews = useMemo(
    () =>
      list.map((f) => ({
        file: f,
        url: URL.createObjectURL(f),
      })),
    [list]
  );

  const addFiles = (incoming: File[]) => {
    setList((prev) => {
      const base = Array.isArray(prev) ? prev : [];
      const merged = [...base, ...incoming].slice(0, max);
      return merged;
    });
  };

  const removeAt = (idx: number) => {
    setList((prev) => (Array.isArray(prev) ? prev.filter((_, i) => i !== idx) : []));
  };

  return (
    <div className="rounded-2xl border bg-white p-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Hình ảnh</div>
        <div className="text-xs text-slate-500">
          {list.length}/{max}
        </div>
      </div>

      <label className="mt-3 block cursor-pointer rounded-2xl border border-dashed p-6 text-center hover:bg-slate-50">
        <div className="text-sm text-slate-700 font-medium">
          Kéo thả ảnh vào đây hoặc bấm để chọn
        </div>
        <div className="mt-1 text-xs text-slate-500">Hỗ trợ JPG/PNG, tối đa {max} ảnh</div>

        <input
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={(e) => {
            const incoming = Array.from(e.target.files || []);
            if (incoming.length) addFiles(incoming);
            e.currentTarget.value = "";
          }}
        />
      </label>

      {previews.length > 0 && (
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 gap-3">
          {previews.map((p, idx) => (
            <div key={idx} className="relative">
              <img
                src={p.url}
                alt={p.file.name}
                className="h-20 w-full rounded-xl object-cover border"
                onLoad={() => URL.revokeObjectURL(p.url)}
              />
              <button
                type="button"
                onClick={() => removeAt(idx)}
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-black/70 text-white text-xs"
                title="Xoá"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
