// src/components/ui/BookDetail.tsx
import React from 'react';
import type { BookFromDB } from '../models/Book'; // Import BookFromDB

interface BookDetailProps {
    book: BookFromDB;
}

const BookDetail: React.FC<BookDetailProps> = ({ book }) => {
    // Xử lý dữ liệu
    const displayPrice = book.price !== null && book.price > 0 
        ? `${book.price.toLocaleString('vi-VN')} VNĐ` 
        : <span className="text-green-600">Trao Đổi Miễn Phí</span>;
    
    // Giả định 'description' trong DB là 'moTa'
    const description = book.description || "Chưa có mô tả chi tiết từ người bán.";
    
    // Giả định ảnh được lưu dưới dạng chuỗi URL ngăn cách bằng dấu phẩy
    const images = book.image_url ? book.image_url.split(',') : ['/assets/images/placeholder.jpg'];
    
    return (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 bg-white p-8 rounded-lg shadow-xl">
            {/* Cột 1: Ảnh và Thông tin cơ bản */}
            <div className="lg:col-span-1">
                <div className="h-80 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center mb-4">
                    <img src={images[0]} alt={book.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                        <img 
                            key={index}
                            src={img}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-16 h-16 object-cover border border-gray-300 rounded cursor-pointer hover:border-chinh"
                        />
                    ))}
                </div>
            </div>

            {/* Cột 2: Mô tả và Hành động */}
            <div className="lg:col-span-2">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{book.title}</h1>
                <p className="text-lg text-gray-600 mb-4">Tác giả: <span className="font-semibold">{book.author || 'Đang cập nhật'}</span></p>

                <div className="text-3xl font-bold text-chinh mb-6">
                    {displayPrice}
                </div>

                {/* Các nút Hành động */}
                <div className="flex gap-4 mb-8">
                    <button className="flex-1 py-3 bg-chinh text-white font-bold rounded-lg hover:bg-phu transition-colors">
                        <i className="fas fa-comment-dots mr-2"></i> LIÊN HỆ NGAY
                    </button>
                    <button className="py-3 px-6 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                        <i className="far fa-heart text-red-500"></i>
                    </button>
                </div>

                {/* Chi tiết */}
                <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Chi Tiết Sách</h3>
                <div className="grid grid-cols-2 gap-4 text-gray-700 text-sm mb-6">
                    <div>
                        <span className="font-medium">Tình trạng:</span> <span className="text-chinh font-semibold">{book.stock}% (Giả định)</span>
                    </div>
                    <div>
                        <span className="font-medium">Địa điểm:</span> {book.seller?.address || 'Chưa rõ'}
                    </div>
                    <div>
                        <span className="font-medium">Đăng bởi:</span> {book.seller?.full_name || 'Người dùng ẩn danh'}
                    </div>
                    <div>
                        <span className="font-medium">Danh mục:</span> {book.category}
                    </div>
                </div>

                {/* Mô tả */}
                <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">Mô Tả</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
            </div>
        </div>
    );
};

export default BookDetail;