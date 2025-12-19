export type CommunityPost = {
  post_id?: string | number;
  user?: {
    full_name?: string;
    avatar_url?: string;
  };
  created_at_text?: string; // "15 phút trước" (UI text)
  content?: string;
  tags?: string[]; // ["KinhVanHoa"]
  contact_text?: string; // "Liên hệ Zalo: 098xxxxxx (Tú)"
  image_url?: string;

  stats?: {
    likes?: number;
    comments?: number;
  };

  liked?: boolean;
};

export type FeedFilter = "latest" | "popular" | "found";
