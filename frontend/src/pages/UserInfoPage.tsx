import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";

// Components
import ProfileSidebar from "../components/userinfo/Profile";
import SellingBooksSection from "../components/userinfo/BookSell";
import FindRequestsSection from "../components/userinfo/FindBook";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// Types
import type { UserInfoUI, SellingBookUI, FindRequestUI } from "../components/userinfo/types";

// APIs
import { getUserByIdApi, type UserPublic } from "../api/user.api";
import { listBooksApi, type Book } from "../api/book.api";
import { listPostsApi, type PostFromDB } from "../api/post.api";

export default function UserInfoPage() {
  const { id } = useParams<{ id: string }>();
  
  // 1. Lấy thông tin người đang đăng nhập để so sánh
  const authUser = JSON.parse(localStorage.getItem("user") || "null");
  const isOwnProfile = authUser?.user_id === Number(id);

  const [profile, setProfile] = useState<UserPublic | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [posts, setPosts] = useState<PostFromDB[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Hàm tải dữ liệu (Dùng useCallback để có thể gọi lại khi cần refresh)
  const fetchData = useCallback(async () => {
    if (!id) return;
    // setLoading(true); // Có thể bật loading nếu muốn hiệu ứng load lại rõ ràng
    try {
      const [userRes, booksRes, postsRes] = await Promise.all([
        getUserByIdApi(id),
        // ✅ QUAN TRỌNG: Truyền userId vào API để chỉ lấy sách của user này
        listBooksApi({ userId: id, limit: 12 }), 
        listPostsApi({ userId: id, limit: 10 })
      ]);

      setProfile(userRes);
      setBooks(booksRes.books || []); 
      setPosts(postsRes.data || []);
    } catch (error) {
      console.error("Lỗi tải trang cá nhân:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [fetchData]);

  // Hàm xử lý khi xóa sách thành công -> Load lại danh sách
  const handleRefreshData = () => {
    fetchData();
  };

  // --- MAPPING DATA (API -> UI) ---

  const userUI: UserInfoUI | undefined = profile ? {
    id: profile.user_id,
    
    // ✅ Truyền cờ chính chủ xuống Profile để hiện nút Sửa/Nhắn tin đúng logic
    isCurrentUser: isOwnProfile, 

    full_name: profile.full_name || `User #${profile.user_id}`,
    badge: "Thành viên", 
    bio: "Chưa có giới thiệu...",
    phone: profile.phone 
      ? (isOwnProfile ? profile.phone : profile.phone.replace(/\d{3}$/, "***"))
      : "Chưa cập nhật",
    email: profile.email || "Chưa cập nhật",
    location: profile.address || "Việt Nam",
    joined_text: profile.created_at ? `Tham gia ${new Date(profile.created_at).toLocaleDateString('vi-VN')}` : "Thành viên mới",
    
    // Tự động tạo Avatar nếu thiếu
    avatar_url:  `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || "User")}&background=random&color=fff&size=256`,
  } : undefined;

  const sellingBooksUI: SellingBookUI[] = books.map(b => ({
    id: b.book_id,
    title: b.title,
    author: b.author,
    price: b.price,
    condition_badge: b.status === 'active' ? 'Còn hàng' : 'Đã bán',
    cover_url: Array.isArray(b.image_url) && b.image_url.length > 0 ? b.image_url[0] : (typeof b.image_url === 'string' ? b.image_url : ""),
  
    isOwner: isOwnProfile 
  }));
const defaultAvatar =  `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || "User")}&background=random&color=fff`;

  const requestsUI: FindRequestUI[] = posts.map(p => ({
    id: p.post_id,
    title: p.title,
    content: p.content || "",
    status_badge: p.status === 'visible' ? "Đang Tìm" : "Đã Tìm Thấy",
    created_at_text: p.created_at ? new Date(p.created_at).toLocaleDateString('vi-VN') : "",
    isOwner: isOwnProfile,
    images: p.images || [],
    
    // 👇 THÊM 2 DÒNG NÀY (Lấy từ profile trang hiện tại)
    user_name: profile?.full_name || "Người dùng",
    user_avatar: defaultAvatar
  }));

  // --- RENDER ---

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Đang tải dữ liệu...</div>;

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center">
        <Header user={authUser} loading={false} />
        <div className="text-center py-20">
            <p className="text-xl font-bold text-slate-500">Không tìm thấy người dùng</p>
            <Link to="/" className="mt-4 text-sky-600 hover:underline">Về trang chủ</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={authUser} loading={false} />
      <main className="container mx-auto max-w-6xl px-4 py-8">
        
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-sky-600">Trang chủ</Link>
          <span>/</span>
          <span>Người dùng</span>
          <span>/</span>
          <span className="font-bold text-slate-900">{profile.full_name}</span>
        </div>

        <div className="grid gap-6 lg:grid-cols-12 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-4">
            <ProfileSidebar user={userUI} />
          </div>
          <div className="lg:col-span-8 space-y-8">
            
            {sellingBooksUI.length > 0 ? (
               <SellingBooksSection 
                  books={sellingBooksUI} 
                  totalCount={sellingBooksUI.length} 
               />
            ) : (
               <div className="bg-white p-10 text-center rounded-2xl border border-slate-200 shadow-sm text-slate-500 italic">
                  Người dùng này chưa đăng bán cuốn sách nào.
               </div>
            )}

            <div className="h-px bg-slate-200" />

            {/* Danh sách bài tìm sách */}
            {requestsUI.length > 0 ? (
               <FindRequestsSection requests={requestsUI} totalCount={requestsUI.length} />
            ) : (
               <div className="bg-white p-10 text-center rounded-2xl border border-slate-200 shadow-sm text-slate-500 italic">
                  Người dùng này chưa có yêu cầu tìm sách nào.
               </div>
            )}
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}