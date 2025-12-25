// pages/admin/AdminHeader.tsx
import { Globe, Bell } from "lucide-react";

export default function AdminHeader() {
  const handleViewWebsite = () => {
    // mở trang chủ ở tab mới
    window.open("/", "_blank", "noopener,noreferrer");
  };

  return (
    <header className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
      <div className="text-sm text-gray-500">
        Admin <span className="mx-1">›</span>
        <span className="font-medium text-blue-600">Sản phẩm</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleViewWebsite}
          className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
        >
          <Globe size={16} />
          Xem Website
        </button>
      </div>
    </header>
  );
}
