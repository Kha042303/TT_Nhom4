// src/pages/ForgotPassword.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import Header from "../components/layout/Header";
import { forgotPasswordApi } from "../api/user.api";

export default function ForgotPassword() {
  const user = null;
  const loading = false;

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const mail = email.trim();
    if (!mail) return;

    setSubmitting(true);
    try {
      const rs: any = await forgotPasswordApi(mail);

      const ok =
        rs?.code === 200 ||
        rs?.success === true ||
        rs?.status === "ok";

      if (!ok) {
        toast.error(rs?.message || "Gửi email thất bại");
        return;
      }

      toast.success(rs?.message || "Đã gửi email! Vui lòng kiểm tra hộp thư.");
      setEmail("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Lỗi");
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
            <h1 className="text-xl font-bold text-white">Quên mật khẩu</h1>
            <p className="text-white/90 text-sm mt-1">
              Nhập email để nhận link đặt lại mật khẩu
            </p>
          </div>

          <div className="px-6 py-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn..."
                autoComplete="email"
                required
              />
            </div>

            <button
              disabled={submitting}
              className="w-full mt-2 rounded-full bg-gradient-to-r from-sky-500 to-sky-400 px-4 py-3 font-semibold text-white shadow hover:opacity-95 disabled:opacity-60"
              type="submit"
            >
              {submitting ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
            </button>

            <div className="pt-2 text-sm text-slate-600">
              Quay lại{" "}
              <Link to="/signin" className="text-sky-600 hover:underline">
                Đăng nhập
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
