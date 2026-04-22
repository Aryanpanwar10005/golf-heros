-- --- DIGITAL HEROES GOLF: DATABASE SCHEMA ---
-- Run this in the Supabase SQL Editor

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  golf_index DECIMAL(4,1) DEFAULT 0.0,
  is_pro_active BOOLEAN DEFAULT FALSE,
  total_rounds INTEGER DEFAULT 0,
  charity_impact_total DECIMAL(10,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Subscriptions Table (Razorpay Integration)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  razorpay_subscription_id TEXT UNIQUE,
  status TEXT, -- 'active', 'cancelled', 'past_due'
  plan_id TEXT, -- 'monthly', 'yearly'
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Scores Table
CREATE TABLE IF NOT EXISTS scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  gross_score INTEGER CHECK (gross_score BETWEEN 1 AND 145),
  round_date DATE DEFAULT CURRENT_DATE,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, round_date) -- One score per day
);

-- 4. Draws Table
CREATE TABLE IF NOT EXISTS draws (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  draw_date TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  total_pool DECIMAL(15,2),
  winning_numbers INTEGER[], -- Array of numbers picked
  charity_contribution DECIMAL(15,2),
  jackpot_rollover DECIMAL(15,2) DEFAULT 0.0
);

-- 5. Winners Table
CREATE TABLE IF NOT EXISTS winners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  draw_id UUID REFERENCES draws(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  tier INTEGER, -- 5 (Jackpot), 4, 3 matches
  prize_amount DECIMAL(15,2),
  is_paid BOOLEAN DEFAULT FALSE
);

-- --- ROLLING-5 LOGIC STORED PROCEDURE ---
CREATE OR REPLACE FUNCTION insert_score_rolling(
  p_user_id UUID,
  p_score INTEGER
) RETURNS VOID AS $$
BEGIN
  -- Insert the new score
  INSERT INTO scores (user_id, gross_score)
  VALUES (p_user_id, p_score);

  -- Update profile: Increment total rounds and calculate simple index
  UPDATE profiles
  SET total_rounds = total_rounds + 1,
      golf_index = (
        SELECT AVG(gross_score)
        FROM (
          SELECT gross_score
          FROM scores
          WHERE user_id = p_user_id
          ORDER BY round_date DESC
          LIMIT 5
        ) AS recent_scores
      )
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- --- RLS POLICIES ---
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view their own scores" ON scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own scores" ON scores FOR INSERT WITH CHECK (auth.uid() = user_id);
