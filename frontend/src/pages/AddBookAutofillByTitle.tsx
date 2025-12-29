import React, { useEffect, useMemo, useRef, useState } from "react";

type GBItem = {
  id: string;
  title: string;
  authors: string[];
  author: string;
  publisher: string;
  publishedDate: string;
  description: string;
  categories: string[];
  category: string;
  thumbnail: string;
  isbn13?: string;
  isbn10?: string;
  language?: string;
};

function stripHtml(s: string) {
  return (s || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function clampText(s: string, n: number) {
  const t = (s || "").trim();
  if (t.length <= n) return t;
  return t.slice(0, n - 1) + "…";
}

function cleanIsbn(raw: string) {
  return String(raw || "").toUpperCase().replace(/[^0-9X]/g, "");
}

function extractIsbns(industryIdentifiers: any): { isbn10?: string; isbn13?: string } {
  const ids = Array.isArray(industryIdentifiers) ? industryIdentifiers : [];
  const map: Record<string, string> = {};
  for (const it of ids) {
    if (it?.type && it?.identifier) map[it.type] = it.identifier;
  }
  const isbn10 = map["ISBN_10"] ? cleanIsbn(map["ISBN_10"]) : undefined;
  const isbn13 = map["ISBN_13"] ? cleanIsbn(map["ISBN_13"]) : undefined;
  return { isbn10, isbn13 };
}

async function searchGoogleBooksByTitle(title: string, signal?: AbortSignal): Promise<GBItem[]> {
  const q = title.trim();
  if (q.length < 3) return [];

  // intitle: tìm theo tiêu đề, maxResults 8 là vừa đủ
  const url = `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
    q
  )}&maxResults=8`;

  const r = await fetch(url, { signal });
  const j = await r.json();

  const items = Array.isArray(j?.items) ? j.items : [];
  return items
    .map((it: any) => {
      const v = it?.volumeInfo || {};
      const authors = Array.isArray(v?.authors) ? v.authors : [];
      const { isbn10, isbn13 } = extractIsbns(v?.industryIdentifiers);

      const thumbnail =
        v?.imageLinks?.thumbnail ||
        v?.imageLinks?.smallThumbnail ||
        "";

      const categories = Array.isArray(v?.categories) ? v.categories : [];

      const item: GBItem = {
        id: it?.id || crypto.randomUUID(),
        title: v?.title || "",
        authors,
        author: authors?.[0] || "",
        publisher: v?.publisher || "",
        publishedDate: v?.publishedDate || "",
        description: stripHtml(v?.description || ""),
        categories,
        category: categories?.[0] || "",
        thumbnail: thumbnail?.startsWith("http://")
          ? "https://" + thumbnail.slice("http://".length)
          : thumbnail,
        isbn10,
        isbn13,
        language: v?.language,
      };
      return item;
    })
    .filter((x: GBItem) => x.title);
}

export default function AddBookAutofillByTitle() {
  // ===== Form state =====
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [isbn10, setIsbn10] = useState("");
  const [isbn13, setIsbn13] = useState("");

  // optional fields
  const [price, setPrice] = useState(""); // bạn tự nhập
  const [stock, setStock] = useState("1"); // default 1
  const [status, setStatus] = useState<"active" | "inactive">("active");

  // ===== Autocomplete state =====
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<GBItem[]>([]);
  const [error, setError] = useState<string>("");

  const lastAppliedIdRef = useRef<string>("");

  // Debounce + abort controller
  useEffect(() => {
    const q = title.trim();
    setError("");

    if (q.length < 3) {
      setItems([]);
      setLoading(false);
      return;
    }

    const ac = new AbortController();
    const t = window.setTimeout(async () => {
      try {
        setLoading(true);
        const list = await searchGoogleBooksByTitle(q, ac.signal);
        setItems(list);
      } catch (e: any) {
        if (e?.name !== "AbortError") {
          setError("Không tìm được dữ liệu (có thể do mạng).");
        }
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      window.clearTimeout(t);
      ac.abort();
    };
  }, [title]);

  const topItem = useMemo(() => (items?.length ? items[0] : null), [items]);

  function applyItem(it: GBItem) {
    lastAppliedIdRef.current = it.id;

    setTitle(it.title || "");
    setAuthor(it.author || "");
    setPublisher(it.publisher || "");
    setPublishedDate(it.publishedDate || "");
    setCategory(it.category || "");
    setDescription(it.description || "");
    setCoverUrl(it.thumbnail || "");
    setIsbn10(it.isbn10 || "");
    setIsbn13(it.isbn13 || "");

    setOpen(false);
  }

  // Enter = apply top result (nếu có)
  function onTitleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (topItem) {
        e.preventDefault();
        applyItem(topItem);
      }
    }
    if (e.key === "Escape") setOpen(false);
  }

  function formatVND(s: string) {
    const n = Number(s);
    if (!s || Number.isNaN(n)) return "";
    return n.toLocaleString("vi-VN") + " ₫";
  }

  const pricePreview = useMemo(() => formatVND(price.replace(/[^\d]/g, "")), [price]);

  return (
    <div style={{ minHeight: "100vh" }} className="bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h1 className="text-xl font-bold">Thêm sách (Auto-fill theo Tiêu đề)</h1>
          <p className="mt-1 text-sm text-slate-500">
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <label className="block text-sm font-semibold">
                Tiêu đề sách <span className="text-red-500">*</span>
              </label>

              <div className="relative mt-2">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => setOpen(true)}
                  onBlur={() => window.setTimeout(() => setOpen(false), 150)}
                  onKeyDown={onTitleKeyDown}
                  placeholder="VD: Nhà giả kim, Dế Mèn phiêu lưu ký..."
                  className="w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-200"
                />

                {/* Dropdown */}
                {open && (loading || error || items.length > 0) ? (
                  <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-xl border bg-white shadow">
                    {loading ? (
                      <div className="px-3 py-2 text-sm text-slate-500">Đang tìm…</div>
                    ) : error ? (
                      <div className="px-3 py-2 text-sm text-rose-600">{error}</div>
                    ) : items.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-slate-500">
                        Không có gợi ý. Thử gõ rõ hơn (tên + tác giả).
                      </div>
                    ) : (
                      items.map((it) => (
                        <button
                          key={it.id}
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => applyItem(it)}
                          className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-slate-50"
                        >
                          <div className="h-12 w-10 overflow-hidden rounded-md border bg-white">
                            {it.thumbnail ? (
                              <img
                                src={it.thumbnail}
                                alt="cover"
                                className="h-full w-full object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-slate-900 line-clamp-1">
                              {it.title}
                            </div>
                            <div className="text-xs text-slate-500 line-clamp-1">
                              {it.author || "—"}
                              {it.publisher ? ` • ${it.publisher}` : ""}
                              {it.publishedDate ? ` • ${it.publishedDate}` : ""}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                ) : null}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={!topItem || loading}
                  onClick={() => topItem && applyItem(topItem)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {loading ? "Đang tìm..." : "Tự điền theo kết quả đầu"}
                </button>
                <span className="text-xs text-slate-500">
                  Mẹo: nhấn <b>Enter</b> để tự điền theo kết quả đầu.
                </span>
              </div>

              {lastAppliedIdRef.current ? (
                <div className="mt-3 rounded-xl border bg-slate-50 p-3 text-xs text-slate-600">
                  Đã auto-fill. Bạn có thể chỉnh lại thủ công nếu muốn.
                </div>
              ) : null}
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold">Tác giả</label>
                  <input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Tự điền từ tiêu đề (có thể sửa)"
                    className="mt-2 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-200"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Nếu có nhiều tác giả, bạn có thể ghi “A, B…”.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold">Nhà xuất bản</label>
                  <input
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    placeholder="Tự điền (có thể sửa)"
                    className="mt-2 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold">Năm/Xuất bản</label>
                  <input
                    value={publishedDate}
                    onChange={(e) => setPublishedDate(e.target.value)}
                    placeholder="VD: 2020-05-01 hoặc 2020"
                    className="mt-2 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold">Thể loại (category)</label>
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Tự điền (có thể sửa)"
                    className="mt-2 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </div>

               
                <div>
                  <label className="block text-sm font-semibold">Giá (VNĐ)</label>
                  <input
                    value={price}
                    onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
                    placeholder="VD: 50000"
                    inputMode="numeric"
                    className="mt-2 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-200"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Preview: <b>{pricePreview || "—"}</b>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold">Tồn kho</label>
                  <input
                    value={stock}
                    onChange={(e) => setStock(e.target.value.replace(/[^\d]/g, ""))}
                    placeholder="VD: 1"
                    inputMode="numeric"
                    className="mt-2 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-200"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold">Trạng thái</label>
                  <div className="mt-2 flex gap-4">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        checked={status === "active"}
                        onChange={() => setStatus("active")}
                      />
                      active
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        checked={status === "inactive"}
                        onChange={() => setStatus("inactive")}
                      />
                      inactive
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold">Mô tả</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tự điền từ nguồn ngoài (có thể chỉnh sửa/rút gọn)"
                  rows={6}
                  className="mt-2 w-full rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-sky-200"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Nếu mô tả dài, bạn có thể rút gọn còn 2–4 câu.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAuthor("");
                    setPublisher("");
                    setPublishedDate("");
                    setCategory("");
                    setDescription("");
                    setCoverUrl("");
                    setIsbn10("");
                    setIsbn13("");
                  }}
                  className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
                >
                  Xoá các field auto-fill
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const payload = {
                      title,
                      author,
                      publisher,
                      publishedDate,
                      category,
                      isbn10,
                      isbn13,
                      description,
                      coverUrl,
                      price: price ? Number(price) : undefined,
                      stock: stock ? Number(stock) : undefined,
                      status,
                    };
                    // Demo: copy JSON
                    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
                    alert("Đã copy JSON payload vào clipboard!");
                  }}
                  className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
                >
                  Copy payload (demo)
                </button>
              </div>

              <p className="text-xs text-slate-500">
              </p>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-sm font-bold">Preview</h2>
              <div className="mt-3 flex gap-3">
                <div className="h-28 w-20 overflow-hidden rounded-xl border bg-slate-50">
                  {coverUrl ? (
                    <img src={coverUrl} alt="cover" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                <div className="min-w-0">
                  <div className="font-bold line-clamp-2">{title || "—"}</div>
                  <div className="mt-1 text-sm text-slate-600 line-clamp-1">
                    {author || "—"}
                  </div>
                  <div className="mt-1 text-xs text-slate-500 line-clamp-2">
                    {publisher || "—"} {publishedDate ? `• ${publishedDate}` : ""}
                  </div>
                  <div className="mt-2 text-xs text-slate-500">
                    ISBN13: {isbn13 || "—"}
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-600">
                <div className="font-semibold">Mô tả (rút gọn)</div>
                <div className="mt-1 text-slate-500">
                  {description ? clampText(description, 220) : "—"}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border bg-white p-6 shadow-sm">
              <h2 className="text-sm font-bold">Cách dùng nhanh</h2>
              <ol className="mt-2 list-decimal pl-5 text-sm text-slate-600 space-y-1">
                <li>Gõ tiêu đề ≥ 3 ký tự</li>
                <li>Chọn sách trong gợi ý (hoặc nhấn Enter)</li>
                <li>Chỉnh lại nếu cần</li>
                <li>Khi làm thật: gửi payload về backend /book/create</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
