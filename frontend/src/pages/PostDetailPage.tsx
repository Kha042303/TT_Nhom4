import { useEffect, useState, useRef } from "react"; // Thêm useRef
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  Calendar, 
  MapPin, 
  MessageCircle, 
  Share2, 
  Flag, 
  ChevronLeft, 
  User as UserIcon,
  ShieldCheck,
  MoreHorizontal,
  Clock,
  X
} from "lucide-react";

// Components
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// API
import { getPostDetailApi, type PostFromDB } from "../api/post.api";
import { getUserByIdApi, type UserPublic } from "../api/user.api";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const authUser = JSON.parse(localStorage.getItem("user") || "null");

  const [post, setPost] = useState<PostFromDB | null>(null);
  const [author, setAuthor] = useState<UserPublic | null>(null);
  const [loading, setLoading] = useState(true);

  // State quản lý menu Avatar
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Ref để click ra ngoài thì đóng menu
  const menuRef = useRef<HTMLDivElement>(null);

  // Load dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const postData = await getPostDetailApi(id);
        setPost(postData);

        if (postData?.user_id) {
          const userData = await getUserByIdApi(postData.user_id);
          setAuthor(userData);
        }
      } catch (error) {
        console.error("Lỗi tải trang chi tiết:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleContact = () => {
    if (!authUser) {
      alert("Vui lòng đăng nhập để nhắn tin!");
      return;
    }
    if (author?.user_id) {
      navigate(`/chat?sellerId=${author.user_id}`);
    }
  };

  const authorAvatar = 
    `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.full_name || "User")}&background=random&color=fff`;

  const isOwner = authUser?.user_id === post?.user_id;

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Đang tải...</div>;

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <p className="font-bold text-slate-500">Bài viết không tồn tại.</p>
      <Link to="/" className="mt-4 text-sky-600 hover:underline">Về trang chủ</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={authUser} loading={false} />

      <main className="container mx-auto max-w-6xl px-4 py-8">
        
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <button onClick={() => navigate(-1)} className="flex items-center hover:text-sky-600 font-bold">
            <ChevronLeft size={16} /> Quay lại
          </button>
          <span>/</span>
          <span>Chi tiết bài đăng</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* === CỘT CHÍNH: NỘI DUNG (2/3) === */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                 <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">
                       {post.title}
                    </h1>
                    <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
                       <span className="flex items-center gap-1">
                          <Clock size={14} /> 
                          {post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : "Vừa xong"}
                       </span>
                       <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${post.status === 'visible' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                          {post.status === 'visible' ? 'Đang tìm kiếm' : 'Đã ẩn'}
                       </span>
                    </div>
                 </div>
                 <button className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal />
                 </button>
              </div>

              <div className="my-6 h-px bg-slate-100" />

              <div className="prose prose-slate max-w-none text-slate-800 whitespace-pre-wrap leading-relaxed">
                 {post.content}
              </div>

              {post.images && post.images.length > 0 && (
                <div className="mt-8 space-y-4">
                   {post.images.map((img, idx) => (
                      <div key={idx} className="rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
                         <img src={img} alt={`img-${idx}`} className="w-full h-auto object-contain max-h-[600px]" />
                      </div>
                   ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4">
               <button 
                 onClick={() => {
                   navigator.clipboard.writeText(window.location.href);
                   alert("Đã sao chép liên kết!");
                 }}
                 className="flex-1 rounded-xl bg-white border border-slate-200 px-4 py-3 font-bold text-slate-700 hover:bg-slate-50 shadow-sm flex items-center justify-center gap-2"
               >
                 <Share2 size={18} /> Chia sẻ
               </button>
           

<Link 
  to={`/report?type=post&id=${post.post_id}`} 
  className="rounded-xl bg-white border border-slate-200 px-4 py-3 font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 shadow-sm flex items-center justify-center gap-2 transition-colors"
>
  <Flag size={18} /> Báo cáo
</Link>
            </div>
          </div>

          {/* === CỘT PHỤ: THÔNG TIN NGƯỜI ĐĂNG (1/3) === */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Card thông tin */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sticky top-6 z-10">
               <div className="text-sm font-bold text-slate-400 uppercase mb-4 tracking-wider">Người đăng</div>
               
               <div className="flex flex-col items-center text-center">
                  
                  {/* 👇 AVATAR CÓ MENU POPUP 👇 */}
                  <div className="relative" ref={menuRef}>
                    <button 
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="relative group cursor-pointer focus:outline-none"
                    >
                       <img 
                         src={authorAvatar} 
                         alt="avatar" 
                         className="h-24 w-24 rounded-full object-cover border-4 border-slate-50 group-hover:border-sky-200 transition-colors shadow-sm" 
                       />
                       <div className="absolute bottom-1 right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white" title="Online"></div>
                    </button>

                    {/* MENU XEM TRANG CÁ NHÂN (Fix lỗi hiển thị) */}
                    {showUserMenu && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 rounded-xl border border-slate-200 bg-white shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                        {/* Mũi tên trỏ lên (trang trí) */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t border-l border-slate-200 transform rotate-45"></div>
                        
                        <div className="relative bg-white z-10">
                          <p className="text-xs text-slate-400 font-bold px-3 py-2 uppercase">Tùy chọn</p>
                          <Link 
                            to={`/profile/${author?.user_id}`}
                            className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-bold text-slate-700 hover:bg-sky-50 hover:text-sky-600 transition-colors"
                          >
                            <UserIcon size={18} /> Xem trang cá nhân
                          </Link>
                          {/* Nút đóng cho Mobile */}
                          <button 
                             onClick={() => setShowUserMenu(false)}
                             className="flex md:hidden items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                          >
                             <X size={18} /> Đóng
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* 👆 KẾT THÚC MENU 👆 */}

                  <Link to={`/profileid/${author?.user_id}`}>
                    <h3 className="mt-3 text-xl font-extrabold text-slate-900 hover:text-sky-600 transition-colors">
                      {author?.full_name || "Người dùng ẩn danh"}
                    </h3>
                  </Link>
                  
                  <div className="mt-1 flex items-center gap-1 text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                     <ShieldCheck size={14} className="text-sky-600" /> Thành viên uy tín
                  </div>

                  <div className="mt-6 w-full space-y-3">
                     <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
                        <span className="text-slate-500 flex items-center gap-2"><MapPin size={16}/> Khu vực</span>
                        <span className="font-semibold text-slate-700 truncate max-w-[150px]">{author?.address || "Toàn quốc"}</span>
                     </div>
                     <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
                        <span className="text-slate-500 flex items-center gap-2"><Calendar size={16}/> Tham gia</span>
                        <span className="font-semibold text-slate-700">
                          {author?.created_at ? new Date(author.created_at).getFullYear() : "2024"}
                        </span>
                     </div>
                  </div>

                  <div className="mt-6 w-full grid grid-cols-1 gap-3">
                     {isOwner ? (
                        <Link 
                          to={`/post/edit/${post.post_id}`}
                          className="w-full rounded-xl bg-slate-800 px-4 py-3 font-bold text-white shadow hover:bg-slate-900 flex items-center justify-center gap-2"
                        >
                           Chỉnh sửa bài viết
                        </Link>
                     ) : (
                        <>
                          <button 
                            onClick={handleContact}
                            className="w-full rounded-xl bg-sky-600 px-4 py-3 font-bold text-white shadow hover:bg-sky-700 flex items-center justify-center gap-2"
                          >
                             <MessageCircle size={18} /> Nhắn tin ngay
                          </button>
                          
                          <Link 
                            to={`/profile/${author?.user_id}`}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2"
                          >
                             <UserIcon size={18} /> Xem trang cá nhân
                          </Link>
                        </>
                     )}
                          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
               <div className="font-bold flex items-center gap-2 mb-2">
                  <Flag size={16} /> Lưu ý an toàn
               </div>
               <ul className="list-disc pl-5 space-y-1 opacity-90">
                  <li>Không chuyển khoản trước khi nhận sách.</li>
                  <li>Kiểm tra kỹ tình trạng sách trước khi giao dịch.</li>
                  <li>Nên giao dịch trực tiếp ở nơi công cộng.</li>
               </ul>
            </div>
                  </div>

               </div>
            </div>

            {/* Gợi ý an toàn */}
       

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}