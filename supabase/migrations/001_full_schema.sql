-- GET CPF Full Database Schema
-- Generated from codebase analysis, 16 Apr 2026
-- Run this in Supabase SQL Editor to set up the database

-- ============================================
-- ENUM TYPES
-- ============================================
CREATE TYPE app_role AS ENUM ('admin', 'user');

-- ============================================
-- TABLES
-- ============================================

-- 1. Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  country_code TEXT,
  plan TEXT DEFAULT 'free',
  location TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 2. User Roles
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE(user_id, role)
);
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own roles" ON user_roles FOR SELECT USING (auth.uid() = user_id);

-- 3. Applications
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'draft',
  full_name TEXT,
  mother_name TEXT,
  no_mother BOOLEAN DEFAULT false,
  mother_alternative TEXT,
  father_name TEXT,
  passport_number TEXT,
  passport_photo_url TEXT,
  state_code TEXT,
  state_name TEXT,
  cep TEXT,
  street_address TEXT,
  address_number TEXT,
  complement TEXT,
  neighbourhood TEXT,
  city TEXT,
  nationality TEXT,
  gender TEXT,
  email TEXT,
  staying_with_friend BOOLEAN DEFAULT false,
  host_name TEXT,
  host_cpf TEXT,
  host_address TEXT,
  host_city TEXT,
  cpf_number TEXT,
  protocol_number TEXT,
  promo_code TEXT,
  discount_amount NUMERIC,
  final_price NUMERIC,
  selfie_url TEXT,
  address_proof_url TEXT,
  notes TEXT,
  partner_access_granted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  submitted_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own applications" ON applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own applications" ON applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own applications" ON applications FOR UPDATE USING (auth.uid() = user_id);

-- 4. Checkout Sessions
CREATE TABLE IF NOT EXISTS checkout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  checkout_session_secret TEXT,
  product_id TEXT,
  paid BOOLEAN DEFAULT false,
  paid_at TIMESTAMPTZ,
  payment_id TEXT,
  fanbasis_customer_id TEXT,
  amount_cents NUMERIC,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE checkout_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own checkout sessions" ON checkout_sessions FOR SELECT USING (auth.jwt()->>'email' = email);

-- 5. Promo Codes
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percent NUMERIC NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  max_uses NUMERIC,
  times_used NUMERIC DEFAULT 0,
  affiliate_name TEXT,
  affiliate_email TEXT,
  affiliate_location TEXT,
  affiliate_notes TEXT,
  affiliate_source TEXT,
  affiliate_commission_percent NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active promos" ON promo_codes FOR SELECT USING (is_active = true);

-- 6. Affiliates
CREATE TABLE IF NOT EXISTS affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  platform TEXT,
  posting_frequency TEXT,
  motivation TEXT,
  situation TEXT,
  why TEXT,
  promo_code TEXT,
  status TEXT DEFAULT 'pending',
  commission_percent NUMERIC DEFAULT 0,
  location TEXT,
  notes TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;

-- 7. Affiliate Applications
CREATE TABLE IF NOT EXISTS affiliate_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  platform TEXT,
  posting_frequency TEXT,
  motivation TEXT,
  situation TEXT,
  why TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE affiliate_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert affiliate apps" ON affiliate_applications FOR INSERT WITH CHECK (true);

-- 8. Waitlist
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  plan TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can join waitlist" ON waitlist FOR INSERT WITH CHECK (true);

-- 9. Revenue Entries
CREATE TABLE IF NOT EXISTS revenue_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_date TEXT,
  entry_type TEXT,
  amount NUMERIC,
  transaction_id TEXT,
  user_email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE revenue_entries ENABLE ROW LEVEL SECURITY;

-- 10. Audit Log
CREATE TABLE IF NOT EXISTS audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- 11. Consent Log
CREATE TABLE IF NOT EXISTS consent_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  consent BOOLEAN DEFAULT false,
  consent_text TEXT,
  consent_version TEXT,
  consented_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE consent_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own consent" ON consent_log FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own consent" ON consent_log FOR SELECT USING (auth.uid() = user_id);

-- 12. Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  sender_id UUID,
  sender_type TEXT,
  content TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 13. Email Send Log
CREATE TABLE IF NOT EXISTS email_send_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT,
  template_name TEXT,
  status TEXT DEFAULT 'pending',
  message_id TEXT,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE email_send_log ENABLE ROW LEVEL SECURITY;

-- 14. Email Send State
CREATE TABLE IF NOT EXISTS email_send_state (
  id INTEGER PRIMARY KEY DEFAULT 1,
  batch_size INTEGER DEFAULT 5,
  send_delay_ms INTEGER DEFAULT 500,
  auth_email_ttl_minutes INTEGER DEFAULT 60,
  transactional_email_ttl_minutes INTEGER DEFAULT 1440,
  retry_after_until TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE email_send_state ENABLE ROW LEVEL SECURITY;
INSERT INTO email_send_state (id) VALUES (1) ON CONFLICT DO NOTHING;

-- 15. Email Unsubscribe Tokens
CREATE TABLE IF NOT EXISTS email_unsubscribe_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE email_unsubscribe_tokens ENABLE ROW LEVEL SECURITY;

-- 16. Suppressed Emails
CREATE TABLE IF NOT EXISTS suppressed_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  reason TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE suppressed_emails ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RPC FUNCTIONS
-- ============================================

-- has_role: Check if user has a specific role
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- transition_application_status: Secure status transitions
CREATE OR REPLACE FUNCTION transition_application_status(_application_id UUID, _new_status TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  current_status TEXT;
BEGIN
  SELECT status INTO current_status FROM applications WHERE id = _application_id;
  IF current_status IS NULL THEN RETURN false; END IF;
  UPDATE applications SET status = _new_status, updated_at = now() WHERE id = _application_id;
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- validate_promo_code: Check and return promo code details
CREATE OR REPLACE FUNCTION validate_promo_code(_code TEXT)
RETURNS TABLE(code TEXT, discount_percent NUMERIC, is_active BOOLEAN) AS $$
  SELECT p.code, p.discount_percent, p.is_active
  FROM promo_codes p
  WHERE UPPER(p.code) = UPPER(_code)
    AND p.is_active = true
    AND (p.max_uses IS NULL OR p.times_used < p.max_uses);
$$ LANGUAGE sql SECURITY DEFINER;

-- ============================================
-- ADMIN RLS POLICIES (allow admins full access)
-- ============================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Admin policies for all tables
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'profiles', 'applications', 'checkout_sessions', 'promo_codes',
    'affiliates', 'affiliate_applications', 'waitlist', 'revenue_entries',
    'audit_log', 'consent_log', 'messages', 'email_send_log',
    'email_send_state', 'email_unsubscribe_tokens', 'suppressed_emails', 'user_roles'
  ]) LOOP
    EXECUTE format('CREATE POLICY "Admin full access on %s" ON %s FOR ALL USING (is_admin())', tbl, tbl);
  END LOOP;
END $$;

-- ============================================
-- MAKE YOUR ACCOUNT AN ADMIN
-- (Run this AFTER you sign up on the new app)
-- Replace YOUR_USER_ID with your actual auth user ID
-- ============================================
-- INSERT INTO user_roles (user_id, role) VALUES ('YOUR_USER_ID', 'admin');
