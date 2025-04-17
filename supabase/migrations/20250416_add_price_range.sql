-- Add price range columns to alerts table
ALTER TABLE alerts
ADD COLUMN min_price INTEGER,
ADD COLUMN max_price INTEGER,
ADD CONSTRAINT price_range_check CHECK (
    max_price IS NULL OR 
    min_price IS NULL OR 
    max_price >= min_price
);
