// src/pages/Signin.tsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Header from "../components/layout/Header";
import { loginApi, profileApi, type User } from "../api/auth.api";

function safeGetTokenFromStorage() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token") ||
    ""
  );
}

function hasAdminRole(u: any) {
  if (Array.isArray(u?.user_roles)) {
    return u.user_roles.some(
      (ur: any) =>
        ur?.is_active === true &&
        (ur?.role?.role_name === "admin" || Number(ur?.role_id) === 3)
    );
  }
  if (Array.isArray(u?.roles)) return u.roles.includes("admin");
  return false;
}

export default function Signin() {
  const nav = useNavigate();

  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [loading, setLoading] = useState(false); // không auto profile ở trang signin (tránh spam 403)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // nếu đã có token thì có thể tự về home
    const t = safeGetTokenFromStorage();
    if (t) {
      // optional: bạn muốn kiểm tra token hợp lệ thì bật profile ở đây
      // void profileApi().then(...).catch(...)
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const { token, user: u } = await loginApi(email.trim(), password);

      if (!token) throw new Error("Đăng nhập không nhận được token (kiểm tra response BE)");

      //  lưu cả 2 key cho các chỗ khác khỏi lệch
      localStorage.setItem("token", token);
      localStorage.setItem("accessToken", token);

      let finalUser = (u as User | null) ?? null;

      // nếu login không trả user => gọi profile
      if (!finalUser) {
        finalUser = await profileApi();
      }

      localStorage.setItem("user", JSON.stringify(finalUser));
      setUser(finalUser);

      toast.success("Đăng nhập thành công!");
      if (hasAdminRole(finalUser)) nav("/admin");
      else nav("/");
    } catch (err: any) {
      toast.error(err?.message || "Đăng nhập thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header user={user} loading={loading} />

      <main className="min-h-[calc(100vh-4rem)] flex items-start justify-center px-4 py-14">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md rounded-2xl bg-white border shadow-[0_10px_30px_rgba(0,0,0,0.12)] overflow-hidden"
        >
          <div className="bg-gradient-to-r from-sky-500 to-sky-400 px-6 py-4 text-center">
            <h1 className="text-xl font-bold text-white">Đăng Nhập</h1>
          </div>

          <div className="px-6 py-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn..."
                autoComplete="email"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Mật khẩu</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                type="password"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              disabled={submitting}
              className="w-full mt-2 rounded-full bg-gradient-to-r from-sky-500 to-sky-400 px-4 py-3 font-semibold text-white shadow hover:opacity-95 disabled:opacity-60"
              type="submit"
            >
              {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            <div className="pt-2 flex items-center justify-between text-sm">
              <Link to="/forgot" className="text-sky-600 hover:underline">
                Quên mật khẩu?
              </Link>

              <div className="text-slate-600">
                Chưa có tài khoản?{" "}
                <Link className="text-sky-600 hover:underline" to="/signup">
                  Đăng ký ngay
                </Link>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
