import { Link } from "react-router-dom";
import { BookOpen, Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
              <BookOpen size={18} />
            </span>
            <span className="text-sky-600">Sách Cũ Trao Đổi</span>
          </div>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            Nền tảng trao đổi sách cũ, kết nối những người yêu sách trên toàn quốc.
          </p>
        </div>

        <div>
          <div className="font-semibold">Về chúng tôi</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>
              <Link className="hover:text-sky-600" to="/about">
                Giới thiệu
              </Link>
            </li>
            <li>
              <Link className="hover:text-sky-600" to="/quydinh">
                Quy định
              </Link>
            </li>
            <li>
              <Link className="hover:text-sky-600" to="/contact">
                Liên hệ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-semibold">Hỗ trợ</div>
          <ul className="mt-3 space-y-2 text-sm text-slate-500">
            <li>
              <Link className="hover:text-sky-600" to="/huongdan">
                Hướng dẫn đăng bài
              </Link>
            </li>
            <li>
              <Link className="hover:text-sky-600" to="/report">
                Báo cáo vấn đề
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="font-semibold">Theo dõi chúng tôi</div>
          <div className="mt-4 flex items-center gap-3 text-slate-600">
            <button className="h-10 w-10 rounded-xl border hover:bg-slate-50 flex items-center justify-center">
              <Facebook size={18} />
            </button>
            <button className="h-10 w-10 rounded-xl border hover:bg-slate-50 flex items-center justify-center">
              <Twitter size={18} />
            </button>
            <button className="h-10 w-10 rounded-xl border hover:bg-slate-50 flex items-center justify-center">
              <Instagram size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-sm text-slate-500">
          © 2024 Sách Cũ Trao Đổi. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
