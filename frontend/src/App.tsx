import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import Signin from "./pages/Signin";
import Signup from "./pages/SignupPage";
import ChatPage from "./pages/Chat";
import HomePage from "./pages/HomePage";

import AdminUsers from "./pages/admin/Users";
import Dashboard from "./pages/admin/Dashboard";
import AdminLayout from "./pages/admin/AdminLayout.tsx";

import AdminGuard from "./components/AdminGuard";
import AdminBooks from "./pages/admin/Books";
import AdminPosts from "./pages/admin/Posts.tsx";
import AdminPayments from "./pages/admin/Payments.tsx";
import AdminReports from "./pages/admin/Reports.tsx";
function App() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("accessToken") || "";

  return (
    <>
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* USER ROUTES */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/chat"
            element={<ChatPage user={user} token={token} />}
          />

          {/* ADMIN ROUTES (ĐƯỢC BẢO VỆ) */}
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="books" element={<AdminBooks />} />
            <Route path="posts" element={<AdminPosts />} />
             <Route path="payments" element={<AdminPayments />} />
         <Route path="reports" element={<AdminReports />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
