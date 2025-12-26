import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// Components
import ProfileSidebar from "../components/userinfo/Profile";
import SellingBooksSection from "../components/userinfo/BookSell";
import FindRequestsSection from "../components/userinfo/FindBook";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// Types
import type { UserInfoUI, SellingBookUI, FindRequestUI } from "../components/userinfo/types";

// APIs (Lưu ý dùng import type cho các Interface)
import { getUserByIdApi, type UserPublic } from "../api/user.api";
import { listBooksApi, type Book } from "../api/book.api";
import { listPostsApi, type PostFromDB } from "../api/post.api";

export default function UserInfoPage() {
  const { id } = useParams<{ id: string }>();
  // Lấy user đang đăng nhập từ localStorage để truyền vào Header
  const authUser = JSON.parse(localStorage.getItem("user") || "null");

  const [profile, setProfile] = useState<UserPublic | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [posts, setPosts] = useState<PostFromDB[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [userRes, booksRes, postsRes] = await Promise.all([
          getUserByIdApi(id),
          listBooksApi({ userId: id, limit: 10 }),
          listPostsApi({ userId: id, limit: 10 })
        ]);

        setProfile(userRes);
        // booksRes có thể trả về { books: [...] } hoặc mảng tùy api response, check kỹ
        setBooks(booksRes.books || []); 
        setPosts(postsRes.data || []);
      } catch (error) {
        console.error("Lỗi tải trang cá nhân:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // --- MAPPING DATA (Quan trọng: Phải khớp với types.ts) ---

  const userUI: UserInfoUI | undefined = profile ? {
    // Không có 'id', 'stats' trong UserInfoUI nên không thêm vào
    full_name: profile.full_name || `User #${profile.user_id}`,
    badge: "Thành viên", // Hardcode tạm hoặc logic dựa trên role
    bio: "Chưa có giới thiệu...", // API chưa trả về bio
    phone: profile.phone || "Chưa cập nhật",
    email: profile.email || "Chưa cập nhật",
    location: profile.address || "Chưa cập nhật",
    joined_text: profile.created_at ? `Tham gia từ ${new Date(profile.created_at).toLocaleDateString('vi-VN')}` : "Thành viên mới",
    avatar_url: "https://via.placeholder.com/150", // API chưa trả avatar
  } : undefined;

  const sellingBooksUI: SellingBookUI[] = books.map(b => ({
    id: b.book_id,
    title: b.title,
    author: b.author,
    price: b.price,
    condition_badge: b.status === 'active' ? 'Mới 99%' : 'Đã qua sử dụng', // Logic giả lập
    // Xử lý ảnh: nếu là mảng lấy ảnh đầu, nếu là string dùng luôn
    cover_url: Array.isArray(b.image_url) && b.image_url.length > 0 
      ? b.image_url[0] 
      : (typeof b.image_url === 'string' ? b.image_url : "")
  }));

  // Map bài viết (Post) sang giao diện Yêu cầu tìm sách (FindRequestUI)
  // Vì bạn đang tái sử dụng component FindBook để hiện bài viết
  const requestsUI: FindRequestUI[] = posts.map(p => ({
    id: p.post_id,
    title: p.title,
    content: p.content || "",
    status_badge: p.status === 'visible' ? "Đang Tìm Kiếm" : "Đã Ẩn",
    created_at_text: p.created_at ? new Date(p.created_at).toLocaleDateString('vi-VN') : "",
    likes: 0,    // API chưa có
    comments: 0  // API chưa có
  }));

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải thông tin...</div>;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-100">
        <Header user={authUser} loading={false} />
        <div className="flex flex-col items-center justify-center py-20 text-red-500">
          <p className="text-xl font-bold">Không tìm thấy người dùng này</p>
          <a href="/" className="mt-4 text-sky-600 hover:underline">Quay về trang chủ</a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <Header user={authUser} loading={false} />

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* Cột trái: Thông tin Profile */}
          <div className="lg:col-span-4">
            <ProfileSidebar user={userUI} />
          </div>

          {/* Cột phải: Danh sách Sách & Bài viết */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Component Sách đang bán */}
            {sellingBooksUI.length > 0 ? (
               <SellingBooksSection books={sellingBooksUI} totalCount={sellingBooksUI.length} />
            ) : (
               <div className="bg-white p-6 rounded-2xl shadow-sm text-slate-500 italic text-center">
                  Người dùng này chưa đăng bán cuốn sách nào.
               </div>
            )}

            {/* Component Bài viết (Dùng giao diện FindRequestsSection) */}
            {requestsUI.length > 0 ? (
               <FindRequestsSection requests={requestsUI} totalCount={requestsUI.length} />
            ) : (
               <div className="bg-white p-6 rounded-2xl shadow-sm text-slate-500 italic text-center">
                  Người dùng này chưa có bài đăng nào.
               </div>
            )}
            
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}