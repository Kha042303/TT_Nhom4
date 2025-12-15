// src/components/ui/Bookcard.tsx
import React from 'react';
import type { BookFromDB } from '../models/Book'; 

const BookCard = ({ book }: { book: BookFromDB }) => {
    // Xử lý logic hiển thị giá
    const displayPrice = book.price !== null && book.price > 0 
        ? `${book.price.toLocaleString('vi-VN')}đ` 
        : 'Miễn phí để đổi';
    
    const priceClass = book.price !== null && book.price > 0 
        ? 'text-red-600 font-bold' 
        : 'text-green-600 font-bold bg-green-50';

    // Xử lý ảnh (Giả định image_url là một chuỗi URL đơn hoặc JSON)
    const imageUrl = book.image_url ? book.image_url.split(',')[0] : '';

    // Giả lập thời gian đăng bài (Cần backend tính toán thời gian)
    const timeAgo = 'Vài giờ trước'; 
    const location = 'TP.HCM'; // DB hiện chưa có cột địa điểm cụ thể cho sách

    return (
        <div className="bg-white rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 group">
            <div className="h-48 bg-gray-200 relative flex items-center justify-center">
                {imageUrl ? (
                    <img src={imageUrl} alt={book.title} className="w-full h-full object-cover" />
                ) : (
                    <i className="fas fa-book text-5xl text-gray-300"></i>
                )}
                
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center cursor-pointer hover:bg-white text-gray-500 hover:text-red-500 transition-colors">
                    <i className="far fa-heart"></i>
                </div>
            </div>
            <div className="p-4">
                <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-1 group-hover:text-chinh transition-colors">{book.title}</h3>
                <p className="text-xs text-gray-500 mb-2">by {book.author || 'Đang cập nhật'}</p>
                <div className="mb-2">
                    <span className={`text-xs px-2 py-1 rounded ${priceClass}`}>
                        {displayPrice}
                    </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-gray-400 mt-3">
                    <span>{timeAgo}</span>
                    <span className="flex items-center gap-1">
                        <i className="fas fa-map-marker-alt"></i>
                        {location}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BookCard;