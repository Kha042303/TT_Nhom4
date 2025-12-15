import { Link, useNavigate } from 'react-router-dom';
import { 
    FaBookReader, 
    FaRegHeart, 
    FaRegComment, 
    FaRegBell,
    FaUser,
    FaBars
} from "react-icons/fa";

const Header = () => {
    // Khởi tạo hook chuyển hướng
    const navigate = useNavigate(); 
    
    // Giả định trạng thái đăng nhập (Thay thế bằng Auth Context/Redux thực tế)
    const isAuthenticated = true; 

    const handleLogout = () => {
        // ----------------------------------------------------------------
        // LOGIC XỬ LÝ ĐĂNG XUẤT THỰC TẾ
        // ----------------------------------------------------------------
        
        // 1. Xóa Token (JWT) khỏi Local Storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // 2. Cập nhật trạng thái xác thực
        // Ví dụ: dispatch({ type: 'LOGOUT' }); 
        
        // 3. Chuyển hướng người dùng về trang chủ (hoặc trang đăng nhập)
        // Dùng navigate('/') để quay lại trang chủ
        navigate('/'); 
        
        // (Tùy chọn: hiển thị thông báo)
        // alert("Đăng xuất thành công!");
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    {/* LOGO -> Trang chủ */}
                    <Link to="/" className="flex items-center gap-2 text-sky-600 text-xl font-bold cursor-pointer">
                        <FaBookReader className="text-2xl" />
                        <span className="font-bold">Sách Cũ Trao Đổi</span>
                    </Link>

                    {/* Menu chính */}
                    <nav className="hidden md:flex items-center gap-6 text-gray-600 text-sm font-medium">
                        <Link to="/" className="hover:text-sky-600 transition-colors">Tìm Sách</Link>
                        <Link to="/dang-ban" className="hover:text-sky-600 transition-colors">Đăng Bán Sách</Link>
                        <Link to="/gioi-thieu" className="hover:text-sky-600 transition-colors">Giới Thiệu</Link>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    {/* Icons thông báo/Tin nhắn */}
                    {isAuthenticated && (
                        <div className="flex items-center gap-5 text-gray-500">
                            <Link to="/favorites" className="hover:text-sky-600 transition-colors">
                                <FaRegHeart className="text-lg" />
                            </Link>
                            <Link to="/chat" className="hover:text-sky-600 transition-colors">
                                <FaRegComment className="text-lg" />
                            </Link>
                            <button className="hover:text-sky-600 transition-colors">
                                <FaRegBell className="text-lg" />
                            </button>
                        </div>
                    )}
                    
                    {/* LOGIC CỦA AUTH ACTIONS */}
                    {!isAuthenticated ? (
                        <>
                            {/* Đăng nhập/Đăng ký (CHƯA Đăng nhập) */}
                            <Link to="/signin" className="hidden sm:block px-4 py-1.5 text-sky-600 border border-sky-600 rounded-md text-sm font-semibold hover:bg-sky-50 transition">
                                Đăng Nhập
                            </Link>
                            <Link to="/signup" className="hidden sm:block px-4 py-1.5 bg-sky-600 text-white rounded-md text-sm font-semibold hover:bg-sky-700 transition">
                                Đăng Ký
                            </Link>
                        </>
                    ) : (
                        <>
                            {/* Profile Icon */}
                            <Link to="/profile" className="hidden sm:flex items-center gap-1 text-gray-600 cursor-pointer hover:text-sky-600">
                                <FaUser className='text-lg' />
                            </Link>
                            
                            {/* NÚT ĐĂNG XUẤT */}
                            <button 
                                onClick={handleLogout} // Gọi hàm đăng xuất
                                className="hidden sm:block px-4 py-1.5 bg-red-600 text-white rounded-md text-sm font-semibold hover:bg-red-700 transition"
                            >
                                Đăng Xuất
                            </button>
                        </>
                    )}

                    {/* Mobile Menu Icon */}
                    <button className="text-gray-600 sm:hidden">
                        <FaBars className="text-xl" />
                    </button>
                </div>
            </div>
        </header>
    );
};
export default Header;