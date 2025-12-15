// src/components/ui/Categories.tsx
import React, { useState, useEffect } from 'react';

interface CategoryDB {
    id: number;
    ten: string; // Tên danh mục
    icon: string; // Tên icon (Font Awesome class hoặc tên icon tự định nghĩa)
}

const API_BASE_URL = '/api';

const Categories = () => {
    const [categories, setCategories] = useState<CategoryDB[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/categories`);
            if (!response.ok) throw new Error('Lỗi tải danh mục');
            
            // Giả định backend trả về: { categories: CategoryDB[] }
            const data: { categories: CategoryDB[] } = await response.json();
            setCategories(data.categories);

        } catch (error) {
            console.error("Fetch categories error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Hàm ánh xạ tên icon (ví dụ: 'book-open' -> 'fas fa-book-open')
    const getIconClass = (iconName: string) => {
        return `fa-${iconName}`;
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-10 text-center text-gray-500">Đang tải danh mục...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                {categories.map((dm) => (
                    <div key={dm.id} className="flex flex-col items-center gap-3 cursor-pointer group">
                        <div className="w-12 h-12 rounded-full bg-sky-50 text-chinh flex items-center justify-center text-xl group-hover:bg-chinh group-hover:text-white transition-colors duration-300">
                            <i className={`fas ${getIconClass(dm.icon)}`}></i>
                        </div>
                        <span className="text-xs font-medium text-gray-600 group-hover:text-chinh">{dm.ten}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Categories;