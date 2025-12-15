import React, { useState } from "react";
// import { useAuth } from '../hooks/useAuth'; // Giả định có hook để lấy user_id

const API_BASE_URL = "/api";

const SellForm = () => {
  // const { user } = useAuth(); // Lấy thông tin user hiện tại
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    condition: "90", // Giữ nguyên là string để dễ xử lý form
    price: "",
    description: "",
    // location: '', // Thêm trường địa điểm nếu có
    files: [] as File[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dữ liệu danh mục tĩnh cho form
  const categories = ["Tiểu Thuyết", "Phi Hư Cấu", "Sách Giáo Khoa", "Khác"];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, files: Array.from(e.target.files) });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (!user || !user.user_id) return alert("Bạn cần đăng nhập để đăng bán.");
    setIsSubmitting(true);

    const data = new FormData();
    // data.append('user_id', user.user_id.toString()); // Gửi user_id
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("category", formData.category);
    data.append("price", formData.price || "0");
    data.append("description", formData.description);
    // data.append('condition', formData.condition); // Tình trạng có thể được tính toán từ mô tả hoặc lưu riêng

    formData.files.forEach((file) => {
      data.append("images", file); // 'images' là tên trường mà backend mong đợi
    });

    try {
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: "POST",
        // KHÔNG cần set Content-Type: 'multipart/form-data', vì FormData tự xử lý
        body: data,
        // headers: { 'Authorization': `Bearer ${token}` } // Cần gửi token xác thực
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Lỗi khi đăng bán sách");
      }

      alert("Sách đã được đăng bán thành công!");
      // Reset form và chuyển hướng
      // setFormData({ ...reset state... });
      // navigate('/');
    } catch (error) {
      // SỬA LỖI TẠI ĐÂY: Kiểm tra kiểu của 'error'
      let errorMessage = "Đã xảy ra lỗi không xác định.";

      if (error instanceof Error) {
        errorMessage = error.message; // An toàn để truy cập .message
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      alert(`Thất bại: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // [Phần JSX của form vẫn giữ nguyên, chỉ thay đổi input file]
    <form
      onSubmit={handleSubmit}
      className="p-8 bg-white rounded-lg shadow-lg max-w-3xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">
        Thông tin Sách
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label
            className="block text-gray-700 text-sm font-medium mb-1"
            htmlFor="title"
          >
            Tên sách (*)
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ví dụ: Nhà Giả Kim"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-chinh focus:border-chinh"
            required
          />
        </div>
        <div>
          <label
            className="block text-gray-700 text-sm font-medium mb-1"
            htmlFor="author"
          >
            Tác giả (*)
          </label>
          <input
            id="author"
            name="author"
            type="text"
            value={formData.author}
            onChange={handleChange}
            placeholder="Ví dụ: Paulo Coelho"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-chinh focus:border-chinh"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <label
            className="block text-gray-700 text-sm font-medium mb-1"
            htmlFor="category"
          >
            Danh mục (*)
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-chinh focus:border-chinh"
            required
          >
            <option value="">Chọn danh mục</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            className="block text-gray-700 text-sm font-medium mb-1"
            htmlFor="condition"
          >
            Tình trạng (%) (*)
          </label>
          <input
            id="condition"
            name="condition"
            type="number"
            min="0"
            max="100"
            value={formData.condition}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-chinh focus:border-chinh"
            required
          />
        </div>
        <div>
          <label
            className="block text-gray-700 text-sm font-medium mb-1"
            htmlFor="price"
          >
            Giá bán (hoặc để trống nếu đổi)
          </label>
          <input
            id="price"
            name="price"
            type="text"
            value={formData.price}
            onChange={handleChange}
            placeholder="Ví dụ: 50000 (đ)"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-chinh focus:border-chinh"
          />
        </div>
      </div>

      <div className="mb-6">
        <label
          className="block text-gray-700 text-sm font-medium mb-1"
          htmlFor="description"
        >
          Mô tả sách (*)
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          value={formData.description}
          onChange={handleChange}
          placeholder="Tình trạng, lý do bán/đổi, cần đổi lấy sách gì..."
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-chinh focus:border-chinh"
          required
        ></textarea>
      </div>

      <div className="mb-8">
        <label
          className="block text-gray-700 text-sm font-medium mb-2"
          htmlFor="imageUpload"
        >
          Ảnh Sách (*)
        </label>
        <input
          id="imageUpload"
          name="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange} // Sử dụng hàm handleFileChange
          className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-chinh file:text-white
                        hover:file:bg-phu"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Tải lên tối đa 5 ảnh (ảnh bìa, ảnh gáy, ảnh trang trong).
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting} // Vô hiệu hóa nút khi đang gửi
        className={`w-full py-3 text-white font-semibold rounded-md transition-colors ${
          isSubmitting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-chinh hover:bg-phu"
        }`}
      >
        {isSubmitting ? "Đang Đăng..." : "Đăng Bán Ngay"}
      </button>
    </form>
  );
};

export default SellForm;
