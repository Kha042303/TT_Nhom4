export type SellerInfo = {
  // ✅ Thêm dòng này:
  user_id?: number; 
  
  name: string;
  status?: "active" | "inactive" | "banned";
  online?: boolean;
  joinedText?: string;
  rating?: number;
  reviewCount?: number;
  phone?: string;
  email?: string;
  address?: string;
};

export type UserInfoUI = {
  id?: number | string;
  isCurrentUser?: boolean; 
  full_name?: string;
  badge?: string;
  bio?: string;
  phone?: string;
  email?: string;
  location?: string;
  joined_text?: string;
  avatar_url?: string;
};

export type SellingBookUI = {
  id?: string | number;
  title?: string;
  author?: string;
  price?: number;
  condition_badge?: string;
  cover_url?: string;
  isOwner?: boolean; 
};

export type FindRequestUI = {
  id?: string | number;
  title?: string;
  content?: string;
  status_badge?: string;
  created_at_text?: string;
  likes?: number;
  comments?: number;
  isOwner?: boolean; 
  user_name?: string;
  user_avatar?: string;
  images?: string[];
};