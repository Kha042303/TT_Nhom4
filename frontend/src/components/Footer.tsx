import { Link } from 'react-router-dom';
import { 
    FaBookReader,
    FaFacebookSquare,
    FaTwitter,
    FaInstagram,
    FaCaretRight // Icon dùng cho list items (tùy chọn)
} from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-slate-50 border-t border-gray-200 pt-12 pb-6">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Cột 1: Logo và Mô tả */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 text-sky-600 text-lg font-bold mb-4">
                            <FaBookReader />
                            <span>Sách Cũ Trao Đổi</span>
                        </Link>
                        <p className="text-gray-500 text-xs leading-relaxed max-w-xs">
                            Nền tảng trao đổi sách cũ, kết nối những người yêu sách trên toàn quốc.
                        </p>
                    </div>
                    
                    {/* Cột 2: Về chúng tôi (Liên kết) */}
                    <div>
                        <h4 className="font-bold text-gray-800 mb-4 text-sm">Về chúng tôi</h4>
                        <ul className="space-y-2 text-xs text-gray-500">
                            <li><Link to="/gioi-thieu" className="hover:text-sky-600">Giới thiệu</Link></li>
                            <li><Link to="/quy-dinh" className="hover:text-sky-600">Quy định</Link></li>
                            <li><Link to="/lien-he" className="hover:text-sky-600">Liên hệ</Link></li>
                        </ul>
                    </div>
                    
                    {/* Cột 3: Hỗ trợ (Liên kết) */}
                    <div>
                        <h4 className="font-bold text-gray-800 mb-4 text-sm">Hỗ trợ</h4>
                        <ul className="space-y-2 text-xs text-gray-500">
                            <li><Link to="/faq" className="hover:text-sky-600">Câu hỏi thường gặp</Link></li>
                            <li><Link to="/huong-dan-dang-bai" className="hover:text-sky-600">Hướng dẫn đăng bài</Link></li>
                            <li><Link to="/bao-cao" className="hover:text-sky-600">Báo cáo vấn đề</Link></li>
                        </ul>
                    </div>
                    
                    {/* Cột 4: Theo dõi */}
                    <div>
                        <h4 className="font-bold text-gray-800 mb-4 text-sm">Theo dõi chúng tôi</h4>
                        <div className="flex gap-4 text-gray-500 text-lg">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-600">
                                <FaFacebookSquare />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-600">
                                <FaTwitter />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-sky-600">
                                <FaInstagram />
                            </a>
                        </div>
                    </div>
                </div>
                
                {/* Dòng Copyright */}
                <div className="border-t border-gray-200 pt-6 text-center text-xs text-gray-400">
                    &copy; 2024 Sách Cũ Trao Đổi. All Rights Reserved.
                </div>
            </div>
        </footer>
    )
};
export default Footer;