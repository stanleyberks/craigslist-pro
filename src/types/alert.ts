import { CategoryKey } from '@/lib/categories';

export interface Alert {
  id: string;
  user_id: string;
  name: string;
  cities: string[];
  category: CategoryKey;
  keywords?: string[];
  min_price?: number;
  max_price?: number;
  is_active: boolean;
  use_advanced_filter: boolean;
  created_at: string;
  updated_at: string;
  last_check_at?: string;
  error_count?: number;
  last_error?: string;
  new_matches_count?: number;
}
