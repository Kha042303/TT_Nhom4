import { useEffect, useState } from "react";
import {
  getAdminUsers,
  toggleUserStatus,
  deleteUser,
} from "../../api/admin.users";

type UserRole = {
  role?: {
    role_id: number;
    role_name: string;
  };
};

type User = {
  user_id: number;
  full_name: string;
  email: string;
  status: "active" | "inactive" | "banned";
  user_roles?: UserRole[];
};

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const LIMIT = 10;

  const fetchUsers = async (p = page) => {
    const res = await getAdminUsers(p, LIMIT);
    setUsers(res.data.data);
    setPage(res.data.pagination.current_page);
    setTotalPage(res.data.pagination.total_pages);
  };

  useEffect(() => {
    fetchUsers(1);
  }, []);

  const handleToggle = async (u: User) => {
    const next = u.status === "active" ? "banned" : "active";
    if (!confirm(`Chuyển trạng thái sang ${next}?`)) return;
    await toggleUserStatus(u.user_id, next);
    fetchUsers();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Xóa user này?")) return;
    await deleteUser(id);
    fetchUsers();
  };

  // helper hiển thị role
  const renderRole = (u: User) => {
    if (!u.user_roles || u.user_roles.length === 0) {
      return <span className="text-xs text-gray-400">Chưa có</span>;
    }

    const roleName = u.user_roles[0]?.role?.role_name;

    if (!roleName) {
      return <span className="text-xs text-gray-400">Chưa có</span>;
    }

    const color =
      roleName === "admin"
        ? "bg-red-100 text-red-600"
        : roleName === "seller"
        ? "bg-blue-100 text-blue-600"
        : "bg-gray-100 text-gray-600";

    return (
      <span
        className={`inline-flex min-w-[80px] justify-center rounded-full px-3 py-1 text-xs font-semibold ${color}`}
      >
        {roleName.toUpperCase()}
      </span>
    );
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Quản lý người dùng</h1>

      {/* TABLE CARD */}
      <div className="overflow-hidden rounded-xl bg-white shadow">
        <table className="w-full table-fixed text-sm">
          {/* HEADER */}
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="w-20 p-4 text-left font-medium">ID</th>
              <th className="w-[300px] p-4 text-left font-medium">Email</th>
              <th className="w-[220px] p-4 text-left font-medium">Họ tên</th>
              <th className="w-32 p-4 text-center font-medium">Vai trò</th>
              <th className="w-32 p-4 text-center font-medium">Trạng thái</th>
              <th className="w-52 p-4 text-center font-medium">Hành động</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {users.map((u) => (
              <tr key={u.user_id} className="border-t hover:bg-gray-50">
                {/* ID */}
                <td className="p-4 text-left align-middle">
                  {u.user_id}
                </td>

                {/* EMAIL */}
                <td className="p-4 text-left align-middle truncate">
                  {u.email}
                </td>

                {/* NAME */}
                <td className="p-4 text-left align-middle font-medium truncate">
                  {u.full_name}
                </td>

                {/* ROLE */}
                <td className="p-4 text-center align-middle">
                  {renderRole(u)}
                </td>

                {/* STATUS */}
                <td className="p-4 text-center align-middle">
                  <span
                    className={`inline-flex min-w-[72px] justify-center rounded-full px-3 py-1 text-xs font-semibold
                      ${
                        u.status === "active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                  >
                    {u.status.toUpperCase()}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-4 text-center align-middle">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleToggle(u)}
                      className="rounded-lg border px-4 py-1.5 text-sm hover:bg-gray-100"
                    >
                      {u.status === "active" ? "Khóa" : "Mở"}
                    </button>

                    <button
                      onClick={() => handleDelete(u.user_id)}
                      className="rounded-lg bg-red-600 px-4 py-1.5 text-sm text-white hover:bg-red-500"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="mt-6 flex items-center justify-end gap-3 text-sm">
        <button
          disabled={page <= 1}
          onClick={() => fetchUsers(page - 1)}
          className="rounded-lg border px-3 py-1.5 disabled:opacity-50"
        >
          Trước
        </button>

        <span>
          {page} / {totalPage}
        </span>

        <button
          disabled={page >= totalPage}
          onClick={() => fetchUsers(page + 1)}
          className="rounded-lg border px-3 py-1.5 disabled:opacity-50"
        >
          Sau
        </button>
      </div>
    </div>
  );
}
