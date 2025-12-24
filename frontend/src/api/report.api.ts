// src/api/report.api.ts
import { apiFetch } from "./http";

export type ReportType = "post" | "user" | "book" | "chat";

export type Report = {
  report_id: number;
  user_id: number;
  report_type: ReportType;
  target_id: number;
  content: string | null;
  notes: string | null;
  generated_at: string;
};

export type CreateReportPayload = {
  report_type: ReportType;
  target_id: number;
  content?: string | null;
  notes?: string | null;
};

export type ApiResponse<T> = {
  code: number;
  message?: string;
  data: T;
  pagination?: any;
};

export function createReportApi(payload: CreateReportPayload) {
  return apiFetch<ApiResponse<Report>>("/report/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function myReportsApi() {
  return apiFetch<ApiResponse<Report[]>>("/report/my-reports", {
    method: "GET",
  });
}

// (tuỳ bạn dùng admin page)
// export function listReportsApi(params: {
//   report_type?: ReportType;
//   user_id?: number;
//   target_id?: number;
//   keyword?: string;
//   page?: number;
//   limit?: number;
// }) {
//   const sp = new URLSearchParams();
//   Object.entries(params).forEach(([k, v]) => {
//     if (v !== undefined && v !== null && `${v}` !== "") sp.set(k, `${v}`);
//   });
//   const qs = sp.toString() ? `?${sp.toString()}` : "";
//   return apiFetch<ApiResponse<Report[]>>(`/report${qs}`, { method: "GET" });
// }
