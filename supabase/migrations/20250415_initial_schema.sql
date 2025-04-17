-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
DROP TYPE IF EXISTS plan_type CASCADE;
DROP TYPE IF EXISTS email_frequency CASCADE;

CREATE TYPE plan_type AS ENUM ('free', 'mid', 'pro');
CREATE TYPE email_frequency AS ENUM ('never', 'daily', 'weekly', 'monthly');

-- Create profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (id)
);

-- Create subscriptions table
CREATE TABLE subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    plan_name plan_type DEFAULT 'free',
    alert_limit INTEGER,
    results_per_alert INTEGER,
    email_digest_frequency email_frequency DEFAULT 'never',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    keywords TEXT NOT NULL,
    cities JSONB NOT NULL,
    category TEXT NOT NULL,
    min_price INTEGER,
    max_price INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_check_at TIMESTAMPTZ DEFAULT NOW(),
    -- Add constraint to ensure max_price >= min_price when both are set
    CONSTRAINT price_range_check CHECK (
        max_price IS NULL OR 
        min_price IS NULL OR 
        max_price >= min_price
    )
);

-- Create matches table for storing Craigslist listings
CREATE TABLE matches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    alert_id UUID REFERENCES alerts(id) ON DELETE CASCADE,
    craigslist_id TEXT NOT NULL,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    datetime TIMESTAMPTZ NOT NULL,
    location TEXT,
    category TEXT NOT NULL,
    price TEXT,
    longitude TEXT,
    latitude TEXT,
    map_accuracy TEXT,
    post_content TEXT,
    notices TEXT[],
    phone_numbers TEXT[],
    pics TEXT[],
    amenities TEXT[],  -- For housing listings
    available_from DATE, -- For housing listings
    manufacturer TEXT,  -- For sale listings
    condition TEXT,     -- For sale listings
    model TEXT,         -- For sale listings
    attributes TEXT[],  -- Various attributes based on category
    compensation TEXT,  -- For jobs listings
    employment_type TEXT, -- For jobs listings
    job_title TEXT,    -- For jobs listings
    education TEXT,     -- For resumes
    dates TEXT,         -- For events
    is_viewed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(alert_id, craigslist_id)
);

-- Set up Row Level Security policies

-- Profiles: Users can only read/update their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Subscriptions: Users can only read their own subscription
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription" ON subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- Alerts: Users can CRUD their own alerts
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own alerts" ON alerts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create alerts" ON alerts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own alerts" ON alerts
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own alerts" ON alerts
    FOR DELETE USING (auth.uid() = user_id);

-- Matches: Users can only view matches for their own alerts
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own matches" ON matches
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM alerts
            WHERE alerts.id = matches.alert_id
            AND alerts.user_id = auth.uid()
        )
    );

-- Functions

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create profile
    INSERT INTO profiles (id, email)
    VALUES (new.id, new.email);

    -- Create free subscription
    INSERT INTO subscriptions (
        user_id,
        plan_name,
        alert_limit,
        results_per_alert,
        email_digest_frequency
    )
    VALUES (
        new.id,
        'free',
        3, -- Free plan: 3 alerts
        5,  -- Free plan: 5 results per alert
        'never'
    );

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to check alert limits before creation
CREATE OR REPLACE FUNCTION check_alert_limit()
RETURNS TRIGGER AS $$
DECLARE
    current_alert_count INTEGER;
    user_alert_limit INTEGER;
BEGIN
    -- Get current alert count
    SELECT COUNT(*)
    INTO current_alert_count
    FROM alerts
    WHERE user_id = NEW.user_id AND is_active = true;

    -- Get user's alert limit
    SELECT alert_limit
    INTO user_alert_limit
    FROM subscriptions
    WHERE user_id = NEW.user_id;

    -- Check if creating new alert would exceed limit
    IF current_alert_count >= user_alert_limit THEN
        RAISE EXCEPTION 'Alert limit reached for subscription plan';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for alert limit check
CREATE TRIGGER check_alert_limit_trigger
    BEFORE INSERT ON alerts
    FOR EACH ROW EXECUTE FUNCTION check_alert_limit();
