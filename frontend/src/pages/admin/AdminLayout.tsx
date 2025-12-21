// pages/admin/AdminLayout.tsx
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-[#F5F7FB]">
      <AdminSidebar />

      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
