-- Add indexes for frequently accessed columns and foreign keys

-- Alerts table indexes
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_category ON alerts(category);
CREATE INDEX IF NOT EXISTS idx_alerts_is_active ON alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at);
CREATE INDEX IF NOT EXISTS idx_alerts_last_check_at ON alerts(last_check_at);

-- Matches table indexes
CREATE INDEX IF NOT EXISTS idx_matches_alert_id ON matches(alert_id);
CREATE INDEX IF NOT EXISTS idx_matches_craigslist_id ON matches(craigslist_id);
CREATE INDEX IF NOT EXISTS idx_matches_datetime ON matches(datetime);
CREATE INDEX IF NOT EXISTS idx_matches_category ON matches(category);
CREATE INDEX IF NOT EXISTS idx_matches_is_viewed ON matches(is_viewed);
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches(created_at);

-- Create GiST index for location-based queries (if coordinates are present)
CREATE INDEX IF NOT EXISTS idx_matches_location ON matches USING gist (
    ll_to_earth(
        (CASE 
            WHEN latitude ~ '^[-+]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)$' 
            THEN latitude::float 
            ELSE NULL 
        END),
        (CASE 
            WHEN longitude ~ '^[-+]?([0-9]*\.?[0-9]+|[0-9]+\.?[0-9]*)$' 
            THEN longitude::float 
            ELSE NULL 
        END)
    )
) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- Subscriptions table indexes
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_plan_name ON subscriptions(plan_name);

-- Audit logs table indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type ON audit_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

-- Add trigram indexes for text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_matches_title_trgm ON matches USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_matches_post_content_trgm ON matches USING gin(post_content gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_alerts_keywords_trgm ON alerts USING gin(keywords gin_trgm_ops);
