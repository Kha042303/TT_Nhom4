// src/pages/CommunityFindBookPage.tsx
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import DangBai from "../components/community/DangBai";
import DSBaiViet from "../components/community/DSBaiViet";
import type { CommunityPost } from "../components/community/types";

import type { User } from "../api/auth.api";
import { listPostsApi } from "../api/post.api";
import { getUserByIdApi, type UserPublic } from "../api/user.api";

function timeAgo(iso?: string) {
  if (!iso) return "";
  const t = new Date(iso).getTime();
  if (!t) return "";
  const diff = Date.now() - t;

  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s trước`;

  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} phút trước`;

  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} giờ trước`;

  const day = Math.floor(hr / 24);
  return `${day} ngày trước`;
}

export default function CommunityPage() {
  // ===== auth (không gọi /profile để tránh 403) =====
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tk =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("access_token");

    if (!tk) {
      setCurrentUser(null);
    } else {
      // có token thì dùng user trong localStorage (khỏi gọi profile)
      const raw = localStorage.getItem("user");
      setCurrentUser(raw ? (JSON.parse(raw) as User) : null);
    }

    setLoading(false);
  }, []);

  // ===== fetch posts =====
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [page, setPage] = useState(1);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [totalPage, setTotalPage] = useState<number | null>(null);

  // cache user theo user_id để tránh gọi API lặp
  const userCacheRef = useRef<Record<number, UserPublic | null>>({});

  const hydrateUsersForPosts = useCallback(async (items: CommunityPost[]) => {
    const ids = Array.from(
      new Set(
        items
          .map((p) => p.user_id)
          .filter((id): id is number => typeof id === "number")
      )
    );

    const missing = ids.filter((id) => !(id in userCacheRef.current));
    if (missing.length) {
      await Promise.all(
        missing.map(async (id) => {
          try {
            const u = await getUserByIdApi(id); // endpoint này không cần token
            userCacheRef.current[id] = u;
          } catch {
            userCacheRef.current[id] = null;
          }
        })
      );
    }

    return items.map((p) => ({
      ...p,
      user:
        (typeof p.user_id === "number"
          ? userCacheRef.current[p.user_id]
          : null) || p.user,
    }));
  }, []);

  const fetchPosts = useCallback(
    async (p = 1) => {
      setLoadingPosts(true);
      try {
        const rs = await listPostsApi({ page: p, limit: 8, status: "visible" });

        const mappedBase: CommunityPost[] = (rs?.data || []).map((x: any) => ({
          post_id: x.post_id,
          user_id: x.user_id,
          user: undefined,
          title: x.title,
          content: x.content || "",
          created_at: x.created_at,
          created_at_text: timeAgo(x.created_at),
          
          images: (x.images ?? []) as string[],

        }));

        const mapped = await hydrateUsersForPosts(mappedBase);

        setPosts(mapped);
        setTotalPage(rs?.pagination?.totalPage ?? null);
      } catch {
        setPosts([]);
        setTotalPage(null);
      } finally {
        setLoadingPosts(false);
      }
    },
    [hydrateUsersForPosts]
  );

  useEffect(() => {
    fetchPosts(page);
  }, [page, fetchPosts]);

  const canNext = useMemo(() => {
    if (totalPage === null) return true;
    return page < totalPage;
  }, [page, totalPage]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={currentUser as any} loading={loading} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Cộng đồng Tìm Sách
          </h1>
          <p className="mt-2 text-slate-600">
            Đăng yêu cầu tìm cuốn sách bạn mong muốn và kết nối với người bán.
          </p>

          <div className="mt-6 space-y-4">
            <DangBai
              disabled={!currentUser}
              onCreated={() => {
                setPage(1);
                fetchPosts(1);
              }}
            />

            <DSBaiViet posts={posts} />

            <div className="py-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                disabled={page <= 1 || loadingPosts}
              >
                Trang trước
              </button>

              <div className="text-sm font-semibold text-slate-600">
                Trang {page}
                {totalPage ? ` / ${totalPage}` : ""}
              </div>

              <button
                type="button"
                onClick={() => setPage((p) => (canNext ? p + 1 : p))}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                disabled={!canNext || loadingPosts}
              >
                Trang sau
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
