// components/userinfo/ItemBookSell.tsx

import { useState } from "react";
import { Heart, Edit, Trash2, Loader2 } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import type { SellingBookUI } from "./types";
import { deleteBookApi } from "../../api/book.api"; // Import API vừa viết

function formatVND(n?: number) {
  if (typeof n !== "number") return undefined;
  return new Intl.NumberFormat("vi-VN").format(n) + "đ";
}

export default function ItemBookSell({ 
  book, 
  onDeleted // Callback để báo cho trang cha biết là đã xóa xong để load lại list
}: { 
  book?: SellingBookUI;
  onDeleted?: () => void; 
}) {
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  // Xử lý chuyển trang Sửa
  const onEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn click vào card
    if (book?.id) {
      navigate(`/book/edit/${book.id}`); // Bạn cần tạo trang này sau
    }
  };

  // Xử lý Xóa
  const onDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!book?.id) return;

    if (window.confirm(`Bạn có chắc chắn muốn xóa cuốn sách "${book.title}" không?`)) {
      setIsDeleting(true);
      try {
        await deleteBookApi(book.id);
        alert("Đã xóa thành công!");
        
        // Gọi callback để trang cha (UserInfoPage) cập nhật lại danh sách
        if (onDeleted) onDeleted();
      } catch (error) {
        console.error("Lỗi xóa sách:", error);
        alert("Xóa thất bại, vui lòng thử lại.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden group relative">
      
      <div className="relative aspect-[4/3] bg-slate-100">
        <img src={book?.cover_url} alt="" className="h-full w-full object-cover" />
        
        {book?.isOwner && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button 
                  onClick={onEdit} 
                  className="p-3 bg-white rounded-full text-slate-700 hover:text-sky-600 hover:scale-110 transition-transform shadow-lg"
                  title="Chỉnh sửa"
                >
                    <Edit size={20} />
                </button>
                
                <button 
                  onClick={onDelete} 
                  disabled={isDeleting}
                  className="p-3 bg-white rounded-full text-slate-700 hover:text-red-600 hover:scale-110 transition-transform shadow-lg"
                  title="Xóa sách"
                >
                    {isDeleting ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                </button>
            </div>
        )}
      </div>

      <div className="p-4">
        <div className="font-extrabold line-clamp-1 text-slate-900">{book?.title}</div>
        <div className="text-sky-600 font-bold mt-2">{formatVND(book?.price)}</div>
      </div>
    </div>
  );
}