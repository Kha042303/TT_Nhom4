// Trong file types.ts

export interface SellerInfo {
  // ... các trường cũ (name, status, online, v.v...)
  user_id: number; // Thêm dòng này vào
  name: string;
  status?: "active" | "inactive" | "banned";
  online?: boolean;
  joinedText?: string;
  rating?: number;
  reviewCount?: number;
  phone?: string;
  email?: string;
  address?: string;
}

export type BookMeta = {
  publisher?: string;
  year?: number;
  pages?: string;
  language?: string;
};

export type BookDetailUI = {
  title?: string;
  author?: string;
  badge?: string;
  viewsText?: string;

  price?: number;
  oldPrice?: number;
  discountPercent?: number;

  condition?: string;
  location?: string;

  statusLabel?: string;
  images?: string[];

  meta?: BookMeta;
  seller?: SellerInfo;
};

export type SimilarBookUI = {
  id: number | string;
  title: string;
  author?: string;
  price?: number;
  condition?: string;
  location?: string;
  cover?: string;
};
