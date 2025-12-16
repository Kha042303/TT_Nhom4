import API from "../../api"; 

export const getAdminUsers = (page = 1, limit = 10) => {
  return API.get("/admin/users", {
    params: { page, limit },
  });
};

export const toggleUserStatus = (
  id: number,
  status: "active" | "inactive" | "banned"
) => {
  return API.patch(`/admin/users/${id}/block`, { status });
};

export const deleteUser = (id: number) => {
  return API.delete(`/admin/users/${id}`);
};
