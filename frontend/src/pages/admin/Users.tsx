import { useEffect, useState } from "react";
import { getAdminUsers, toggleUserStatus, deleteUser } from "../../api/admin.users";

const ROLE_NAME_BY_ID: Record<number, string> = {
  1: "buyer",
  2: "seller",
  3: "admin",
};

type UserRole = {
  id?: number;
  user_id?: number;
  role_id?: number;
  start_at?: string;
  expire_at?: string | null;
  is_active?: boolean;

  // có backend trả role nested
  role?: {
    role_id?: number;
    role_name?: string;
    description?: string;
  } | null;

  // phòng khi backend trả Role (PascalCase)
  Role?: {
    role_id?: number;
    role_name?: string;
  } | null;
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

    // ✅ bắt nhiều dạng response: data có thể là mảng hoặc data.data
    const list: User[] = res.data?.data?.data || res.data?.data || [];
    setUsers(Array.isArray(list) ? list : []);

    setPage(res.data?.pagination?.current_page || p);
    setTotalPage(res.data?.pagination?.total_pages || 1);

    // ✅ debug 1 lần (xong thì xóa)
    // console.log("FIRST USER:", list?.[0]);
    // console.log("FIRST USER user_roles:", list?.[0]?.user_roles);
  };

  useEffect(() => {
    fetchUsers(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const getRoleColor = (roleName: string) => {
    const r = roleName.toLowerCase();
    if (r === "admin") return "bg-red-100 text-red-600";
    if (r === "seller") return "bg-blue-100 text-blue-600";
    if (r === "buyer") return "bg-green-100 text-green-600";
    return "bg-gray-100 text-gray-600";
  };

  // ✅ helper hiển thị role: ưu tiên role.role_name, không có thì fallback role_id
  const renderRole = (u: User) => {
    const rolesRaw = u.user_roles || [];
    if (!Array.isArray(rolesRaw) || rolesRaw.length === 0) {
      return <span className="text-xs text-gray-400">Chưa có</span>;
    }

    const now = Date.now();

    const roleNames = rolesRaw
      .filter((ur) => ur?.is_active !== false) // nếu thiếu is_active -> coi như active
      .filter((ur) => {
        if (!ur?.expire_at) return true;
        const exp = Date.parse(ur.expire_at);
        if (Number.isNaN(exp)) return true;
        return exp > now;
      })
      .map((ur) => {
        // ưu tiên role_name từ object role
        const name =
          ur?.role?.role_name ||
          ur?.Role?.role_name ||
          (typeof ur?.role_id === "number" ? ROLE_NAME_BY_ID[ur.role_id] : undefined);

        // nếu vẫn không có thì show role_id cho khỏi trống
        if (!name && typeof ur?.role_id === "number") return `role_${ur.role_id}`;
        return name;
      })
      .filter((x): x is string => Boolean(x));

    if (roleNames.length === 0) {
      return <span className="text-xs text-gray-400">Chưa có</span>;
    }

    return (
      <div className="flex flex-wrap justify-center gap-1">
        {roleNames.map((roleName) => (
          <span
            key={roleName}
            className={`inline-flex min-w-[80px] justify-center rounded-full px-3 py-1 text-xs font-semibold ${getRoleColor(
              roleName
            )}`}
          >
            {roleName.toUpperCase()}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold">Quản lý người dùng</h1>

      <div className="overflow-hidden rounded-xl bg-white shadow">
        <table className="w-full table-fixed text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="w-20 p-4 text-left font-medium">ID</th>
              <th className="w-[300px] p-4 text-left font-medium">Email</th>
              <th className="w-[220px] p-4 text-left font-medium">Họ tên</th>
              <th className="w-40 p-4 text-center font-medium">Vai trò</th>
              <th className="w-32 p-4 text-center font-medium">Trạng thái</th>
              <th className="w-52 p-4 text-center font-medium">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.user_id} className="border-t hover:bg-gray-50">
                <td className="p-4 text-left align-middle">{u.user_id}</td>

                <td className="p-4 text-left align-middle truncate">{u.email}</td>

                <td className="p-4 text-left align-middle font-medium truncate">{u.full_name}</td>

                <td className="p-4 text-center align-middle">{renderRole(u)}</td>

                <td className="p-4 text-center align-middle">
                  <span
                    className={`inline-flex min-w-[72px] justify-center rounded-full px-3 py-1 text-xs font-semibold ${
                      u.status === "active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {u.status.toUpperCase()}
                  </span>
                </td>

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
