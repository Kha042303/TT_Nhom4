import ProfileSidebar from "../components/userinfo/Profile";
import SellingBooksSection from "../components/userinfo/BookSell";
import FindRequestsSection from "../components/userinfo/FindBook";
import type { UserInfoUI, SellingBookUI, FindRequestUI } from "../components/userinfo/types";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

export default function UserInfoPage() {
  // ✅ lấy user đang đăng nhập từ localStorage
  const authUser = JSON.parse(localStorage.getItem("user") || "null");

  // UI-only data (profile detail sẽ nối API sau)
  const user: UserInfoUI | undefined = undefined;
  const sellingBooks: SellingBookUI[] | undefined = undefined;
  const requests: FindRequestUI[] | undefined = undefined;

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ✅ truyền đúng user đăng nhập cho Header */}
      <Header user={authUser} loading={false} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <ProfileSidebar user={user} />
          </div>

          <div className="lg:col-span-8 space-y-8">
            <SellingBooksSection books={sellingBooks} totalCount={undefined} />
            <FindRequestsSection requests={requests} totalCount={undefined} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
