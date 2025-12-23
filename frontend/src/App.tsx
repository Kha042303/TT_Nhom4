// src/App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import Signin from "./pages/Signin";
import HomePage from "./pages/Homepage";
import Signup from "./pages/Signup";
import Logout from "./pages/Logout";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";
import RequireAdmin from "./components/RequireAdmin";

import SellBook from "./pages/SellBook";
import About from "./pages/About";
import ChatPage from "./pages/ChatPage";
import ContactPage from "./pages/ContactPage";
import QuyDinh from "./pages/QuyDinh";
import HuongDan from "./pages/HuongDan";
import ReportPage from "./pages/ReportPage";
import CommunityPage from "./pages/CommunityPage";
import UserInfoPage from "./pages/UserInfoPage";

// ✅ ADMIN PAGES (đúng theo các file bạn đã có)
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminBooks from "./pages/admin/Books";
import AdminPosts from "./pages/admin/Posts";
import AdminPayments from "./pages/admin/Payments";
import AdminReports from "./pages/admin/Reports";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

export default function App() {
  return (
    <>
      <Toaster richColors />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />

            <Route
              path="/logout"
              element={
                <RequireAuth>
                  <Logout />
                </RequireAuth>
              }
            />

            {/* ✅ ADMIN (role_id === 3) */}
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
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            <Route path="/sell" element={<SellBook />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/quydinh" element={<QuyDinh />} />
            <Route path="/huongdan" element={<HuongDan />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/user/:id" element={<UserInfoPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}
