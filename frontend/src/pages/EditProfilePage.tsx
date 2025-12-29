import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Save, X, User, Phone, MapPin, Loader2 } from "lucide-react";

// Components
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// API
import { getProfileApi, updateProfileApi } from "../api/user.api";

export default function EditProfilePage() {
  const navigate = useNavigate();
  
  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    address: "",
    email: "", // Email thường không cho sửa, chỉ để hiển thị
    avatar_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Lấy user từ localStorage để hiển thị Header
  const authUser = JSON.parse(localStorage.getItem("user") || "null");

  // 1. Tải thông tin hiện tại của user khi vào trang
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfileApi(); // Gọi API lấy thông tin chính mình
        // API trả về res.data hoặc res tùy cấu trúc, bạn kiểm tra lại nhé
        const data = res.data || res; 
        
        if (data) {
          setFormData({
            full_name: data.full_name || "",
            phone: data.phone || "",
            address: data.address || "",
            email: data.email || "",
            avatar_url: data.avatar || "", // Nếu chưa có, UI sẽ tự sinh avatar
          });
        }
      } catch (error) {
        console.error("Lỗi tải thông tin:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // 2. Xử lý khi nhập liệu
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 3. Xử lý khi bấm Lưu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Gọi API cập nhật
      await updateProfileApi({
        full_name: formData.full_name,
        phone: formData.phone,
        address: formData.address,
      });

      alert("Cập nhật hồ sơ thành công!");
      
      // Cập nhật lại localStorage nếu cần thiết để Header hiển thị tên mới ngay lập tức
      const newUser = { ...authUser, full_name: formData.full_name };
      localStorage.setItem("user", JSON.stringify(newUser));

      // Quay về trang cá nhân
      navigate(`/profile/${authUser?.user_id}`);
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setSaving(false);
    }
  };

  // Hàm tạo avatar giả nếu chưa có ảnh (giống trang Profile)
  const getAvatar = () => {
    if (formData.avatar_url) return formData.avatar_url;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.full_name || "User")}&background=random&color=fff&size=128&bold=true`;
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={authUser} loading={false} />

      <main className="container mx-auto max-w-2xl px-4 py-8">
        
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-sky-600">Trang chủ</Link>
          <span>/</span>
          <Link to={`/profile/${authUser?.user_id}`} className="hover:text-sky-600">Trang cá nhân</Link>
          <span>/</span>
          <span className="font-bold text-slate-900">Chỉnh sửa</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-sky-400 to-sky-700" />

          <div className="px-8 pb-8">
            {/* Avatar Section */}
            <div className="-mt-12 mb-6 flex justify-center">
               <div className="relative group cursor-pointer">
                  <img
                    src={getAvatar()}
                    alt="Avatar"
                    className="h-24 w-24 rounded-full border-4 border-white bg-white object-cover shadow-md"
                  />
                  {/* Nút đổi ảnh (Giả lập - vì backend chưa có upload ảnh) */}
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-all text-white text-xs font-bold">
                    Đổi ảnh
                  </div>
               </div>
            </div>

            <h1 className="text-2xl font-extrabold text-center text-slate-900 mb-8">
              Chỉnh sửa thông tin
            </h1>

            {/* FORM NHẬP LIỆU */}
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Họ tên */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <User size={16} className="text-sky-600" /> Họ và tên
                </label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                  placeholder="Nhập họ tên của bạn"
                />
              </div>

              {/* Số điện thoại */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Phone size={16} className="text-sky-600" /> Số điện thoại
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                  placeholder="Nhập số điện thoại"
                />
              </div>

              {/* Địa chỉ */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <MapPin size={16} className="text-sky-600" /> Địa chỉ
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 font-semibold text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all"
                  placeholder="Nhập địa chỉ (Quận/Huyện, Tỉnh/TP)"
                />
              </div>

              {/* Email (Read only) */}
              <div className="space-y-2 opacity-60">
                <label className="text-sm font-bold text-slate-700">Email (Không thể thay đổi)</label>
                <input
                  type="email"
                  value={formData.email}
                  readOnly
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 font-semibold text-slate-500 cursor-not-allowed"
                />
              </div>

              <div className="pt-4 flex items-center gap-4">
                {/* Nút Hủy */}
                <button
                  type="button"
                  onClick={() => navigate(-1)} // Quay lại trang trước
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 font-bold text-slate-700 hover:bg-slate-50 transition-colors flex justify-center items-center gap-2"
                >
                  <X size={18} /> Hủy bỏ
                </button>

                {/* Nút Lưu */}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-xl bg-sky-600 px-4 py-3 font-bold text-white shadow hover:bg-sky-700 disabled:opacity-70 disabled:cursor-not-allowed transition-all flex justify-center items-center gap-2"
                >
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}