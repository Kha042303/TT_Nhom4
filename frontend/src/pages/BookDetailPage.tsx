// src/pages/BookDetailPage.tsx (Lấy dữ liệu theo ID)
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BookDetail from '../components/BookDetail';
import type { BookFromDB } from '../models/Book'; // Import BookFromDB

const API_BASE_URL = '/api';

const BookDetailPage = () => {
    // Lấy ID sách từ URL (Phụ thuộc vào cách bạn cấu hình React Router)
    const { id } = useParams<{ id: string }>(); 
    
    // Khai báo kiểu BookFromDB | null để tránh lỗi TypeScript
    const [book, setBook] = useState<BookFromDB | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchBookDetail = async () => {
        setLoading(true);
        if (!id) return; // Không có ID thì dừng

        try {
            const response = await fetch(`${API_BASE_URL}/books/${id}`);
            if (response.status === 404) throw new Error('Không tìm thấy sách');
            if (!response.ok) throw new Error('Lỗi khi tải dữ liệu');
            
            // Giả định backend trả về dữ liệu sách: BookFromDB
            const data: BookFromDB = await response.json(); 
            setBook(data);
            
        } catch (error) {
            console.error("Lỗi tải chi tiết sách:", error);
            setBook(null); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookDetail();
    }, [id]); // Gọi lại khi ID thay đổi

    if (loading) {
        return <div className="text-center py-20 text-gray-500">Đang tải chi tiết sách...</div>;
    }

    if (!book) {
        return <div className="text-center py-20 text-red-500">Không tìm thấy sách.</div>;
    }
    
    return (
        <div className="py-12 bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4">
                <BookDetail book={book} /> 
            </div>
        </div>
    );
};

export default BookDetailPage;