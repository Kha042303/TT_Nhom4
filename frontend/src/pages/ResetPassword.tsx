// src/pages/ResetPassword.tsx
import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import Header from "../components/layout/Header";
import { resetPasswordApi } from "../api/user.api";

export default function ResetPassword() {
  const nav = useNavigate();

  const user = null;
  const loading = false;

  const [searchParams] = useSearchParams();
  const params = useParams<{ token?: string }>();

  const token = useMemo(() => {
    return searchParams.get("token") || params.token || "";
  }, [searchParams, params.token]);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return toast.error("Thiếu token đặt lại mật khẩu");
    if (password.length < 6) return toast.error("Mật khẩu tối thiểu 6 ký tự");
    if (password !== confirm) return toast.error("Mật khẩu xác nhận không khớp");

    setSubmitting(true);
    try {
      const res: any = await resetPasswordApi(password, token);

      const ok =
        res?.code === 200 ||
        res?.success === true ||
        res?.status === "ok" ||
        !!res?.message;

      if (!ok) {
        toast.error(res?.message || "Đổi mật khẩu thất bại");
        return;
      }

      toast.success(res?.message || "Đổi mật khẩu thành công! Mời bạn đăng nhập.");
      nav("/signin", { replace: true });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Đổi mật khẩu thất bại");
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
            <h1 className="text-xl font-bold text-white">Đặt lại mật khẩu</h1>
            <p className="text-white/90 text-sm mt-1">Nhập mật khẩu mới của bạn</p>
          </div>

          <div className="px-6 py-6 space-y-4">
            {!token && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                Link không hợp lệ hoặc thiếu token. Vui lòng quay lại trang quên mật khẩu.
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-slate-700">Mật khẩu mới</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới..."
                type="password"
                autoComplete="new-password"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Xác nhận mật khẩu</label>
              <input
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-sky-300"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Nhập lại mật khẩu..."
                type="password"
                autoComplete="new-password"
                required
              />
            </div>

            <button
              disabled={submitting || !token}
              className="w-full mt-2 rounded-full bg-gradient-to-r from-sky-500 to-sky-400 px-4 py-3 font-semibold text-white shadow hover:opacity-95 disabled:opacity-60"
              type="submit"
            >
              {submitting ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
            </button>

            <div className="pt-2 text-sm text-slate-600">
              Quay lại{" "}
              <Link to="/signin" className="text-sky-600 hover:underline">
                Đăng nhập
              </Link>{" "}
              hoặc{" "}
              <Link to="/forgot" className="text-sky-600 hover:underline">
                gửi lại link
              </Link>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
