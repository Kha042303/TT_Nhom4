import { useEffect, useState } from "react";
import {
  getAdminPayments,
  getPaymentDetail,
  updatePaymentStatus,
} from "../../api/admin.payments";

type PaymentStatus = "pending" | "success" | "failed";

type Payment = {
  payment_id: number;
  order_id: string;
  user_id: number;
  amount: number;
  status: PaymentStatus;
  pay_type?: string;
  message?: string;
  created_at?: string;
  user?: {
    full_name: string;
    email: string;
  };
};

export default function AdminPayments() {
  const [list, setList] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  const [openDetail, setOpenDetail] = useState(false);
  const [detail, setDetail] = useState<Payment | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getAdminPayments();
      setList(res.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderStatus = (s: PaymentStatus) => {
    if (s === "success")
      return (
        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          SUCCESS
        </span>
      );
    if (s === "failed")
      return (
        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          FAILED
        </span>
      );
    return (
      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
        PENDING
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Quản lý thanh toán</h1>
        <p className="text-sm text-gray-500">
          Admin quản lý toàn bộ giao dịch MoMo
        </p>
      </div>

      {/* TABLE */}
      <div className="rounded-xl bg-white shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Order</th>
              <th className="p-4 text-left">Người dùng</th>
              <th className="p-4 text-right">Số tiền</th>
              <th className="p-4 text-center">Trạng thái</th>
              <th className="p-4 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Đang tải...
                </td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              list.map((p) => (
                <tr key={p.payment_id} className="border-t hover:bg-gray-50">
                  <td className="p-4">{p.payment_id}</td>
                  <td className="p-4">{p.order_id}</td>
                  <td className="p-4">
                    <div className="font-medium">
                      {p.user?.full_name || `User ${p.user_id}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {p.user?.email}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    {p.amount.toLocaleString()} ₫
                  </td>
                  <td className="p-4 text-center">
                    {renderStatus(p.status)}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={async () => {
                          const res = await getPaymentDetail(p.payment_id);
                          setDetail(res.data.data);
                          setOpenDetail(true);
                        }}
                        className="rounded border px-3 py-1 text-sm"
                      >
                        Xem
                      </button>

                      {p.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              updatePaymentStatus(p.payment_id, "success")
                                .then(fetchData)
                            }
                            className="rounded bg-green-600 px-3 py-1 text-sm text-white"
                          >
                            Success
                          </button>
                          <button
                            onClick={() =>
                              updatePaymentStatus(p.payment_id, "failed")
                                .then(fetchData)
                            }
                            className="rounded bg-red-600 px-3 py-1 text-sm text-white"
                          >
                            Failed
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* DETAIL MODAL */}
      {openDetail && detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-xl bg-white shadow">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="font-semibold">Chi tiết thanh toán</h3>
              <button onClick={() => setOpenDetail(false)}>✕</button>
            </div>

            <div className="p-4 space-y-2 text-sm">
              <div><b>Order:</b> {detail.order_id}</div>
              <div><b>User:</b> {detail.user?.full_name}</div>
              <div><b>Email:</b> {detail.user?.email}</div>
              <div><b>Số tiền:</b> {detail.amount.toLocaleString()} ₫</div>
              <div><b>Loại:</b> {detail.pay_type}</div>
              <div><b>Trạng thái:</b> {detail.status}</div>
              <div><b>Message:</b> {detail.message}</div>
              <div><b>Ngày:</b> {detail.created_at}</div>
            </div>

            <div className="border-t p-4 text-right">
              <button
                onClick={() => setOpenDetail(false)}
                className="rounded bg-[#3470FD] px-4 py-2 text-sm text-white"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
