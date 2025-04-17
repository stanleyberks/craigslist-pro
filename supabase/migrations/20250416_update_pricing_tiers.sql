-- Update plan_tier enum
CREATE TYPE plan_tier_new AS ENUM ('free', 'starter', 'pro', 'business');

-- Add new subscription_limits table
CREATE TABLE subscription_limits (
    plan_tier plan_tier_new PRIMARY KEY,
    alerts_count integer NOT NULL,
    refresh_rate integer NOT NULL, -- in seconds
    results_per_alert integer NOT NULL,
    history_days integer NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add trigger for updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON subscription_limits
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- Insert default limits
INSERT INTO subscription_limits 
(plan_tier, alerts_count, refresh_rate, results_per_alert, history_days) 
VALUES 
('free', 3, 1800, 50, 7),
('starter', 5, 900, 100, 14),
('pro', 15, 300, 200, 30),
('business', -1, 60, 500, 90);

-- Add price column to subscriptions table
ALTER TABLE subscriptions 
ADD COLUMN price decimal(10,2) NOT NULL DEFAULT 0.00,
ADD COLUMN currency text NOT NULL DEFAULT 'USD',
ADD COLUMN billing_period text NOT NULL DEFAULT 'monthly',
ADD COLUMN stripe_subscription_id text,
ADD COLUMN stripe_customer_id text,
ADD COLUMN next_billing_date timestamp with time zone;

-- Add subscription features junction table
CREATE TABLE subscription_features (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    plan_tier plan_tier_new NOT NULL REFERENCES subscription_limits(plan_tier),
    feature_name text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(plan_tier, feature_name)
);

-- Insert features for each plan
INSERT INTO subscription_features (plan_tier, feature_name)
VALUES 
-- Free tier features
('free', 'Basic Alerts'),
('free', 'Email notifications'),
('free', 'Basic filters'),
('free', '7-day history'),

-- Starter tier features
('starter', 'Smart Alerts'),
('starter', 'Email + SMS notifications'),
('starter', 'Advanced filters'),
('starter', 'Keyword exclusions'),
('starter', '14-day history'),
('starter', 'Basic analytics'),

-- Pro tier features
('pro', 'Smart Alerts'),
('pro', 'All notification channels'),
('pro', 'AI-powered matching'),
('pro', 'Price analysis'),
('pro', 'Market insights'),
('pro', '30-day history'),
('pro', 'Bulk actions'),

-- Business tier features
('business', 'Unlimited Smart Alerts'),
('business', 'Priority notifications'),
('business', 'API access'),
('business', 'Custom integrations'),
('business', 'Dedicated support'),
('business', '90-day history'),
('business', 'White-label options');

-- Add RLS policies
ALTER TABLE subscription_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to subscription_limits"
    ON subscription_limits FOR SELECT
    USING (true);

CREATE POLICY "Allow public read access to subscription_features"
    ON subscription_features FOR SELECT
    USING (true);

-- Update existing subscriptions to free tier
UPDATE subscriptions 
SET plan_tier = 'free'::plan_tier_new 
WHERE plan_tier IS NULL OR plan_tier = '';
