// src/components/community/types.ts
export type CommunityPost = {
  post_id: string | number;
  user_id?: number;

  user?: {
    user_id?: number;
    full_name?: string;
    avatar_url?: string;
    email?: string;
    phone?: string;
    address?: string;
  };

  title?: string;
  content?: string;

  created_at?: string; // ISO từ BE
  created_at_text?: string; // text hiển thị

  // normalize từ API: luôn là mảng url đầy đủ (http...)
  images?: string[];

  // UI extras (chưa có BE)
  tags?: string[];
  contact_text?: string;

  stats?: {
    likes?: number;
    comments?: number;
  };

  liked?: boolean;
};

export type FeedFilter = "latest" | "popular" | "found";
