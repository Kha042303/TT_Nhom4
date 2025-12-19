import FindBookPostCard from "./BaiViet";
import type { CommunityPost } from "./types";

export default function DSBaiViet({ posts }: { posts?: CommunityPost[] }) {
  const list = posts ?? [];

  return (
    <div className="space-y-4">
      {(list.length ? list : Array.from({ length: 3 })).map((p, idx) => (
        <FindBookPostCard
          key={idx}
          post={typeof p === "object" ? (p as CommunityPost) : undefined}
        />
      ))}
    </div>
  );
}
