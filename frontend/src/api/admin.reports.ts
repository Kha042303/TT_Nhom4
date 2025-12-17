import api  from "../../api";

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
