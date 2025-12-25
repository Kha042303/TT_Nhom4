export type UserInfoUI = {
  full_name?: string;
  badge?: string; // "Thành viên tích cực"
  bio?: string;
  phone?: string;
  email?: string;
  location?: string;
  joined_text?: string; // "Tham gia từ tháng 08/2023"
  avatar_url?: string;
};

export type UserInfoEditUI = {
  full_name?: string;
  bio?: string;
  phone?: string;
  email?: string;
  location?: string;
  avatar_url?: string;
};

export type SellingBookUI = {
  id?: string | number;
  title?: string;
  author?: string;
  price?: number;
  condition_badge?: string;
  cover_url?: string;
};


export type MyBookUI = SellingBookUI & {
  status?: "active" | "inactive"; 
};

export type FindRequestUI = {
  id?: string | number;
  title?: string;
  content?: string;
  status_badge?: string; // "Đang Tìm Kiếm" | "Đã Tìm Thấy"
  created_at_text?: string;
  likes?: number;
  comments?: number;
};

/** Dùng cho list "Bài đăng tôi đăng" */
export type MyPostUI = {
  id?: string | number;
  title?: string;
  content?: string;
  created_at_text?: string;
  images?: string[];
  likes?: number;
  comments?: number;

  /** UI-only: trạng thái hiển thị */
  status?: "visible" | "hidden";

  /** (tuỳ dùng) nếu bạn muốn hiển thị badge text luôn */
  status_badge?: string; // "Hiển thị" | "Đã ẩn"
};
