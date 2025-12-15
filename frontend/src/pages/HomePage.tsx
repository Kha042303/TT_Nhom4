// src/pages/HomePage.tsx
import React from 'react';
import DanhMuc from '../components/DanhMuc';
import Categories from '../components/Categories';
import NewBookSection from '../components/NewBookSection';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const HomePage: React.FC = () => {
  return (
    <main className="flex-grow">
        <Header />
      <DanhMuc />
      <Categories />
      <NewBookSection />
      <Footer />
    </main>
  );
};

export default HomePage;