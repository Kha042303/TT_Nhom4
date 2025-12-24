// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

// Public pages
import HomePage from "./pages/Homepage"; // nếu file bạn là Homepage.tsx thì đổi lại "./pages/Homepage"
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import About from "./pages/About";
import ContactPage from "./pages/ContactPage";
import QuyDinh from "./pages/QuyDinh";
import HuongDan from "./pages/HuongDan";
import ReportPage from "./pages/ReportPage";
import CommunityPage from "./pages/CommunityPage";
import UserInfoPage from "./pages/UserInfoPage";
import BookDetailPage from "./pages/BookDetailPage";

// Protected pages
import Logout from "./pages/Logout";
import ChatPage from "./pages/ChatPage";
import SellBook from "./pages/SellBook";

// Guards
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";

// Admin pages
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminBooks from "./pages/admin/Books";
import AdminPosts from "./pages/admin/Posts";
import AdminPayments from "./pages/admin/Payments";
import AdminReports from "./pages/admin/Reports";

export default function App() {
  return (
    <>
      <Toaster richColors />

      <BrowserRouter>
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot" element={<ForgotPassword />} />

          {/* reset dùng query ?token=... hoặc /reset/:token */}
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/reset/:token" element={<ResetPassword />} />

          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/quydinh" element={<QuyDinh />} />
          <Route path="/huongdan" element={<HuongDan />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/user/:id" element={<UserInfoPage />} />
          <Route path="/book-detail/:id" element={<BookDetailPage />} />

          {/* PROTECTED */}
          <Route
            path="/logout"
            element={
              <RequireAuth>
                <Logout />
              </RequireAuth>
            }
          />

          <Route
            path="/chat"
            element={
              <RequireAuth>
                <ChatPage />
              </RequireAuth>
            }
          />

          <Route
            path="/sell"
            element={
              <RequireAuth>
                <SellBook />
              </RequireAuth>
            }
          />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="books" element={<AdminBooks />} />
            <Route path="posts" element={<AdminPosts />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
