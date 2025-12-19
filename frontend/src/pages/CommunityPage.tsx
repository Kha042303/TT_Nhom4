import PostComposer from "../components/community/DangBai";
import CommunityFeed from "../components/community/DSBaiViet";
import type { CommunityPost, FeedFilter } from "../components/community/types";

// ⚠️ đổi path theo dự án bạn
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import DangBai from "../components/community/DangBai";
import DSBaiViet from "../components/community/DSBaiViet";

export default function CommunityFindBookPage() {
  // UI-only: chưa nối API => không có data
  const posts: CommunityPost[] | undefined = undefined;
  const activeFilter: FeedFilter = "latest"; // UI-only, chưa làm state

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={null as any} loading={false} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Cộng đồng Tìm Sách
          </h1>
          <p className="mt-2 text-slate-600">
            Đăng yêu cầu tìm cuốn sách bạn mong muốn và kết nối với người bán.
          </p>

          <div className="mt-6 space-y-4">
            <DangBai />
            <DSBaiViet posts={posts} />

            <div className="py-6 text-center text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                Bạn đã xem hết các bài viết mới nhất
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
