// src/models/Book.ts

// Tương đương với bảng 'users' (chỉ lấy các trường cần thiết)
export interface UserProfile {
    user_id: number;
    full_name: string;
    email: string;
    phone: string | null;
    address: string | null;
    // Thêm các trường khác nếu cần, ví dụ: avatar_url
}

// Tương đương với bảng 'books' trong DB
export interface BookFromDB {
    book_id: number;
    user_id: number;
    title: string;
    author: string | null;
    publisher: string | null;
    price: number | null;
    stock: number;
    description: string | null;
    category: string | null;
    image_url: string | null; // Có thể là chuỗi JSON chứa nhiều ảnh
    status: 'visible' | 'hidden'; // Trạng thái sách
    deleted: 'false' | 'true';
    
    // Thêm các trường phụ trợ cho Frontend
    // Ví dụ: Lấy thông tin người bán (user) từ bảng users
    seller?: UserProfile;
}