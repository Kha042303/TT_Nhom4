import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, // gửi cookie refreshToken
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export type PaymentStatus = "pending" | "success" | "failed";

// ADMIN: danh sách thanh toán
export const getAdminPayments = () => {
  return API.get("/payment");
};

// ADMIN: chi tiết thanh toán
export const getPaymentDetail = (id: number) => {
  return API.get(`/payment/detail/${id}`);
};

// ADMIN: cập nhật trạng thái
export const updatePaymentStatus = (
  id: number,
  status: PaymentStatus
) => {
  return API.patch(`/payment/update/${id}`, { status });
};
