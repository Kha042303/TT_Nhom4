// ...existing code...
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { Menu, Search, MessageSquare, LifeBuoy, ShoppingCart } from "lucide-react";
import BaiDang from "./pages/BaiDang";

function App() {
  // user lưu tạm vào localStorage
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  });

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Tất cả");
  const [showPostModal, setShowPostModal] = useState(false);

  // mới: modal đăng nhập / đăng ký
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // form state
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    // ví dụ đơn giản: chấp nhận mọi thông tin, lưu vào localStorage
    const u = { name: loginForm.email.split("@")[0] || "Người dùng", email: loginForm.email };
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
    setShowLogin(false);
    setLoginForm({ email: "", password: "" });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const u = { name: registerForm.name || registerForm.email.split("@")[0], email: registerForm.email };
    localStorage.setItem("user", JSON.stringify(u));
    setUser(u);
    setShowRegister(false);
    setRegisterForm({ name: "", email: "", password: "" });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const categories = [
    "Tất cả",
    "Văn học",
    "Giáo trình",
    "Khoa học",
    "Tiểu thuyết nước ngoài",
    "Thiếu nhi",
    "Sách chuyên ngành",
  ];

  const sampleBooks = new Array(12).fill(0).map((_, i) => ({
    id: i + 1,
    title: `Sách cũ mẫu #${i + 1}`,
    author: `Tác giả ${i + 1}`,
    price: (30 - (i % 10)) * 1000,
    location: ["Hà Nội", "TP HCM", "Đà Nẵng"][i % 3],
    condition: ["Mới 90%", "Tốt", "Trầy xước nhẹ"][i % 3],
    img: `https://picsum.photos/seed/book${i + 1}/400/520`,
    category: categories[(i % categories.length) || 0],
  }));

  const filtered = sampleBooks.filter((b) => {
    const q = `${b.title} ${b.author}`.toLowerCase();
    return (
      q.includes(query.toLowerCase()) &&
      (category === "Tất cả" || b.category === category)
    );
  });

  return (
    <BrowserRouter>
      <>
        {/* HEADER */}
        <header className="shadow-sm bg-white sticky-top">
          <div className="container py-3 d-flex align-items-center gap-3">

            {/* Logo */}
            <div className="d-flex align-items-center gap-2">
              <div className="rounded bg-primary text-white d-flex align-items-center justify-content-center"
                style={{ width: 40, height: 40, fontWeight: "bold" }}>
                SB
              </div>
              <div>
                <h5 className="m-0 fw-bold">Sách Cũ Marketplace</h5>
                <small className="text-muted">Mua bán sách cũ nhanh chóng</small>
              </div>
            </div>

            {/* Search */}
            <div className="flex-grow-1">
              <div className="input-group">
                <span className="input-group-text"><Search size={18} /></span>

                <input
                  className="form-control"
                  placeholder="Tìm sách, tác giả..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />

                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                {/* đổi nút Đăng bài sang NavLink tới trang /baidang */}
                <NavLink to="/baidang" className="btn btn-success">Đăng bài</NavLink>
              </div>
            </div>

            {/* Actions */}
            <div className="d-flex align-items-center gap-2">
              <button className="btn btn-light d-none d-md-inline">
                <MessageSquare size={18} /> Chat
              </button>

              <button className="btn btn-light d-none d-md-inline">
                <LifeBuoy size={18} /> Hỗ trợ
              </button>

              <button className="btn btn-light">
                <ShoppingCart size={18} />
              </button>

              {/* mới: nút Đăng nhập / Đăng ký hoặc tên user */}
              {!user ? (
                <>
                  <button className="btn btn-outline-primary" onClick={() => setShowLogin(true)}>Đăng nhập</button>
                  <button className="btn btn-primary" onClick={() => setShowRegister(true)}>Đăng ký</button>
                </>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-light text-dark">{user.name}</span>
                  <button className="btn btn-sm btn-outline-secondary" onClick={handleLogout}>Đăng xuất</button>
                </div>
              )}
            </div>
          </div>

          {/* MENU BAR */}
          <nav className="border-top bg-white">
            <div className="container py-2 d-flex gap-4">
              <NavLink to="/" end className={({isActive}) => isActive ? "text-primary text-decoration-none" : "text-secondary text-decoration-none"}>Trang chủ</NavLink>
              <a href="#" className="text-secondary text-decoration-none">Danh mục</a>
              {/* NavLink cho Bài đăng */}
              <NavLink to="/baidang" className={({isActive}) => isActive ? "text-primary text-decoration-none" : "text-secondary text-decoration-none"}>Bài đăng</NavLink>
              <a href="#" className="text-secondary text-decoration-none">Chat</a>
              <a href="#" className="text-secondary text-decoration-none">Hỗ trợ</a>
            </div>
          </nav>
        </header>

        {/* ROUTES: hiển thị trang chính hoặc trang đăng bài */}
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* MAIN */}
                <main className="container py-4">
                  <div className="row g-4">

                    {/* Sidebar */}
                    <aside className="col-lg-3">
                      <div className="border rounded p-3 bg-white">
                        <h6 className="fw-bold mb-3">Danh mục</h6>

                        {categories.map((c) => (
                          <button
                            key={c}
                            className={`btn w-100 text-start mb-2 ${category === c ? "btn-primary" : "btn-light"}`}
                            onClick={() => setCategory(c)}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </aside>

                    {/* Products */}
                    <section className="col-lg-9">
                      <h4 className="fw-bold mb-3">Kết quả ({filtered.length})</h4>

                      <div className="row g-4">
                        {filtered.map((b) => (
                          <div key={b.id} className="col-12 col-sm-6 col-lg-4">
                            <div className="card h-100 shadow-sm">
                              <img src={b.img} className="card-img-top" alt="" />

                              <div className="card-body">
                                <h6 className="card-title mb-1">{b.title}</h6>
                                <small className="text-muted">
                                  {b.author} – {b.condition}
                                </small>

                                <div className="mt-3 d-flex justify-content-between align-items-center">
                                  <div>
                                    <div className="text-primary fw-bold">
                                      {b.price.toLocaleString()}₫
                                    </div>
                                    <small className="text-muted">{b.location}</small>
                                  </div>

                                  <button className="btn btn-outline-secondary btn-sm">
                                    Xem
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                </main>
              </>
            }
          />
          <Route path="/baidang" element={<BaiDang/>} />
        </Routes>

        {/* FOOTER */}
        <footer className="border-top py-3 bg-white text-center">
          <small className="text-muted">
            © {new Date().getFullYear()} Sách Cũ Marketplace.
          </small>
        </footer>

        {/* existing modals (login/register/post) */}
        {showPostModal && (
          <div className="modal-backdrop-custom">
            <div className="modal-custom">
              <h5 className="mb-3 fw-bold">Đăng sách mới</h5>

              <input className="form-control mb-2" placeholder="Tiêu đề" />
              <input className="form-control mb-2" placeholder="Tác giả" />
              <textarea className="form-control mb-2" placeholder="Mô tả"></textarea>

              <div className="d-flex justify-content-end gap-2">
                <button className="btn btn-outline-secondary"
                  onClick={() => setShowPostModal(false)}>Hủy</button>
                <button className="btn btn-primary">Đăng</button>
              </div>
            </div>
          </div>
        )}

        {showLogin && (
          <div className="modal-backdrop-custom">
            <div className="modal-custom">
              <h5 className="mb-3 fw-bold">Đăng nhập</h5>
              <form onSubmit={handleLogin}>
                <input
                  className="form-control mb-2"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
                <input
                  type="password"
                  className="form-control mb-2"
                  placeholder="Mật khẩu"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                />
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowLogin(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary">Đăng nhập</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showRegister && (
          <div className="modal-backdrop-custom">
            <div className="modal-custom">
              <h5 className="mb-3 fw-bold">Đăng ký</h5>
              <form onSubmit={handleRegister}>
                <input
                  className="form-control mb-2"
                  placeholder="Tên"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
                <input
                  type="password"
                  className="form-control mb-2"
                  placeholder="Mật khẩu"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                />
                <div className="d-flex justify-content-end gap-2">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowRegister(false)}>Hủy</button>
                  <button type="submit" className="btn btn-primary">Đăng ký</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    </BrowserRouter>
  );
}

export default App;
// ...existing code...