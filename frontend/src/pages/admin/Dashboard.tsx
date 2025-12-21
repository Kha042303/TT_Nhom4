import { useEffect, useState } from "react";
export default function Dashboard() {
  const [stats, setStats] = useState({ users: 0, books: 0, reports: 0, posts: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API với token từ localStorage/Cookie
    fetch("http://localhost:3000/api/v1/admin/dashboard/stats", {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}` // Cần token để qua middleware auth
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.code === 200) setStats(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Đang tải dữ liệu...</p>;

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Người dùng", value: stats.users, color: "text-blue-600" },
          { label: "Sách", value: stats.books, color: "text-green-600" },
          { label: "Báo cáo", value: stats.reports, color: "text-red-600" },
          { label: "Doanh thu", value: `${stats.revenue.toLocaleString()}đ`, color: "text-orange-600" }
        ].map((item) => (
          <div key={item.label} className="rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <p className="text-sm font-medium text-gray-400">{item.label}</p>
            <p className={`mt-2 text-3xl font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}