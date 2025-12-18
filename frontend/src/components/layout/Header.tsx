import { Link } from "react-router-dom";
import {
  BookOpen,
  // Heart,
  MessageCircle,
  // Bell,
  User2,
  ChevronDown,
} from "lucide-react";

type HeaderProps = {
  user: any; // giữ any để không đụng logic/type auth hiện tại
  loading: boolean;
};

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
          <Link className="hover:text-sky-600" to="/">
            Tìm Sách
          </Link>
          <Link
            className="hover:text-sky-600"
            to={!loading && user ? "/sell" : "/signin"}
          >
            Đăng Bán Sách
          </Link>
          <Link className="hover:text-sky-600" to="/about">
            Giới Thiệu
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* <button className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100">
            <Heart size={18} className="opacity-80" />
          </button> */}
          <Link
            to={!loading && user ? "/chat" : "/signin"}
            className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100"
            title="Tin nhắn"
          >
            <MessageCircle size={18} className="opacity-80" />
          </Link>

          {/* <button className="hidden sm:inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100">
            <Bell size={18} className="opacity-80" />
          </button> */}

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

          {!loading && user ? (
            <div className="flex items-center gap-2">
              <button className="h-10 px-3 inline-flex items-center gap-2 rounded-xl border hover:bg-slate-50">
                <User2 size={18} className="opacity-80" />
                <span className="hidden sm:inline text-sm">
                  {user.full_name || user.email}
                </span>
                <ChevronDown size={16} className="opacity-60" />
              </button>
              <Link
                className="h-10 px-4 inline-flex items-center justify-center rounded-xl bg-slate-900 text-white hover:opacity-90"
                to="/logout"
              >
                Đăng xuất
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
