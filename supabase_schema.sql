
-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users_data table
CREATE TABLE IF NOT EXISTS users_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  calculation_type VARCHAR(50) NOT NULL, -- 'calculator', 'substitution', 'recipe'
  food_name VARCHAR(255),
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster queries by user
CREATE INDEX IF NOT EXISTS idx_users_data_user_id ON users_data(user_id);

-- Enable Row Level Security
ALTER TABLE users_data ENABLE ROW LEVEL SECURITY;

-- Create Policy: Users can only view their own data
CREATE POLICY "Users can view own data" 
ON users_data 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create Policy: Users can insert their own data
CREATE POLICY "Users can insert own data" 
ON users_data 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create Policy: Users can update their own data
CREATE POLICY "Users can update own data" 
ON users_data 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create Policy: Users can delete their own data
CREATE POLICY "Users can delete own data" 
ON users_data 
FOR DELETE 
USING (auth.uid() = user_id);
