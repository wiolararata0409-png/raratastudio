/*
  # Add Stripe Integration

  ## Changes
  1. Extend subscriptions table with Stripe fields
    - Add `stripe_customer_id` - Stripe customer ID for billing
    - Add `stripe_subscription_id` - Stripe subscription ID
    - Add `stripe_price_id` - Stripe price ID for the plan
    
  2. Create payment_history table
    - Track all payment transactions
    - Store Stripe payment intent IDs
    - Record payment status and amounts
    
  3. Security
    - Enable RLS on payment_history table
    - Users can only view their own payment history
*/

-- Add Stripe fields to subscriptions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'stripe_customer_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN stripe_customer_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'stripe_subscription_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN stripe_subscription_id text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'subscriptions' AND column_name = 'stripe_price_id'
  ) THEN
    ALTER TABLE subscriptions ADD COLUMN stripe_price_id text;
  END IF;
END $$;

-- Create payment_history table
CREATE TABLE IF NOT EXISTS payment_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  stripe_payment_intent_id text UNIQUE,
  amount_pence integer NOT NULL,
  currency text DEFAULT 'gbp',
  status text NOT NULL,
  plan_type text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE payment_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_history
CREATE POLICY "Users can view own payment history"
  ON payment_history FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id ON subscriptions(stripe_subscription_id);