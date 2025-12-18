import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, // gửi cookie refreshToken
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
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
