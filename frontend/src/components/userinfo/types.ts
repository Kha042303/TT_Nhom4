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

export type SellingBookUI = {
  id?: string | number;
  title?: string;
  author?: string;
  price?: number;
  condition_badge?: string; // "Mới 99%" | "Khá" | "Cũ"
  cover_url?: string;
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
