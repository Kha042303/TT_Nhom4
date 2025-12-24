import { useEffect, useMemo, useState } from "react";
import { Mail, Phone, User2, Lock, Sparkles, ArrowRight } from "lucide-react";

export type UpgradeSellerFormValues = {
  fullName: string;
  email: string;
  phone?: string;
  note?: string;
};

type Props = {
  onSubmit: (data: UpgradeSellerFormValues) => void;
  currentUser?: { fullName?: string; email?: string; phone?: string };
  loadingUser?: boolean;
};

export default function UpgradeSellerForm({
  onSubmit,
  currentUser,
  loadingUser = false,
}: Props) {
  const [values, setValues] = useState<UpgradeSellerFormValues>({
    fullName: "",
    email: "",
    phone: "",
    note: "",
  });

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      fullName: currentUser?.fullName || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
    }));
  }, [currentUser?.fullName, currentUser?.email, currentUser?.phone]);

  const initials = useMemo(() => {
    const n = (values.fullName || "").trim();
    if (!n) return "U";
    const parts = n.split(/\s+/);
    const a = parts[0]?.[0] || "U";
    const b = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
    return (a + b).toUpperCase();
  }, [values.fullName]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  // ✅ thêm steps (bạn đang dùng steps.map nhưng chưa khai báo)
  const steps = [
    { t: "Điền thông tin", d: "Kiểm tra thông tin tài khoản" },
    { t: "Bấm Thanh toán", d: "Chọn Thanh toán MoMo" },
    { t: "Hoàn tất", d: "Hệ thống tự nâng cấp quyền" },
  ];

  const wrapper = "flex items-center gap-2 rounded-2xl border px-4 py-3";
  const inputBase =
    "w-full bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400";

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between bg-slate-900 px-6 py-4">
          <div>
            <div className="text-sm font-black text-white">Thông tin tài khoản</div>
            <div className="mt-1 text-xs font-semibold text-slate-200">
              Dữ liệu lấy từ tài khoản đang đăng nhập
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-bold text-white">
            <Lock size={14} />
            Read-only
          </div>
        </div>

        <div className="px-6 py-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-slate-900 font-black">
              {loadingUser ? "…" : initials}
            </div>
            <div>
              <div className="text-sm font-black text-slate-900">
                {loadingUser ? "Đang tải..." : values.fullName || "Chưa có tên"}
              </div>
              <div className="text-xs font-semibold text-slate-500">
                {loadingUser ? "" : values.email || "Chưa có email"}
              </div>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs font-black text-slate-700">Tên người dùng</label>
              <div className={`${wrapper} border-slate-200 bg-slate-50`}>
                <User2 size={18} className="text-slate-400" />
                <input value={values.fullName} className={inputBase} readOnly disabled={loadingUser} />
                <Lock size={16} className="text-slate-400" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-black text-slate-700">Email đăng ký</label>
              <div className={`${wrapper} border-slate-200 bg-slate-50`}>
                <Mail size={18} className="text-slate-400" />
                <input value={values.email} className={inputBase} readOnly disabled={loadingUser} />
                <Lock size={16} className="text-slate-400" />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-black text-slate-700">Số điện thoại</label>
              <div className={`${wrapper} border-slate-200 bg-slate-50`}>
                <Phone size={18} className="text-slate-400" />
                <input
                  value={values.phone || ""}
                  className={inputBase}
                  readOnly
                  disabled={loadingUser}
                  placeholder="Chưa có số điện thoại"
                />
                <Lock size={16} className="text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white">
            <Sparkles size={16} />
          </span>
          <div>
            <div className="text-sm font-black text-slate-900">Cách thức hoạt động</div>
            <div className="text-xs font-semibold text-slate-500">
              Nâng cấp tài khoản chỉ mất vài bước
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {steps.map((s, idx) => (
            <div key={idx} className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">
                  {idx + 1}
                </span>
                <div className="text-xs font-extrabold text-slate-900">{s.t}</div>
              </div>
              <div className="mt-2 text-xs text-slate-600">{s.d}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-700">
          <span className="font-black">Bước tiếp theo:</span>
          <span>Bấm</span>
          <b>Thanh toán MoMo</b>
          <ArrowRight size={14} />
          <span>để tạo giao dịch</span>
        </div>
      </div>
    </form>
  );
}
