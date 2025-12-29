import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import {
  Ellipsis,
  MessageCircle,
  Share2,
  X,
  ChevronLeft,
  ChevronRight,
  Flag,
  AlertTriangle,
  ExternalLink // Icon cho xem chi tiết
} from "lucide-react";
import { toast } from "sonner";
import type { CommunityPost } from "./types";

export default function BaiViet({ post }: { post?: CommunityPost }) {
  const navigate = useNavigate(); // Hook để chuyển trang
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
  const [menuOpen, setMenuOpen] = useState(false);

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
  }, [open, images.length]);

  const showImages = images.slice(0, 4);
  const moreCount = images.length > 4 ? images.length - 4 : 0;

  // ===== XỬ LÝ LIÊN HỆ =====
  const handleContact = () => {
    if (!post?.user_id) return;
    // Chuyển hướng sang trang chat với ID người đăng
    navigate(`/chat?sellerId=${post.user_id}`);
  };

  // ===== SHARE (FE-only) =====
  const sharePost = async () => {
    if (!post?.post_id) return;
    const shareUrl = `${window.location.origin}/post/detail/${post.post_id}`; // Link chi tiết
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
        
        {/* HEADER: Avatar + Tên + Menu */}
        <div className="p-4 flex items-start justify-between">
          
          {/* Click vào Avatar/Tên cũng sang trang cá nhân */}
          <Link to={`/profileid/${post?.user_id}`} className="flex items-center gap-3 group">
            <div className="h-11 w-11 rounded-full bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-extrabold text-slate-500">
              {post?.user?.avatar_url ? (
                <img
                  src={post.user.avatar_url}
                  alt={displayName || "avatar"}
                  className="h-full w-full object-cover group-hover:opacity-90 transition-opacity"
                  draggable={false}
                />
              ) : (
                <>{displayName ? displayName.trim().slice(0, 1).toUpperCase() : ""}</>
              )}
            </div>

            <div>
              <div className="font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors">
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
          </Link>

          {/* MENU 3 CHẤM */}
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
                <div className="absolute right-0 top-10 z-20 w-48 rounded-xl border border-slate-100 bg-white p-1 shadow-lg ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100">
                  {/* Link xem chi tiết trong menu */}
                  <Link
                    to={`/post/detail/${post?.post_id}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <ExternalLink size={16} /> Xem chi tiết
                  </Link>

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
          {/* [LOGIC MỚI] Bọc nội dung text trong Link để xem chi tiết */}
          <Link to={`/post/detail/${post?.post_id}`} className="block group">
             <div className="text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
                {post?.content ? (
                  <p className="line-clamp-4">{post.content}</p> // line-clamp để nếu dài quá thì hiện ...
                ) : (
                  <div className="space-y-2">
                    <div className="h-4 w-full rounded bg-slate-100 animate-pulse" />
                    <div className="h-4 w-11/12 rounded bg-slate-100 animate-pulse" />
                  </div>
                )}
             </div>
          </Link>

          {/* Grid ảnh */}
          {showImages.length > 0 ? (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {showImages.map((src, idx) => (
                <button
                  key={`${src}-${idx}`}
                  type="button"
                  onClick={() => openAt(idx)}
                  className="relative overflow-hidden rounded-2xl border border-slate-200 focus:outline-none hover:opacity-95 transition-opacity"
                  title="Nhấn để xem ảnh lớn"
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

        {/* FOOTER BUTTONS */}
        <div className="border-t border-slate-200">
          <div className="grid grid-cols-2 divide-x divide-slate-100">
            
            {/* NÚT LIÊN HỆ (Thay cho bình luận) */}
            <ActionBtn
              icon={<MessageCircle size={18} className="text-sky-600" />}
              label="Liên hệ"
              onClick={handleContact}
            />

            {/* NÚT CHIA SẺ */}
            <ActionBtn
              icon={<Share2 size={18} />}
              label="Chia sẻ"
              onClick={sharePost}
            />
          </div>
        </div>
      </div>

      {/* Lightbox (Giữ nguyên) */}
      {open && images.length > 0 ? (
        <div
          className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={close}
        >
          <div
            className="relative w-full max-w-5xl h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              className="absolute top-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/20 backdrop-blur-md transition-colors"
            >
              <X size={18} />
              <span className="font-bold text-sm">Đóng</span>
            </button>

            <div className="rounded-lg overflow-hidden max-h-[90vh]">
              <img
                src={images[activeIdx]}
                alt={`full-${activeIdx}`}
                className="max-w-full max-h-[85vh] object-contain"
                draggable={false}
              />
            </div>

            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={prev}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  type="button"
                  onClick={next}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all"
                >
                  <ChevronRight size={28} />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-black/50 text-white/90 text-sm font-bold backdrop-blur-sm">
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
      className="py-3 inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors active:bg-slate-100"
    >
      <span>{icon}</span>
      {label}
    </button>
  );
}