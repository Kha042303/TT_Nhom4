import API from "../../api";

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
