export interface Subscription {
  id: string;
  user_id: string;
  plan_tier: string;
  alert_limit: number;
  started_at: string;
  expires_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}
