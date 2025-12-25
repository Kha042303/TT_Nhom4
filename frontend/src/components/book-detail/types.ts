export type SellerInfo = {
  name?: string;
  online?: boolean;
  joinedText?: string;
  rating?: number; // 0..5
  reviewCount?: number;

  // thêm các field để hiển thị đầy đủ
  phone?: string;
  email?: string;
  address?: string;
  status?: "active" | "inactive" | "banned";
};

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
  id?: string | number;
  title?: string;
  author?: string;
  price?: number;
  condition?: string;
  location?: string;
  cover?: string;
};
