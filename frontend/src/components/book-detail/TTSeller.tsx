import { useState } from "react"; // [1] Import useState
import { useNavigate } from "react-router-dom"; // [2] Import hook điều hướng
import { Mail, MapPin, MessageSquareText, Phone, Star, ShieldCheck, User } from "lucide-react";
import type { SellerInfo } from "./types";

function statusText(s?: SellerInfo["status"]) {
  if (s === "active") return "Đang hoạt động";
  if (s === "inactive") return "Không hoạt động";
  if (s === "banned") return "Bị khóa";
  return "—";
}

export default function TTSeller({
  seller,
  onMessage,
  disabled,
}: {
  seller?: SellerInfo;
  onMessage?: () => void;
  disabled?: boolean;
}) {
  const navigate = useNavigate(); // Hook để chuyển trang
  const [showMenu, setShowMenu] = useState(false); // State quản lý menu toggle
  const handleViewProfile = () => {
    if (seller?.user_id) {
      // Giả sử đường dẫn trang cá nhân là /profile/:id
      // Bạn hãy sửa lại đường dẫn này theo đúng router của bạn (ví dụ: /user/detail/...)
      navigate(`/profileid/${seller.user_id}`); 
    }
    setShowMenu(false);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm font-extrabold text-slate-900">THÔNG TIN NGƯỜI BÁN</div>

        <div className="flex items-center gap-2">
          <span
            className={[
              "h-2 w-2 rounded-full",
              seller?.online ? "bg-emerald-500" : "bg-slate-300",
            ].join(" ")}
          />
          <span className="text-xs text-slate-500">{seller?.online ? "Online" : "Offline"}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        {/* --- [BẮT ĐẦU SỬA ĐỔI] --- */}
        {/* Bọc avatar trong div relative để định vị menu dropdown */}
        <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="h-12 w-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-sky-500 transition-all cursor-pointer"
              title="Click để xem tùy chọn"
            >
              {/* Nếu có ảnh thì hiển thị img, không thì hiện div rỗng hoặc icon mặc định */}
              {/* Ở đây đang giữ nguyên div rỗng như code cũ, bạn có thể thêm logic <img> */}
              <User size={24} className="text-slate-400" /> 
            </button>

            {/* Menu Dropdown hiển thị khi click */}
            {showMenu && (
              <div className="absolute top-14 left-0 z-10 w-48 rounded-lg border border-slate-200 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <div className="p-1">
                  <button
                    onClick={handleViewProfile}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-600 transition-colors"
                  >
                    <User size={16} />
                    <span>Xem trang cá nhân</span>
                  </button>
                  {/* Có thể thêm các nút khác vào đây, ví dụ: Báo cáo người dùng */}
                </div>
              </div>
            )}
            
            {/* Lớp phủ tàng hình để đóng menu khi click ra ngoài (Optional UI UX trick) */}
            {showMenu && (
              <div 
                className="fixed inset-0 z-0" 
                onClick={() => setShowMenu(false)}
              ></div>
            )}
        </div>
        {/* --- [KẾT THÚC SỬA ĐỔI] --- */}

        <div className="min-w-0">
          <div className="font-extrabold text-slate-900">
            {seller?.name ?? (
              <span className="inline-block h-5 w-40 bg-slate-100 animate-pulse rounded-md" />
            )}
          </div>

          <div className="text-sm text-slate-500">{seller?.joinedText ?? "—"}</div>

        
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-sm">
        <div className="flex items-start gap-2 text-slate-700">
          <Phone size={16} className="mt-0.5 text-slate-400" />
          <div className="min-w-0">
            <div className="text-xs text-slate-500">Số điện thoại</div>
            <div className="font-semibold break-words">{seller?.phone ?? "—"}</div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-slate-700">
          <Mail size={16} className="mt-0.5 text-slate-400" />
          <div className="min-w-0">
            <div className="text-xs text-slate-500">Email</div>
            <div className="font-semibold break-words">{seller?.email ?? "—"}</div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-slate-700">
          <MapPin size={16} className="mt-0.5 text-slate-400" />
          <div className="min-w-0">
            <div className="text-xs text-slate-500">Địa chỉ</div>
            <div className="font-semibold break-words">{seller?.address ?? "—"}</div>
          </div>
        </div>

        <div className="flex items-start gap-2 text-slate-700">
          <ShieldCheck size={16} className="mt-0.5 text-slate-400" />
          <div className="min-w-0">
            <div className="text-xs text-slate-500">Trạng thái</div>
            <div className="font-semibold break-words">{statusText(seller?.status)}</div>
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={!!disabled}
        onClick={onMessage}
        className={[
          "mt-5 w-full rounded-xl px-4 py-3 font-extrabold text-white shadow inline-flex items-center justify-center gap-2",
          disabled ? "bg-slate-300 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-700",
        ].join(" ")}
      >
        <MessageSquareText size={18} />
        Nhắn tin cho người bán
      </button>

      <div className="mt-3 text-center text-xs text-slate-500">Thường phản hồi trong vòng 5 phút</div>
    </div>
  );
}