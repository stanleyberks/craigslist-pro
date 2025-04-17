export interface Listing {
  id: string;
  title: string;
  url: string;
  location: string;
  price?: string;
  description?: string;
  created_at: string;
  is_new: boolean;
}

export interface Match extends Listing {
  is_new: boolean;
}
