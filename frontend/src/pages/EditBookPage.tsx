import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Save, X, Image as ImageIcon, Loader2, ChevronLeft } from "lucide-react";

// Components
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// API
import { getBookDetailApi, editBookApi, type Book } from "../api/book.api";

export default function EditBookPage() {
  const { id } = useParams<{ id: string }>(); // Lấy ID sách từ URL
  const navigate = useNavigate();
  const authUser = JSON.parse(localStorage.getItem("user") || "null");

  // State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Dữ liệu form
  const [formData, setFormData] = useState<{
    title: string;
    author: string;
    price: string; // Để string cho dễ nhập liệu, khi gửi sẽ parse sang number
    category: string;
    status: "active" | "inactive";
    description: string;
    existingImages: string[]; // Ảnh cũ từ server
  }>({
    title: "",
    author: "",
    price: "",
    category: "Văn học",
    status: "active",
    description: "",
    existingImages: [],
  });

  // Ảnh mới (upload thêm)
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // 1. Load thông tin sách khi vào trang
  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      try {
        const book = await getBookDetailApi(id);
        
        // Kiểm tra quyền sở hữu (chỉ chủ sách mới được sửa)
        if (authUser?.user_id && book.user_id !== authUser.user_id) {
            alert("Bạn không có quyền sửa cuốn sách này!");
            navigate("/");
            return;
        }

        // Điền dữ liệu vào form
        setFormData({
          title: book.title || "",
          author: book.author || "",
          price: book.price ? String(book.price) : "",
          category: book.category || "Văn học",
          status: book.status || "active",
          description: book.description || "",
          // Xử lý ảnh cũ
          existingImages: Array.isArray(book.image_url) 
            ? book.image_url 
            : (typeof book.image_url === "string" ? [book.image_url] : [])
        });
      } catch (error) {
        console.error("Lỗi tải sách:", error);
        alert("Không tìm thấy sách hoặc lỗi kết nối.");
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id, navigate, authUser?.user_id]);

  // 2. Xử lý nhập liệu text
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 3. Xử lý chọn ảnh mới
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setNewFiles(prev => [...prev, ...files]);

      // Tạo preview cho ảnh mới
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviews]);
    }
  };

  // 4. Xử lý Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);

    try {
      await editBookApi(id, {
        title: formData.title,
        author: formData.author,
        category: formData.category,
        description: formData.description,
        status: formData.status,
        price: Number(formData.price), // Chuyển về số
        images: newFiles, // Gửi file ảnh mới lên (Backend sẽ xử lý)
      });

      alert("Cập nhật sách thành công!");
      // Quay về trang cá nhân của mình
      navigate(`/profile/${authUser?.user_id}`);
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Có lỗi xảy ra khi lưu sách.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={authUser} loading={false} />

      <main className="container mx-auto max-w-3xl px-4 py-8">
        
        {/* Nút quay lại */}
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-sky-600 transition-colors">
          <ChevronLeft size={16} /> Quay lại
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4 bg-slate-50">
            <h1 className="text-xl font-extrabold text-slate-900">Chỉnh sửa thông tin sách</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Tên sách & Tác giả */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Tên sách <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Tác giả</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
              </div>
            </div>

            {/* Giá & Thể loại */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Giá bán (VNĐ) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="price"
                  required
                  min={0}
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Thể loại</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 bg-white"
                >
                  <option value="Văn học">Văn học</option>
                  <option value="Kinh tế">Kinh tế</option>
                  <option value="Kỹ năng sống">Kỹ năng sống</option>
                  <option value="Truyện tranh">Truyện tranh</option>
                  <option value="Giáo trình">Giáo trình</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>

            {/* Trạng thái & Mô tả */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Trạng thái tin đăng</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200 bg-white"
                >
                  <option value="active">Đang hiển thị (Active)</option>
                  <option value="inactive">Ẩn tin (Inactive)</option>
                </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Mô tả chi tiết</label>
              <textarea
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
                placeholder="Tình trạng sách, số trang, năm xuất bản..."
              />
            </div>

            {/* QUẢN LÝ ẢNH */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">Hình ảnh</label>
              
              {/* Ảnh hiện tại */}
              {formData.existingImages.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs text-slate-500 mb-2">Ảnh hiện tại:</p>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {formData.existingImages.map((url, idx) => (
                      <div key={idx} className="relative h-20 w-20 flex-shrink-0 rounded-lg border border-slate-200 overflow-hidden">
                        <img src={url} alt="Old" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload ảnh mới */}
              <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center hover:bg-slate-100 transition-colors relative">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                <div className="flex flex-col items-center justify-center text-slate-500">
                  <ImageIcon size={32} className="mb-2 text-slate-400" />
                  <span className="text-sm font-bold text-slate-600">Thêm ảnh mới</span>
                  <span className="text-xs">Click để tải lên (Thay thế hoặc bổ sung tùy backend)</span>
                </div>
              </div>

              {/* Preview ảnh mới */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {previewUrls.map((url, idx) => (
                    <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                      <img src={url} alt="New" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-4 flex items-center gap-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors"
              >
                <X size={18} /> Hủy
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex-[2] rounded-xl bg-sky-600 px-4 py-3 font-bold text-white shadow hover:bg-sky-700 flex items-center justify-center gap-2 transition-colors disabled:opacity-70"
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