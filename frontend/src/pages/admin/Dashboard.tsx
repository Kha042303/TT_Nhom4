// src/admin/pages/Dashboard.tsx
export default function Dashboard() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          { label: "Người dùng", value: 120 },
          { label: "Sách", value: 56 },
          { label: "Report", value: 8 },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg bg-white p-6 shadow"
          >
            <p className="text-sm text-gray-500">{item.label}</p>
            <p className="mt-2 text-3xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}
