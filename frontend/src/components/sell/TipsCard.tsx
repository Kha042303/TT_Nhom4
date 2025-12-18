import { BadgeCheck } from "lucide-react";

export default function TipsCard() {
  return (
    <aside className="rounded-2xl border bg-sky-50/50 p-5">
      <div className="flex items-center gap-2 font-semibold text-slate-800">
        <span className="text-sky-600">
          <BadgeCheck size={18} />
        </span>
        Mẹo bán sách nhanh
      </div>

      <div className="mt-4 space-y-4 text-sm text-slate-700">
        <div className="flex gap-3">
          <div className="h-7 w-7 rounded-full bg-white border flex items-center justify-center font-semibold text-sky-600">
            1
          </div>
          <div>
            <div className="font-semibold">Hình ảnh rõ nét</div>
            <div className="text-slate-600">
              Chụp ảnh bìa trước, bìa sau và gáy sách. Chụp rõ các vết hư hỏng nếu có.
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="h-7 w-7 rounded-full bg-white border flex items-center justify-center font-semibold text-sky-600">
            2
          </div>
          <div>
            <div className="font-semibold">Mô tả trung thực</div>
            <div className="text-slate-600">
              Đánh giá đúng tình trạng sách giúp xây dựng uy tín với người mua.
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="h-7 w-7 rounded-full bg-white border flex items-center justify-center font-semibold text-sky-600">
            3
          </div>
          <div>
            <div className="font-semibold">Giá cả hợp lý</div>
            <div className="text-slate-600">
              Tham khảo giá sách mới và các bài đăng tương tự để đưa ra mức giá tốt.
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
