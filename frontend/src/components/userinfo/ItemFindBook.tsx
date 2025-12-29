import { useState } from "react";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { FindRequestUI } from "./types";
import { deletePostApi } from "../../api/post.api"; 

export default function ItemFindBook({ 
  request, 
  onDeleted 
}: { 
  request?: FindRequestUI; 
  onDeleted?: () => void; 
}) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const status = request?.status_badge;
  
  // Lấy danh sách ảnh (nếu không có thì trả về mảng rỗng)
  const images = request?.images || [];

  // Xử lý chuyển trang Sửa
  const handleEdit = () => {
    if (request?.id) navigate(`/post/edit/${request.id}`);
  };

  // Xử lý Xóa bài viết
  const handleDelete = async () => {
    if (!request?.id) return;
    // eslint-disable-next-line no-restricted-globals
    if (confirm("Bạn có chắc muốn xóa bài đăng này?")) {
      setIsDeleting(true);
      try {
        await deletePostApi(request.id);
        alert("Đã xóa bài viết!");
        // Gọi callback để trang cha load lại dữ liệu
        if (onDeleted) onDeleted();
      } catch (error) {
        console.error("Lỗi xóa bài:", error);
        alert("Xóa thất bại!");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden relative group">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          
          {/* --- THÔNG TIN NGƯỜI DÙNG --- */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-slate-100 border border-slate-200 overflow-hidden">
               <img 
                 src={request?.user_avatar} 
                 alt="avatar" 
                 className="h-full w-full object-cover"
                 onError={(e) => {
                   (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=User&background=random";
                 }}
               />
            </div>
            <div>
              <div className="font-extrabold text-slate-900">
                {request?.user_name || "Người dùng"}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {request?.created_at_text ?? "Vừa xong"}
              </div>
            </div>
          </div>

          {/* --- TRẠNG THÁI & NÚT HÀNH ĐỘNG --- */}
          <div className="flex items-center gap-2">
            <span
              className={[
                "rounded-full px-3 py-1 text-xs font-extrabold",
                status === "Đã Tìm Thấy" || status === "Đã Ẩn"
                  ? "bg-slate-100 text-slate-700"
                  : "bg-orange-50 text-orange-700",
              ].join(" ")}
            >
              {status ?? "Đang Tìm Kiếm"}
            </span>

            {/* Chỉ hiện nút Sửa/Xóa nếu là chủ sở hữu */}
            {request?.isOwner && (
              <div className="flex items-center gap-1 ml-2">
                <button 
                  onClick={handleEdit}
                  className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-full transition-colors"
                  title="Chỉnh sửa"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Xóa bài"
                >
                  {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- TIÊU ĐỀ & NỘI DUNG --- */}
        <div className="mt-4 text-lg font-extrabold text-slate-900">
          {request?.title ?? "..."}
        </div>
        <div className="mt-2 text-slate-600 leading-relaxed whitespace-pre-wrap">
           <p>{request?.content}</p>
        </div>

        {/* --- DANH SÁCH ẢNH --- */}
        {images.length > 0 && (
          <div className={`mt-4 grid gap-2 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'}`}>
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className={`relative rounded-xl overflow-hidden border border-slate-100 bg-slate-50 ${images.length === 1 ? 'aspect-video' : 'aspect-square'}`}
              >
                <img 
                  src={img} 
                  alt={`post-img-${idx}`} 
                  className="h-full w-full object-cover hover:scale-105 transition-transform duration-300" 
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 h-px bg-slate-200" />
      </div>
    </div>
  );
}