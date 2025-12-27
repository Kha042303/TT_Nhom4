import { Link } from "react-router-dom";
import {
  BookOpen,
  MessageCircle,
  User2,
  ChevronDown,
  Crown,    // Icon Vương miện (VIP)
  Sparkles, // Icon Lấp lánh (Free)
} from "lucide-react";

// --- 1. ĐỊNH NGHĨA TYPE TRỰC TIẾP TẠI ĐÂY (Để sửa lỗi import) ---

interface Role {
  role_id: number;
  role_name: string;
}

interface UserRole {
  role_id: number;
  role?: Role;
}

// Định nghĩa User đầy đủ ngay trong file này
type User = {
  user_id: number;
  full_name?: string;
  email: string;
  // Các trường quan trọng để check VIP
  user_roles?: UserRole[]; 
  roles?: string[]; 
  plan_name?: string;
  plan?: string;
};

// --- 2. LOGIC XỬ LÝ ---

type HeaderProps = {
  user: User | null; // Sử dụng type User vừa định nghĩa ở trên
  loading: boolean;
};

function getPlanLabel(user: User | null) {
 console.log("Dữ liệu User hiện tại:", user); 
  console.log("User Roles:", user?.user_roles);
  if (!user) return "Free";

  // Check 1: Ưu tiên check Role ID = 2 (Seller) trong mảng user_roles
  // Backend trả về cấu trúc lồng nhau này
  if (user.user_roles && Array.isArray(user.user_roles)) {
    const isSeller = user.user_roles.some((ur) => ur.role_id === 2);
    if (isSeller) return "VIP";
  }

  // Check 2: Check theo tên (Dự phòng cho trường hợp cũ)
  let roleNames: string[] = [];
  
  // Lấy tên từ user_roles
  if (user.user_roles) {
    roleNames = user.user_roles
      .map((ur) => ur.role?.role_name)
      .filter((n): n is string => !!n);
  }
  // Lấy tên từ mảng roles phẳng
  if (user.roles) {
    roleNames = [...roleNames, ...user.roles];
  }

  const lowerRoles = roleNames.map(r => String(r).toLowerCase());
  
  if (lowerRoles.includes("seller")) return "VIP";
  if (lowerRoles.includes("vip") || lowerRoles.includes("premium")) return "VIP";
  if (lowerRoles.includes("admin")) return "Admin";

  // Check 3: Check tên gói dịch vụ
  if (user.plan_name) return user.plan_name;

  return "Free";
}

// --- 3. GIAO DIỆN ---

export default function Header({ user, loading }: HeaderProps) {
  const label = getPlanLabel(user);
  
  // Xác định VIP để đổi màu và icon
  const isVip = label === "VIP" || label === "Premium";
  const isAdmin = label === "Admin";

  return (
    <header className="bg-white border-b">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <BookOpen size={18} />
          </span>
          <span className="text-sky-600">Sách Cũ Trao Đổi</span>
        </Link>

        {/* Menu */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link className="hover:text-sky-600" to={!loading && user ? "/sell" : "/signin"}>Đăng Bán Sách</Link>
          <Link className="hover:text-sky-600" to="/community">Cộng Đồng</Link>
          <Link className="hover:text-sky-600" to="/about">Giới Thiệu</Link>
          <Link className="hover:text-sky-600" to="/contact">Liên Hệ</Link>
          <Link className="hover:text-sky-600" to="/report">Báo cáo</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link to={!loading && user ? "/chat" : "/signin"} className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100">
            <MessageCircle size={18} className="opacity-80" />
          </Link>

          {!loading && !user ? (
            <>
              <Link className="h-10 px-4 inline-flex items-center justify-center rounded-xl border border-sky-300 text-sky-600 hover:bg-sky-50" to="/signin">
                Đăng Nhập
              </Link>
              <Link className="h-10 px-4 inline-flex items-center justify-center rounded-xl bg-slate-900 text-white hover:opacity-90" to="/signup">
                Đăng Ký
              </Link>
            </>
          ) : null}

          {!loading && user ? (
            <div className="flex items-center gap-2">
              <Link to={`/user/${user.user_id}`} className="h-10 px-3 inline-flex items-center gap-2 rounded-xl border hover:bg-slate-50">
                <User2 size={18} className="opacity-80" />
                <span className="hidden sm:inline text-sm">
                  {user.full_name || user.email}
                </span>

                {/* --- HIỂN THỊ BADGE (VIP màu vàng, Free màu xám) --- */}
                <span
                  className={[
                    "hidden md:inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-extrabold border ml-1",
                    isVip 
                      ? "bg-yellow-100 text-yellow-700 border-yellow-300" // Style Vàng cho VIP
                      : isAdmin
                      ? "bg-red-100 text-red-700 border-red-300" // Style Đỏ cho Admin
                      : "bg-slate-100 text-slate-600 border-slate-200" // Style Xám cho Free
                  ].join(" ")}
                >
                  {/* Icon Vương miện nếu VIP */}
                  {isVip ? <Crown size={14} fill="currentColor" /> : 
                   isAdmin ? <Crown size={14} /> : 
                   <Sparkles size={14} />} 
                  {label}
                </span>
                
                <ChevronDown size={16} className="opacity-60" />
              </Link>
              
              {/* Chỉ hiện nút nâng cấp nếu chưa phải là VIP/Admin */}
              {!isVip && !isAdmin && (
                 <Link to="/upgrade" className="hidden sm:inline-flex h-10 px-4 items-center justify-center rounded-xl bg-sky-600 text-white font-extrabold hover:bg-sky-700 shadow">
                   Nâng cấp
                 </Link>
              )}

              <Link className="h-10 px-4 inline-flex items-center justify-center rounded-xl bg-slate-900 text-white hover:opacity-90" to="/logout">
                Đăng xuất
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}