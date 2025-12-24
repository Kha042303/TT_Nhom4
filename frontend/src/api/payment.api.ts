// src/api/payment.api.ts
export type CreatePaymentPayload = {
  role_id: number;
  typePayment: "momo";
  amount: number;
};

export type PaymentRecord = {
  payment_id: number;
  order_id: string;
  user_id: number;
  status: "pending" | "success" | "failed";
  amount: number;
  result_code?: number | null;
  message?: string | null;
  pay_type?: string | null;
  extra_data?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CreatePaymentResponse = {
  code: number;
  message: string;
  data: PaymentRecord & { payUrl: string };
};

const API_BASE =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3000";

function getAuthToken() {
  return localStorage.getItem("token") || localStorage.getItem("accessToken") || "";
}

export async function createMomoPayment(payload: CreatePaymentPayload) {
  const token = getAuthToken();
  const res = await fetch(`${API_BASE}/api/v1/payment/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  const json = (await res.json()) as CreatePaymentResponse;

  if (!res.ok || json?.code !== 200) {
    throw new Error(json?.message || "Tạo thanh toán thất bại");
  }
  return json;
}
