-- AI Mirror MVP Schema Additions

-- Update profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS structured_memory JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Index for stripe_customer_id
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles (stripe_customer_id);

-- Conversations table (equivalent to chats in chatbot-ui, but let's make sure)
-- chatbot-ui uses 'chats' table. We can leverage that.

-- Add memory_snapshot to messages if needed for persistence debugging
ALTER TABLE messages
ADD COLUMN IF NOT EXISTS memory_snapshot JSONB;

-- Ensure pgvector is enabled if we decide to use it later
CREATE EXTENSION IF NOT EXISTS vector;
