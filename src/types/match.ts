export interface Match {
  id: string;
  craigslist_id: string;
  url: string;
  title: string;
  post_content?: string;
  price?: number;
  datetime: string;
  location?: string;
  pics?: string[];
  category: string;
  alert_id: string;
  created_at: string;
  updated_at: string;
  is_read: boolean;
  is_favorite: boolean;
  user_id: string;
  search_query: string;
  metadata?: {
    distance?: number;
    neighborhood?: string;
    condition?: string;
    size?: string;
    make?: string;
    model?: string;
    year?: number;
  };
}
