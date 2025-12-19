import { Link } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

type Section = {
  title: string;
  body: React.ReactNode;
};

export default function TermsPage() {
  // UI-only: sau này bạn có thể lấy nội dung từ BE rồi render động
  const updatedAt = "24/05/2024";

  const sections: Section[] = [
    {
      title: "1. Giới thiệu chung",
      body: (
        <div className="space-y-3 text-slate-600 leading-relaxed">
          <p>
            Chào mừng bạn đến với <b className="text-slate-900">Sách Cũ Trao Đổi</b>.
            Chúng tôi là một nền tảng trực tuyến được thiết kế để kết nối những
            người yêu sách, cho phép các thành viên trao đổi, tặng hoặc tìm kiếm
            những cuốn sách cũ một cách thuận tiện.
          </p>
          <p>
            Mục tiêu của chúng tôi là lan tỏa tri thức và kéo dài vòng đời của
            những cuốn sách.
          </p>
          <p>
            Bằng việc truy cập và sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân
            thủ các Điều khoản và Quy định này.
          </p>
        </div>
      ),
    },
    {
      title: "2. Tài khoản người dùng",
      body: (
        <ul className="list-disc pl-5 space-y-2 text-slate-600 leading-relaxed">
          <li>Bạn cần đăng ký tài khoản để đăng bài trao đổi hoặc liên hệ với người dùng khác.</li>
          <li>Thông tin đăng ký (tên, số điện thoại, địa chỉ) phải chính xác và trung thực.</li>
          <li>Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động diễn ra dưới tài khoản đó.</li>
          <li>Chúng tôi có quyền khóa hoặc xóa tài khoản nếu phát hiện hành vi vi phạm quy định cộng đồng.</li>
        </ul>
      ),
    },
    {
      title: "3. Quy định đăng tin",
      body: (
        <div className="space-y-3 text-slate-600 leading-relaxed">
          <p>Để đảm bảo chất lượng nội dung, các bài đăng cần tuân thủ:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <b className="text-slate-900">Đối tượng trao đổi:</b> Chỉ được đăng các sản phẩm là sách, truyện,
              tạp chí. Không đăng bán các vật phẩm khác.
            </li>
            <li>
              <b className="text-slate-900">Hình ảnh:</b> Phải sử dụng hình ảnh thật của cuốn sách đang sở hữu,
              thể hiện rõ tình trạng hiện tại. Không dùng hình ảnh copy từ internet.
            </li>
            <li>
              <b className="text-slate-900">Mô tả:</b> Mô tả trung thực về tình trạng sách (mới, cũ, có ghi chú,
              rách bìa...). Cần ghi rõ ngôn ngữ, thể loại.
            </li>
            <li>
              <b className="text-slate-900">Nội dung cấm:</b> Không đăng sách có nội dung đồi trụy, kích động bạo lực,
              chống phá nhà nước, hoặc sách vi phạm bản quyền.
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "4. Nguyên tắc trao đổi",
      body: (
        <div className="space-y-3 text-slate-600 leading-relaxed">
          <p>
            Sách Cũ Trao Đổi là nền tảng kết nối, chúng tôi <b className="text-slate-900">không hỗ trợ thanh toán trực tuyến</b>{" "}
            và không can thiệp vào quá trình giao dịch của người dùng.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Người dùng tự thỏa thuận phương thức trao đổi (gặp trực tiếp, gửi bưu điện, ship COD...).</li>
            <li>Khuyến khích gặp mặt trực tiếp tại nơi công cộng để trao đổi an toàn.</li>
            <li>Thái độ giao tiếp cần lịch sự, tôn trọng lẫn nhau.</li>
            <li>Người nhận sách nên kiểm tra kỹ tình trạng sách trước khi hoàn tất trao đổi.</li>
          </ul>
        </div>
      ),
    },
    {
      title: "5. Các hành vi bị nghiêm cấm",
      body: (
        <div className="space-y-3 text-slate-600 leading-relaxed">
          <p>Chúng tôi nghiêm cấm các hành vi sau trên nền tảng:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Lừa đảo, chiếm đoạt tài sản của người khác dưới mọi hình thức.</li>
            <li>Spam tin nhắn, spam bài đăng quảng cáo không liên quan đến sách.</li>
            <li>Sử dụng ngôn từ thô tục, xúc phạm, quấy rối thành viên khác.</li>
            <li>
              Yêu cầu chuyển khoản trước khi giao sách nếu không có sự tin tưởng hoặc đảm bảo
              (vì nền tảng không có chức năng bảo vệ thanh toán).
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: "6. Miễn trừ trách nhiệm",
      body: (
        <div className="space-y-3 text-slate-600 leading-relaxed">
          <p>
            <b className="text-slate-900">Sách Cũ Trao Đổi</b> không chịu trách nhiệm về:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Chất lượng thực tế của sách so với mô tả (do người dùng tự cam kết).</li>
            <li>Các rủi ro phát sinh trong quá trình vận chuyển hoặc gặp mặt trao đổi.</li>
            <li>Các tranh chấp tài chính giữa các cá nhân.</li>
          </ul>
          <p>
            Tuy nhiên, chúng tôi sẵn sàng tiếp nhận báo cáo và hỗ trợ xử lý các tài khoản vi phạm
            để bảo vệ cộng đồng.
          </p>
        </div>
      ),
    },
    {
      title: "7. Liên hệ hỗ trợ",
      body: (
        <div className="space-y-2 text-slate-600 leading-relaxed">
          <p>Nếu bạn có thắc mắc hoặc cần báo cáo vi phạm, vui lòng liên hệ với chúng tôi qua email:</p>
          <p className="font-semibold text-sky-600">hotro@sachcutraodoi.com</p>
          <p>hoặc mục “Liên hệ” ở cuối trang.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nếu Header của bạn bắt buộc props user/loading thì giữ như này để khỏi lỗi TS */}
      <Header user={null as any} loading={false} />

      {/* HERO */}
      <section className="bg-sky-50">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900">
            Quy định và Điều khoản Sử dụng
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600 leading-relaxed">
            Vui lòng đọc kỹ các quy định dưới đây để cùng nhau xây dựng cộng đồng
            trao đổi sách văn minh, lành mạnh.
          </p>
          <div className="mt-4 text-sm text-slate-500">
            Cập nhật lần cuối: {updatedAt}
          </div>
        </div>
      </section>

      {/* CONTENT CARD */}
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-6 md:p-10">
            <div className="space-y-10">
              {sections.map((s) => (
                <section key={s.title}>
                  <h2 className="text-sky-600 font-extrabold">{s.title}</h2>
                  <div className="mt-3">{s.body}</div>
                </section>
              ))}
            </div>

            {/* ACTIONS */}
            <div className="mt-10 border-t border-slate-200 pt-6 flex flex-wrap items-center justify-center gap-3">
              {/* UI-only: không xử lý */}
              <Link
                to="/"
                className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 font-bold text-slate-700 hover:bg-slate-50"
              >
                Quay lại Trang Chủ
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
