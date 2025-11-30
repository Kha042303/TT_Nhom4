import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const categories = [
  "Văn học",
  "Giáo trình",
  "Khoa học",
  "Tiểu thuyết nước ngoài",
  "Thiếu nhi",
  "Sách chuyên ngành",
];

export default function BaiDang() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    location: "",
    condition: "Tốt",
    category: categories[0],
    description: "",
  });
  const [images, setImages] = useState([]); // data URLs
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleFile = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    Promise.all(
      files.map((file) => {
        return new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result);
          reader.onerror = rej;
          reader.readAsDataURL(file);
        });
      })
    ).then((dataUrls) => setImages(dataUrls));
  };

  const handleChange = (key) => (e) =>
    setForm((s) => ({ ...s, [key]: e.target.value }));

  const validate = () => {
    if (!form.title.trim()) return "Vui lòng nhập tiêu đề";
    if (!form.author.trim()) return "Vui lòng nhập tác giả";
    if (!form.price || Number(form.price) <= 0) return "Giá phải lớn hơn 0";
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError("");
    setSaving(true);

    const post = {
      id: Date.now(),
      ...form,
      price: Number(form.price),
      images,
      createdAt: new Date().toISOString(),
    };

    try {
      const prev = JSON.parse(localStorage.getItem("posts") || "[]");
      prev.unshift(post);
      localStorage.setItem("posts", JSON.stringify(prev));
      setSaving(false);
      // chuyển về trang chính hoặc danh sách bài đăng
      navigate("/");
    } catch (err) {
      setSaving(false);
      setError("Lưu bài đăng thất bại");
      console.error(err);
    }
  };

  return (
    <div className="container-fluid py-4 px-3 px-md-4">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm">
            <div className="card-body">
              <h4 className="card-title mb-3">Đăng bán sách</h4>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Tiêu đề</label>
                  <input
                    className="form-control"
                    value={form.title}
                    onChange={handleChange("title")}
                    placeholder="Ví dụ: Giáo trình Toán cao cấp"
                  />
                </div>

                <div className="row">
                  <div className="col-12 col-md-6 mb-3">
                    <label className="form-label">Tác giả</label>
                    <input
                      className="form-control"
                      value={form.author}
                      onChange={handleChange("author")}
                      placeholder="Tên tác giả"
                    />
                  </div>
                  <div className="col-6 col-md-3 mb-3">
                    <label className="form-label">Giá (VNĐ)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={form.price}
                      onChange={handleChange("price")}
                      min="0"
                    />
                  </div>
                  <div className="col-6 col-md-3 mb-3">
                    <label className="form-label">Tình trạng</label>
                    <select
                      className="form-select"
                      value={form.condition}
                      onChange={handleChange("condition")}
                    >
                      <option>Tốt</option>
                      <option>Mới 90%</option>
                      <option>Trầy xước nhẹ</option>
                      <option>Cũ</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Danh mục</label>
                  <select
                    className="form-select"
                    value={form.category}
                    onChange={handleChange("category")}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Địa điểm</label>
                  <input
                    className="form-control"
                    value={form.location}
                    onChange={handleChange("location")}
                    placeholder="Ví dụ: Hà Nội"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={form.description}
                    onChange={handleChange("description")}
                    placeholder="Mô tả ngắn về sách, năm xuất bản, tình trạng, ..."
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Hình ảnh (tối đa 4 ảnh)</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="form-control"
                    onChange={handleFile}
                  />
                  <div className="mt-2 d-flex flex-wrap gap-2">
                    {images.map((src, idx) => (
                      <div key={idx} className="border rounded" style={{ width: 100, height: 120, overflow: "hidden" }}>
                        <img src={src} alt={`preview-${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                    Hủy
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? "Đang lưu..." : "Đăng bán"}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}