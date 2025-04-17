-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_pageviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL,
    properties JSONB DEFAULT '{}',
    user_id UUID REFERENCES auth.users(id),
    user_properties JSONB DEFAULT '{}',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create analytics pageviews table
CREATE TABLE IF NOT EXISTS analytics_pageviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path TEXT NOT NULL,
    properties JSONB DEFAULT '{}',
    user_id UUID REFERENCES auth.users(id),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create analytics users table
CREATE TABLE IF NOT EXISTS analytics_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id),
    properties JSONB DEFAULT '{}',
    first_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_seen TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    old_data JSONB DEFAULT NULL,
    new_data JSONB DEFAULT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create performance metrics table
CREATE TABLE IF NOT EXISTS performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_type TEXT NOT NULL,
    value FLOAT NOT NULL,
    route TEXT,
    user_id UUID REFERENCES auth.users(id),
    metadata JSONB DEFAULT '{}',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create error logs table
CREATE TABLE IF NOT EXISTS error_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    error_name TEXT NOT NULL,
    error_message TEXT NOT NULL,
    error_stack TEXT,
    user_id UUID REFERENCES auth.users(id),
    metadata JSONB DEFAULT '{}',
    severity TEXT NOT NULL DEFAULT 'error',
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type_timestamp ON analytics_events(event_type, timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_user_id ON analytics_pageviews(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_pageviews_path ON analytics_pageviews(path);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON error_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_type ON performance_metrics(metric_type);

-- RLS Policies

-- Analytics Events policies
CREATE POLICY "Enable read access for authenticated users" ON analytics_events
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');

CREATE POLICY "Enable insert access for authenticated users" ON analytics_events
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Analytics Pageviews policies
CREATE POLICY "Enable read access for authenticated users" ON analytics_pageviews
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');

CREATE POLICY "Enable insert access for authenticated users" ON analytics_pageviews
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Analytics Users policies
CREATE POLICY "Enable read access for authenticated users" ON analytics_users
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');

CREATE POLICY "Enable update access for authenticated users" ON analytics_users
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Audit Logs policies
CREATE POLICY "Enable read access for authenticated users" ON audit_logs
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');

CREATE POLICY "Enable insert access for authenticated users" ON audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Performance Metrics policies
CREATE POLICY "Enable read access for authenticated users" ON performance_metrics
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');

CREATE POLICY "Enable insert access for authenticated users" ON performance_metrics
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Error Logs policies
CREATE POLICY "Enable read access for authenticated users" ON error_logs
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR auth.jwt()->>'role' = 'admin');

CREATE POLICY "Enable insert access for authenticated users" ON error_logs
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);
