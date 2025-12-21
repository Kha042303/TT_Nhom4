import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, // gửi cookie refreshToken
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export async function getAdminReports(params?: {
  page?: number;
  limit?: number;
  report_type?: "post" | "user" | "book" | "chat";
  user_id?: number;
  target_id?: number;
  keyword?: string;
}) {
  return api.get("/report", { params });
}

export async function getReportDetail(id: number) {
  return api.get(`/report/detail/${id}`);
}

export async function updateReportNote(report_id: number, notes: string) {
  return api.patch(`/report/edit/${report_id}`, { notes: notes?.trim() || null });
}
