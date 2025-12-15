// src/components/ui/NewBookSection.tsx
import React, { useState, useEffect } from "react";
import BookCard from "./Bookcard"; 
import type { BookFromDB } from '../models/Book'; // Đảm bảo đường dẫn đúng

const TABS = ["Sách Mới Về", "Dành cho bạn", "Nổi bật", "Phổ biến"];
const API_BASE_URL = '/api'; // Thay bằng URL API Backend của bạn

const NewBooksSection = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [books, setBooks] = useState<BookFromDB[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchBooks = async (tabIndex: number, pageNum: number) => {
        setLoading(true);
        // Map tab sang query parameter mà backend hiểu
        const typeParam = TABS[tabIndex].toLowerCase().replace(/\s/g, '_');
        const endpoint = `${API_BASE_URL}/books?type=${typeParam}&page=${pageNum}&limit=10`;

        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error('Lỗi khi tải dữ liệu sách');
            }
            // Backend phải trả về cấu trúc: { books: BookFromDB[], totalPages: number }
            const data: { books: BookFromDB[] } = await response.json();
            
            if (pageNum === 1) {
                setBooks(data.books);
            } else {
                setBooks(prevBooks => [...prevBooks, ...data.books]);
            }

            // Giả định backend trả về mảng rỗng nếu hết dữ liệu
            setHasMore(data.books.length === 10); 

        } catch (error) {
            console.error("Fetch books error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
        setBooks([]);
        setHasMore(true);
        fetchBooks(activeTab, 1);
    }, [activeTab]);

    const loadMoreBooks = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchBooks(activeTab, nextPage);
    };

    return (
        <div className="container mx-auto px-4 pb-16">
            <div className="flex items-center gap-6 border-b border-gray-200 mb-6 overflow-x-auto scrollbar-hide">
                {TABS.map((tab, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setActiveTab(idx)}
                        className={`pb-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                            idx === activeTab 
                                ? 'text-gray-800 text-xl md:text-2xl border-chinh pb-2' 
                                : 'text-gray-400 border-transparent hover:text-gray-600 pb-3 mt-1'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading && page === 1 ? (
                <div className="text-center py-10 text-gray-500">Đang tải sách...</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                    {books.map((book) => (
                        <BookCard key={book.book_id} book={book} />
                    ))}
                    {books.length === 0 && !loading && (
                         <div className="col-span-full text-center py-10 text-gray-500">
                             Không tìm thấy sách nào.
                         </div>
                    )}
                </div>
            )}
            
            <div className="flex justify-center mt-10">
                {hasMore && !loading && (
                    <button 
                        onClick={loadMoreBooks}
                        className="border border-chinh text-chinh px-8 py-2.5 rounded hover:bg-sky-50 font-medium text-sm transition-colors"
                    >
                        {page === 1 ? 'Tải Thêm Sách' : 'Xem Thêm'}
                    </button>
                )}
                {loading && page > 1 && (
                    <div className="text-chinh">Đang tải thêm...</div>
                )}
            </div>
        </div>
    );
};

export default NewBooksSection;