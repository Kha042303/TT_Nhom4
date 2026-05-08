# TT_Nhom4 - Website mua bán sách cũ

Ứng dụng web hỗ trợ mua bán, đăng tin và trao đổi sách cũ. Dự án gồm frontend React/Vite và backend Node.js/Express, có phân quyền người dùng, đăng bán sách, cộng đồng bài viết, chat thời gian thực, báo cáo vi phạm, thanh toán nâng cấp seller qua MoMo và trang quản trị.

## Tính năng chính

- Đăng ký, đăng nhập, đăng xuất và xác thực bằng JWT.
- Quên mật khẩu, gửi email đặt lại mật khẩu qua Gmail SMTP.
- Xem danh sách sách, tìm kiếm/lọc/phân trang và xem chi tiết sách.
- Seller/admin có thể đăng sách, sửa sách, đổi trạng thái và xóa sách.
- Người dùng có thể đăng bài viết cộng đồng, chỉnh sửa, xóa và xem chi tiết bài viết.
- Chat 1-1 theo thời gian thực bằng Socket.IO, hỗ trợ gửi ảnh.
- Báo cáo nội dung/người dùng.
- Nâng cấp tài khoản seller bằng thanh toán MoMo test.
- Trang admin quản lý thống kê, người dùng, sách, bài viết, thanh toán và báo cáo.

## Công nghệ sử dụng

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Axios/Fetch API
- Socket.IO Client
- Sonner, Radix UI, Lucide React

### Backend

- Node.js
- Express
- MySQL
- Sequelize
- JWT
- Multer
- Socket.IO
- Nodemailer
- MoMo test payment gateway

## Cấu trúc thư mục

```text
.
├── back-end/
│   ├── api/v1/
│   │   ├── controller/
│   │   ├── middlewares/
│   │   ├── models/
│   │   └── routes/
│   ├── config/
│   ├── helpers/
│   ├── images/
│   ├── index.js
│   └── socket.io.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── vite.config.ts
└── README.md
```

## Yêu cầu hệ thống

- Node.js 18 trở lên
- npm
- MySQL
- Tài khoản Gmail có App Password nếu dùng chức năng quên mật khẩu

## Cài đặt

Clone dự án và cài dependency cho từng phần:

```bash
cd back-end
npm install

cd ../frontend
npm install
```

## Cấu hình môi trường

Tạo file `.env` trong thư mục `back-end`:

```env
PORT=3000

DATABASE_HOST=localhost
DATABASE_NAME=ten_database
DATABASE_USER=root
DATABASE_PASSWORD=mat_khau_mysql

ACCESS_TOKEN_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
```

Tạo file `.env` trong thư mục `frontend` nếu muốn đổi địa chỉ API:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_API_URL=http://localhost:3000
VITE_SERVER_ORIGIN=http://localhost:3000
VITE_API_PREFIX=/api/v1
VITE_FILE_BASE=http://localhost:3000
```

Nếu không tạo file `.env` cho frontend, ứng dụng sẽ mặc định gọi backend tại `http://localhost:3000`.

## Cơ sở dữ liệu

Backend dùng MySQL thông qua Sequelize. Trước khi chạy backend, hãy tạo database trùng với biến `DATABASE_NAME` trong file `.env`.

Ví dụ:

```sql
CREATE DATABASE ten_database CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Lưu ý: dự án hiện chưa có thư mục migration/seed trong repository. Nếu chạy lần đầu, cần chuẩn bị schema dữ liệu phù hợp với các model trong `back-end/api/v1/models`.

## Chạy dự án

Mở terminal thứ nhất để chạy backend:

```bash
cd back-end
npm start
```

Backend chạy tại:

```text
http://localhost:3000
```

Mở terminal thứ hai để chạy frontend:

```bash
cd frontend
npm run dev
```

Frontend chạy tại:

```text
http://localhost:5173
```

## Script thường dùng

Backend:

```bash
npm start
```

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Một số API chính

Tất cả API backend dùng prefix:

```text
/api/v1
```

Các nhóm route chính:

- `/api/v1/user`: đăng ký, đăng nhập, hồ sơ, quên/đặt lại mật khẩu.
- `/api/v1/book`: danh sách sách, chi tiết sách, tạo/sửa/xóa sách.
- `/api/v1/post`: bài viết cộng đồng.
- `/api/v1/chat`: gửi và lấy tin nhắn.
- `/api/v1/report`: báo cáo.
- `/api/v1/payment`: tạo thanh toán MoMo và quản lý giao dịch.
- `/api/v1/admin`: thống kê và quản lý admin.

## Tài khoản và phân quyền

Hệ thống có các nhóm quyền chính:

- `buyer`: người dùng mua/tìm sách.
- `seller`: người dùng có quyền đăng bán sách.
- `admin`: quản trị hệ thống.

Một số chức năng như đăng bán sách, đổi trạng thái sách hoặc vào trang admin yêu cầu đăng nhập và đúng quyền.

## Thanh toán MoMo

Chức năng nâng cấp seller đang dùng môi trường test của MoMo. Sau khi tạo thanh toán thành công, backend trả về `payUrl` để frontend chuyển người dùng sang trang thanh toán. Callback mặc định chuyển về:

```text
http://localhost:5173/payment-success
http://localhost:5173/payment-fail
```

## Ghi chú phát triển

- Backend chỉ cho phép CORS từ `http://localhost:5173`.
- File ảnh upload được lưu trong `back-end/images` và được public qua route `/images`.
- Socket.IO được khởi tạo chung với server Express trong `back-end/socket.io.js`.
- Không commit file `.env` hoặc thông tin nhạy cảm lên repository.

## Thành viên

Dự án thực hiện bởi Nhóm 4.
