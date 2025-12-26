import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom"; // Import Link
import {
  Ellipsis,
  MessageCircle,
  Share2,
  X,
  ChevronLeft,
  ChevronRight,
  Flag,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";
import type { CommunityPost } from "./types";

export default function BaiViet({ post }: { post?: CommunityPost }) {
  const hasData = !!post;

  const images = useMemo(() => {
    return Array.isArray(post?.images) ? (post!.images as string[]) : [];
  }, [post]);

  const displayName =
    post?.user?.full_name ||
    (post?.user_id ? `Người dùng #${post.user_id}` : "");

  // ===== lightbox state (xem ảnh) =====
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  // ===== Menu state =====
  const [menuOpen, setMenuOpen] = useState(false); // State cho menu 3 chấm

  const openAt = (idx: number) => {
    setActiveIdx(idx);
    setOpen(true);
  };
  const close = () => setOpen(false);

  const prev = () => setActiveIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIdx((i) => (i + 1) % images.length);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, images.length]);

  const showImages = images.slice(0, 4);
  const moreCount = images.length > 4 ? images.length - 4 : 0;

  // ===== SHARE (FE-only) =====
  const sharePost = async () => {
    if (!post?.post_id) return;
    const shareUrl = `${window.location.origin}/community?post=${post.post_id}`;
    const title = post?.title || "Bài viết cộng đồng";
    const text = (post?.content || "").slice(0, 140);

    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: shareUrl });
        toast.success("Đã mở chia sẻ");
        return;
      }
    } catch {
      return;
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Đã copy link chia sẻ");
    } catch {
        // fallback
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-extrabold text-slate-500">
              {post?.user?.avatar_url ? (
                <img
                  src={post.user.avatar_url}
                  alt={displayName || "avatar"}
                  className="h-full w-full object-cover"
                  draggable={false}
                />
              ) : (
                <>{displayName ? displayName.trim().slice(0, 1).toUpperCase() : ""}</>
              )}
            </div>

            <div>
              <div className="font-extrabold text-slate-900">
                {displayName ? (
                  displayName
                ) : (
                  <span className="inline-block h-4 w-36 rounded bg-slate-100 animate-pulse" />
                )}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {post?.created_at_text ?? (
                  <span className="inline-block h-3 w-24 rounded bg-slate-100 animate-pulse" />
                )}
              </div>
            </div>
          </div>

          {/* MENU 3 CHẤM BÁO CÁO */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center"
            >
              <Ellipsis size={18} className="text-slate-500" />
            </button>

            {menuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10 cursor-default" 
                  onClick={() => setMenuOpen(false)} 
                />
                <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-slate-100 bg-white p-1 shadow-lg ring-1 ring-black/5">
                  <Link
                    to={`/report?type=post&id=${post?.post_id}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <Flag size={16} /> Báo cáo bài viết
                  </Link>
                  <Link
                    to={`/report?type=user&id=${post?.user_id}`}
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

        <div className="px-4 pb-4">
          <div className="text-slate-700 leading-relaxed">
            {post?.content ? (
              <p>{post.content}</p>
            ) : (
              <div className="space-y-2">
                <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
                <div className="h-4 w-11/12 rounded bg-slate-100 animate-pulse" />
                <div className="h-4 w-9/12 rounded bg-slate-100 animate-pulse" />
              </div>
            )}
          </div>

          {/* Grid ảnh + click để mở */}
          {showImages.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {showImages.map((src, idx) => (
                <button
                  key={`${src}-${idx}`}
                  type="button"
                  onClick={() => openAt(idx)}
                  className="relative overflow-hidden rounded-2xl border border-slate-200 focus:outline-none"
                  title="Nhấn để xem"
                >
                  <img
                    src={src}
                    alt={`post-${idx}`}
                    className="h-44 w-full object-cover"
                    draggable={false}
                  />

                  {idx === 3 && moreCount > 0 ? (
                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
                      <span className="text-white font-extrabold text-xl">
                        +{moreCount}
                      </span>
                    </div>
                  ) : null}
                </button>
              ))}
            </div>
          ) : !hasData ? (
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              <div className="aspect-[16/9] bg-slate-100 animate-pulse" />
            </div>
          ) : null}
        </div>

        <div className="border-t border-slate-200">
          <div className="grid grid-cols-2">
            <ActionBtn
              icon={<MessageCircle size={18} />}
              label="Bình luận"
              onClick={() => toast.info("Chức năng bình luận chưa được hỗ trợ")}
            />
            <ActionBtn
              icon={<Share2 size={18} />}
              label="Chia sẻ"
              onClick={sharePost}
            />
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {open && images.length > 0 ? (
        <div
          className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={close}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              className="absolute -top-12 right-0 inline-flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-white hover:bg-white/20"
            >
              <X size={18} />
              Đóng
            </button>

            <div className="rounded-2xl overflow-hidden bg-black">
              <img
                src={images[activeIdx]}
                alt={`full-${activeIdx}`}
                className="w-full max-h-[80vh] object-contain bg-black"
                draggable={false}
              />
            </div>

            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center"
                  title="Trước"
                >
                  <ChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center"
                  title="Sau"
                >
                  <ChevronRight />
                </button>

                <div className="mt-3 text-center text-white/80 text-sm font-semibold">
                  {activeIdx + 1} / {images.length}
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

function ActionBtn({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="py-3 inline-flex items-center justify-center gap-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
    >
      <span className="text-slate-500">{icon}</span>
      {label}
    </button>
  );
}