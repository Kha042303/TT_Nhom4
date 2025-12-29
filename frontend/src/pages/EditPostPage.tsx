import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, X, ChevronLeft, Loader2, Image as ImageIcon, Trash2 } from "lucide-react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { getPostDetailApi, editPostApi } from "../api/post.api";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const authUser = JSON.parse(localStorage.getItem("user") || "null");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State quản lý dữ liệu text
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "visible", 
  });

  // State quản lý ảnh
  const [existingImages, setExistingImages] = useState<string[]>([]); // Ảnh cũ từ server
  const [newFiles, setNewFiles] = useState<File[]>([]); // Ảnh mới chọn từ máy
  const [previewUrls, setPreviewUrls] = useState<string[]>([]); // Link preview ảnh mới

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      try {
        const post = await getPostDetailApi(id);
        
        // Check quyền sở hữu
        if (authUser?.user_id && post.user_id !== authUser.user_id) {
           alert("Bạn không có quyền sửa bài này!");
           navigate("/");
           return;
        }

        setFormData({
          title: post.title || "",
          content: post.content || "",
          status: post.status || "visible",
        });

        // Load ảnh cũ (nếu có)
        if (post.images && Array.isArray(post.images)) {
            setExistingImages(post.images);
        }

      } catch (error) {
        console.error("Lỗi tải bài viết:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id, authUser?.user_id, navigate]);

  // Xử lý chọn ảnh mới
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setNewFiles(prev => [...prev, ...files]);

      // Tạo url preview
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...urls]);
    }
  };

  // Xóa ảnh mới chọn (nếu lỡ chọn nhầm)
  const removeNewImage = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    try {
      await editPostApi(id, {
        ...formData,
        images: newFiles // Gửi kèm ảnh mới lên server
      });
      alert("Cập nhật thành công!");
      navigate(`/profile/${authUser?.user_id}`);
    } catch (error) {
      console.error("Lỗi lưu:", error);
      alert("Lỗi khi lưu bài viết.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={authUser} loading={false} />
      <main className="container mx-auto max-w-2xl px-4 py-8">
        
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-sky-600">
          <ChevronLeft size={16} /> Quay lại
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4 bg-slate-50">
            <h1 className="text-xl font-extrabold text-slate-900">Chỉnh sửa bài viết</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* 1. Tiêu đề */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Tiêu đề</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>

            {/* 2. Trạng thái */}
            <div className="space-y-2">
               <label className="text-sm font-bold text-slate-700">Trạng thái</label>
               <select
                 value={formData.status}
                 onChange={(e) => setFormData({...formData, status: e.target.value})}
                 className="w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none bg-white"
               >
                 <option value="visible">Đang tìm kiếm (Visible)</option>
                 <option value="hidden">Đã tìm thấy / Ẩn (Hidden)</option>
               </select>
            </div>

            {/* 3. Nội dung */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Nội dung chi tiết</label>
              <textarea
                rows={5}
                required
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 font-medium outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              />
            </div>

            {/* 4. QUẢN LÝ HÌNH ẢNH (Phần bổ sung) */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">Hình ảnh đính kèm</label>
              
              {/* Ảnh cũ (nếu có) */}
              {existingImages.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs text-slate-500 mb-2">Ảnh hiện có:</p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {existingImages.map((url, idx) => (
                      <div key={idx} className="relative h-20 w-20 flex-shrink-0 rounded-lg border border-slate-200 overflow-hidden group">
                        <img src={url} alt="old" className="h-full w-full object-cover" />
                        {/* Nếu backend hỗ trợ xóa từng ảnh thì thêm nút xóa vào đây */}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Khu vực upload ảnh mới */}
              <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:bg-slate-100 transition-colors relative group">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <div className="flex flex-col items-center justify-center text-slate-500 group-hover:text-sky-600 transition-colors">
                  <ImageIcon size={32} className="mb-2" />
                  <span className="text-sm font-bold">Thêm ảnh mới</span>
                  <span className="text-xs opacity-70">Click để tải lên</span>
                </div>
              </div>

              {/* Preview ảnh mới chọn */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {previewUrls.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                      <img src={url} alt="preview" className="h-full w-full object-cover" />
                      
                      {/* Nút xóa ảnh mới chọn */}
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="pt-4 flex items-center gap-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-700 hover:bg-slate-50 flex justify-center gap-2"
              >
                <X size={18} /> Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-[2] rounded-xl bg-sky-600 px-4 py-3 font-bold text-white shadow hover:bg-sky-700 flex justify-center gap-2 disabled:opacity-70"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}