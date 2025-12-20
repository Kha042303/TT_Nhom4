import { Link } from "react-router-dom";
import {
  BookOpen,
  MessageCircle,
  User2,
  ChevronDown,
  Crown,
  Sparkles,
} from "lucide-react";

type HeaderProps = {
  user: any; // giữ any để không đụng logic/type auth hiện tại
  loading: boolean;
};

// UI-only: đọc thông tin gói từ object user (tùy backend trả về)
function getPlanLabel(user: any) {
  // ưu tiên lấy tên gói nếu có
  const plan =
    user?.plan_name ||
    user?.plan ||
    user?.subscription?.name ||
    user?.package?.name ||
    user?.role_name;

  // nếu có roles array (vd: ["buyer","seller"])
  const roles: string[] = Array.isArray(user?.roles) ? user.roles : [];

  // fallback hợp lý
  if (plan) return String(plan);

  if (roles.includes("seller")) return "Seller";
  if (roles.includes("vip") || roles.includes("premium")) return "Premium";

  return "Free";
}

function isUpgradedPlan(label: string) {
  const x = (label || "").toLowerCase();
  // coi các gói khác Free là nâng cấp
  return x !== "free" && x !== "user";
}

export default function Header({ user, loading }: HeaderProps) {
  return (
    <header className="bg-white border-b">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <BookOpen size={18} />
          </span>
          <span className="text-sky-600">Sách Cũ Trao Đổi</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link
            className="hover:text-sky-600"
            to={!loading && user ? "/sell" : "/signin"}
          >
            Đăng Bán Sách
          </Link>
          <Link className="hover:text-sky-600" to="/community">
            Cộng Đồng
          </Link>
          <Link className="hover:text-sky-600" to="/about">
            Giới Thiệu
          </Link>
          <Link className="hover:text-sky-600" to="/contact">
            Liên Hệ
          </Link>
          <Link className="hover:text-sky-600" to="/report">
            Báo cáo
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            to={!loading && user ? "/chat" : "/signin"}
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100"
            title="Tin nhắn"
          >
            <MessageCircle size={18} className="opacity-80" />
          </Link>

          {/* Chưa đăng nhập */}
          {!loading && !user ? (
            <>
              <Link
                className="h-10 px-4 inline-flex items-center justify-center rounded-xl border border-sky-300 text-sky-600 hover:bg-sky-50"
                to="/signin"
              >
                Đăng Nhập
              </Link>
              <Link
                className="h-10 px-4 inline-flex items-center justify-center rounded-xl bg-slate-900 text-white hover:opacity-90"
                to="/signup"
              >
                Đăng Ký
              </Link>
            </>
          ) : null}

          {/* Đã đăng nhập */}
          {!loading && user ? (
            <div className="flex items-center gap-2">
              {(() => {
                const planLabel = getPlanLabel(user);
                const upgraded = isUpgradedPlan(planLabel);

                return (
                  <>
                    {/* Nút tài khoản (click -> userinfo) */}
                    <Link
                      to={user?.user_id ? `/user/${user.user_id}` : "/userinfo"}
                      className="h-10 px-3 inline-flex items-center gap-2 rounded-xl border hover:bg-slate-50"
                      title={`Gói: ${planLabel}`}
                    >
                      <User2 size={18} className="opacity-80" />

                      <span className="hidden sm:inline text-sm">
                        {user.full_name || user.email}
                      </span>

                      {/* Badge gói (ẩn trên mobile để gọn) */}
                      <span
                        className={[
                          "hidden md:inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-extrabold border",
                          upgraded
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-slate-100 text-slate-600 border-slate-200",
                        ].join(" ")}
                      >
                        {upgraded ? <Crown size={14} /> : <Sparkles size={14} />}
                        {planLabel}
                      </span>

                      <ChevronDown size={16} className="opacity-60" />
                    </Link>

                    {/* Nút nâng cấp (chỉ hiện khi Free/chưa nâng cấp) */}
                    {!upgraded ? (
                      <Link
                        to="/upgrade"
                        className="hidden sm:inline-flex h-10 px-4 items-center justify-center rounded-xl bg-sky-600 text-white font-extrabold hover:bg-sky-700 shadow"
                        title="Nâng cấp tài khoản"
                      >
                        Nâng cấp
                      </Link>
                    ) : null}

                    {/* Logout */}
                    <Link
                      className="h-10 px-4 inline-flex items-center justify-center rounded-xl bg-slate-900 text-white hover:opacity-90"
                      to="/logout"
                    >
                      Đăng xuất
                    </Link>
                  </>
                );
              })()}
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
