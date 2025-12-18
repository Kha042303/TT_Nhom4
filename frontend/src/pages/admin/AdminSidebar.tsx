import { NavLink } from "react-router-dom";
import {
  Users,
  Book,
  FileText,
  CreditCard,
  Flag,
  MessageCircle,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

const menus = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Người dùng", icon: Users },
  { to: "/admin/books", label: "Sách", icon: Book },
  { to: "/admin/posts", label: "Bài viết", icon: FileText },
  { to: "/admin/payments", label: "Thanh toán", icon: CreditCard },
  { to: "/admin/reports", label: "Report", icon: Flag },
];

export default function AdminSidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col bg-[#0E1627]">
      {/* LOGO */}
      <div className="px-6 py-5 text-xl font-bold text-white">
        ADMIN<span className="text-[#3470FD]">PANEL</span>
      </div>

      {/* ADMIN INFO */}
      <div className="mx-4 mb-4 flex items-center gap-3 rounded-xl bg-white/5 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3470FD] text-sm font-bold text-white">
          AD
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Administrator</p>
          <p className="text-xs text-green-400">● ONLINE</p>
        </div>
      </div>

      {/* MENU */}
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {menus.map((m) => (
          <NavLink
            key={m.to}
            to={m.to}
            end
            className={({ isActive }) =>
              [
                "flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all duration-200",
                isActive
                  ? "bg-[#E8EEFF] text-[#3470FD] font-semibold shadow-sm"
                  : "text-gray-300 hover:bg-white/10 hover:text-white",
              ].join(" ")
            }
          >
            <m.icon size={18} className="text-current shrink-0" />
            <span>{m.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* LOGOUT */}
      <button className="m-4 flex items-center gap-2 rounded-xl bg-[#3470FD] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
        <LogOut size={16} />
        Đăng xuất
      </button>
    </aside>
  );
}
