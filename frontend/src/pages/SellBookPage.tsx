// src/pages/SellBookPage.tsx
import React from 'react';
import SellForm from '../components/SellForm'; // Chỉnh đường dẫn nếu cần

const SellBookPage = () => {
  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-10">Đăng Bán & Trao Đổi Sách Cũ</h1>
        <SellForm />
      </div>
    </div>
  );
};

export default SellBookPage;