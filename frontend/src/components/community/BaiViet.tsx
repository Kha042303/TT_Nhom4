import { Ellipsis, MessageCircle, Share2, ThumbsUp } from "lucide-react";
import type { CommunityPost } from "./types";

export default function BaiViet({ post }: { post?: CommunityPost }) {
  const hasData = !!post;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          {post?.user?.avatar_url ? (
            <img
              src={post.user.avatar_url}
              alt={post.user.full_name ?? "user"}
              className="h-11 w-11 rounded-full object-cover border border-slate-200"
              draggable={false}
            />
          ) : (
            <div className="h-11 w-11 rounded-full bg-slate-100 border border-slate-200" />
          )}

          <div>
            <div className="font-extrabold text-slate-900">
              {post?.user?.full_name ?? (
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

        <button
          type="button"
          className="h-9 w-9 rounded-xl hover:bg-slate-50 flex items-center justify-center"
        >
          <Ellipsis size={18} className="text-slate-500" />
        </button>
      </div>

      {/* content */}
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

        {/* contact bar */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-sky-50 px-4 py-3 text-sm font-semibold text-slate-700">
          {post?.contact_text ?? (
            <span className="inline-block h-4 w-72 rounded bg-white/70 animate-pulse" />
          )}
        </div>

        {/* image */}
        {post?.image_url ? (
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            <img
              src={post.image_url}
              alt="post"
              className="w-full object-cover"
              draggable={false}
            />
          </div>
        ) : (
          // nếu không có data thì show khung ảnh placeholder giống bài có ảnh
          !hasData ? (
            <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
              <div className="aspect-[16/9] bg-slate-100 animate-pulse" />
            </div>
          ) : null
        )}

        {/* stats (optional) */}
        {(post?.stats?.likes || post?.stats?.comments) ? (
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <div>{post?.stats?.likes ? `${post.stats.likes} quan tâm` : ""}</div>
            <div>{post?.stats?.comments ? `${post.stats.comments} bình luận` : ""}</div>
          </div>
        ) : null}
      </div>

      {/* actions */}
      <div className="border-t border-slate-200">
        <div className="grid grid-cols-3">
          <ActionBtn icon={<ThumbsUp size={18} />} label="Quan tâm" />
          <ActionBtn icon={<MessageCircle size={18} />} label="Bình luận" />
          <ActionBtn icon={<Share2 size={18} />} label="Chia sẻ" />
        </div>
      </div>
    </div>
  );
}

function ActionBtn({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      className="py-3 inline-flex items-center justify-center gap-2 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
    >
      <span className="text-slate-500">{icon}</span>
      {label}
    </button>
  );
}
