import { useState } from "react";
import { ArrowRight, Info, UploadCloud } from "lucide-react";

type BankInfo = {
  bankName: string;
  accountNumber: string;
  accountName: string;
  amountVnd: number;
  transferNoteTemplate: string;
};

export default function UpgradeSellerForm({
  bankInfo,
  onSubmit,
}: {
  bankInfo: BankInfo;
  onSubmit?: (data: {
    username: string;
    email: string;
    note: string;
    receipt?: File;
  }) => void; // UI-only, nối API sau
}) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [receipt, setReceipt] = useState<File | undefined>(undefined);

  const formatVnd = (n: number) =>
    n.toLocaleString("vi-VN", { maximumFractionDigits: 0 }) + "đ";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-black text-slate-900">Xác nhận thanh toán</h2>

      {/* Bank info */}
      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sky-600 border border-slate-200">
            <Info size={18} />
          </span>

          <div className="flex-1">
            <div className="text-sm font-extrabold text-slate-900">
              Thông tin chuyển khoản
            </div>
            <div className="mt-1 text-xs text-slate-600">
              Vui lòng chuyển khoản phí nâng cấp{" "}
              <b>{formatVnd(bankInfo.amountVnd)}</b> vào tài khoản dưới đây, sau
              đó điền form xác nhận.
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <div className="text-[11px] font-bold text-slate-500">
                    NGÂN HÀNG
                  </div>
                  <div className="mt-1 text-sm font-extrabold text-slate-900">
                    {bankInfo.bankName}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-slate-500">
                    SỐ TÀI KHOẢN
                  </div>
                  <div className="mt-1 text-sm font-extrabold text-sky-600">
                    {bankInfo.accountNumber}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <div className="text-[11px] font-bold text-slate-500">
                    CHỦ TÀI KHOẢN
                  </div>
                  <div className="mt-1 text-sm font-extrabold text-slate-900">
                    {bankInfo.accountName}
                  </div>
                </div>

                <div className="md:col-span-2 border-t border-slate-200 pt-3">
                  <div className="text-[11px] font-bold text-slate-500">
                    NỘI DUNG CHUYỂN KHOẢN
                  </div>
                  <div className="mt-1 text-sm font-extrabold text-slate-900">
                    {bankInfo.transferNoteTemplate}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit?.({ username, email, note, receipt });
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-bold text-slate-900">
              Tên người dùng <span className="text-rose-500">*</span>
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ví dụ: namnguyen123"
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-900">
              Email đăng ký <span className="text-rose-500">*</span>
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-900">
            Ảnh chụp biên lai chuyển khoản{" "}
            <span className="text-rose-500">*</span>
          </label>

          <div className="mt-2 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6">
            <div className="flex flex-col items-center justify-center text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-600">
                <UploadCloud size={22} />
              </span>

              <div className="mt-3 text-sm font-semibold text-slate-700">
                Nhấn để tải lên hoặc kéo thả ảnh
              </div>
              <div className="mt-1 text-xs text-slate-500">
                PNG, JPG (Tối đa 5MB)
              </div>

              <label className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-50">
                Chọn ảnh
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setReceipt(e.target.files?.[0])}
                />
              </label>

              {receipt?.name ? (
                <div className="mt-3 text-xs text-slate-600">
                  Đã chọn: <b>{receipt.name}</b>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm font-bold text-slate-900">
            Ghi chú thêm về thanh toán{" "}
            <span className="text-slate-400">(Tùy chọn)</span>
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Nhập tên ngân hàng bạn đã chuyển, mã giao dịch hoặc ghi chú khác..."
            className="mt-2 min-h-[110px] w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <button
          type="submit"
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-5 py-3 text-sm font-extrabold text-white hover:bg-sky-700"
        >
          Gửi yêu cầu nâng cấp <ArrowRight size={18} />
        </button>

        <div className="text-center text-xs text-slate-500">
          Yêu cầu của bạn sẽ được xử lý trong vòng 2-4 giờ làm việc.
        </div>
      </form>
    </div>
  );
}
