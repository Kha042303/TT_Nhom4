// src/pages/Signup.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { registerApi } from "../lib/auth";
import Header from "../components/layout/Header";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const nav = useNavigate();
  const { user, loading } = useAuth();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error("Mật khẩu nhập lại không khớp");
      return;
    }

    setSubmitting(true);
    try {
      await registerApi({
        full_name: fullName || undefined,
        email,
        password,
        phone: phone || undefined,
        address: address || undefined,
      });

      toast.success("Đăng ký thành công! Mời bạn đăng nhập.");
      nav("/signin", { replace: true });
    } catch (err: any) {
      toast.error(err?.message || "Đăng ký thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
  <div className="min-h-screen bg-slate-50 text-slate-900">
    <Header user={user} loading={loading} />

    <main className="min-h-[calc(100vh-4rem)] flex items-start justify-center px-4 py-6 md:py-8">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-2xl rounded-2xl bg-white border shadow-[0_10px_30px_rgba(0,0,0,0.12)] overflow-hidden"
      >
        {/* Header card thấp hơn */}
        <div className="bg-gradient-to-r from-sky-500 to-sky-400 px-6 py-3 text-center">
          <h1 className="text-lg font-bold text-white">Đăng Ký</h1>
        </div>

        {/* Giảm padding + khoảng cách */}
        <div className="px-6 py-4 space-y-3">
          <div>
            <label className="text-sm font-medium text-slate-700">Họ tên</label>
            <input
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-sky-300"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nguyễn Văn A"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Email *</label>
            <input
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-sky-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              autoComplete="email"
              required
            />
          </div>

          {/* Gộp SĐT + Địa chỉ thành 1 dòng (desktop 2 cột) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Số điện thoại
              </label>
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-sky-300"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09xxxxxxxx"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Địa chỉ</label>
              <input
                className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-sky-300"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="..."
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">Mật khẩu *</label>
            <input
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-sky-300"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Nhập lại mật khẩu *
            </label>
            <input
              className="mt-1.5 w-full rounded-xl border border-slate-200 px-4 py-2.5 outline-none focus:ring-2 focus:ring-sky-300"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              type="password"
              autoComplete="new-password"
              required
            />
          </div>

          <button
            disabled={submitting}
            className="w-full mt-2 rounded-full bg-gradient-to-r from-sky-500 to-sky-400 px-4 py-2.5 font-semibold text-white shadow hover:opacity-95 disabled:opacity-60"
            type="submit"
          >
            {submitting ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          <div className="pt-1 text-sm text-slate-600 text-center">
            Đã có tài khoản?{" "}
            <Link className="text-sky-600 hover:underline" to="/signin">
              Đăng nhập
            </Link>
          </div>
        </div>
      </form>
    </main>
  </div>
);
}
