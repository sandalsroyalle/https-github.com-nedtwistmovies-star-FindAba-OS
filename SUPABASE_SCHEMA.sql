-- ============================================================
-- FINDABA COMPLETE MASTER SCHEMA v3.0
-- Built from live Supabase database inspection May 2026
-- This matches your ACTUAL live database exactly
-- Run safely on existing database - uses IF NOT EXISTS
-- ============================================================

-- ==========================================
-- EXTENSIONS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;

-- ==========================================
-- 1. PROFILES (Auth Core)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  phone TEXT,
  full_name TEXT,
  username TEXT UNIQUE,
  role TEXT DEFAULT 'registered',
  avatar_url TEXT,
  bio TEXT,
  tier_level TEXT DEFAULT 'starter',
  total_paid INTEGER DEFAULT 0,
  subscription_status TEXT DEFAULT 'inactive',
  referral_code TEXT UNIQUE,
  referred_by UUID REFERENCES public.profiles(id),
  referral_count INTEGER DEFAULT 0,
  referral_earnings INTEGER DEFAULT 0,
  preferred_language TEXT DEFAULT 'en',
  notification_settings JSONB DEFAULT '{"email":true,"sms":false,"push":true}',
  dark_mode BOOLEAN DEFAULT false,
  streak INTEGER DEFAULT 0,
  metrics JSONB DEFAULT '{}',
  phone_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. BUSINESSES (Core Commerce Table)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  category TEXT,
  primary_product_or_service TEXT,
  area TEXT,
  address TEXT,
  phone_whatsapp TEXT,
  phone TEXT,
  image_url TEXT,
  description TEXT,
  location TEXT,
  city TEXT DEFAULT 'Aba',
  services TEXT,
  status TEXT DEFAULT 'pending',
  is_verified BOOLEAN DEFAULT false,
  hub_tier TEXT DEFAULT 'Starter',
  subscription_tier TEXT DEFAULT 'Free',
  latitude NUMERIC,
  longitude NUMERIC,
  integrity_grade TEXT DEFAULT 'C',
  verification_status TEXT DEFAULT 'Unverified',
  verification_level TEXT DEFAULT 'Listed',
  is_export_ready BOOLEAN DEFAULT false,
  capacity_indicator TEXT,
  premium_features_enabled BOOLEAN DEFAULT false,
  active_features JSONB DEFAULT '{}',
  products JSONB DEFAULT '[]',
  rating NUMERIC DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  video_caption TEXT,
  business_type TEXT,
  catalog_images TEXT[],
  videos JSONB DEFAULT '[]',
  bank_name TEXT,
  account_number TEXT,
  account_name TEXT,
  skills TEXT[],
  experience_years INTEGER,
  portfolio_images TEXT[],
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

-- Safe column additions
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS hub_tier TEXT DEFAULT 'Starter';
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'Free';
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Aba';
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS services TEXT;

-- Make area and category nullable
ALTER TABLE public.businesses ALTER COLUMN area DROP NOT NULL;
ALTER TABLE public.businesses ALTER COLUMN category DROP NOT NULL;

-- ==========================================
-- 3. BUSINESS_DETAILS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.business_details (
  id BIGSERIAL PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  services TEXT,
  description TEXT
);
ALTER TABLE public.business_details ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 4. BUSINESS_META
-- ==========================================
CREATE TABLE IF NOT EXISTS public.business_meta (
  id BIGSERIAL PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  rating NUMERIC DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'approved',
  verification TEXT DEFAULT 'Verified',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  business_type TEXT DEFAULT 'General',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.business_meta ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 5. BUSINESS_CLAIMS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.business_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  otp_code TEXT,
  otp_hash TEXT,
  otp_expires_at TIMESTAMPTZ,
  otp_attempts INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending',
  attempts INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '24 hours'),
  verified_at TIMESTAMPTZ,
  last_otp_sent_at TIMESTAMPTZ DEFAULT now(),
  locked_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.business_claims ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 6. POSTS (Social Commerce)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT,
  media_url TEXT,
  media_type TEXT DEFAULT 'image',
  action_type TEXT DEFAULT 'none',
  action_label TEXT,
  price INTEGER,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 7. COMMENTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 8. LIKES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(post_id, user_id)
);
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 9. STORIES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT DEFAULT 'image',
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 10. FOLLOWERS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(follower_id, following_id)
);
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 11. FAVORITES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_email TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, business_id)
);
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 12. ORDERS & ESCROW
-- ==========================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
  product_id TEXT,
  buyer_id UUID NOT NULL REFERENCES public.profiles(id),
  seller_id UUID NOT NULL REFERENCES public.profiles(id),
  merchant_id UUID REFERENCES public.businesses(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL CHECK (amount > 0),
  commission_deducted INTEGER DEFAULT 0,
  merchant_payout INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending','paid','processing','shipped','delivered',
    'disputed','released','completed','cancelled','refunded','reversed'
  )),
  reference TEXT UNIQUE,
  tracking_id TEXT,
  escrow_release_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 13. DISPUTES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  merchant_id UUID,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open','resolving','resolved','cancelled')),
  evidence_urls TEXT[],
  resolution TEXT,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 14. MESSAGES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id TEXT,
  sender_id UUID NOT NULL REFERENCES public.profiles(id),
  receiver_id UUID NOT NULL REFERENCES public.profiles(id),
  body TEXT NOT NULL,
  attachments JSONB DEFAULT '[]',
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent','delivered','read')),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 15. WALLETS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance INTEGER DEFAULT 0 CHECK (balance >= 0),
  currency TEXT DEFAULT 'NGN',
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 16. TRANSACTIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('credit','debit','deposit','withdrawal','payment','refund')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','success','failed')),
  description TEXT,
  reference TEXT UNIQUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 17. PAYMENTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  plan_id TEXT,
  amount INTEGER,
  provider TEXT,
  status TEXT,
  reference TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 18. NOTIFICATIONS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT,
  type TEXT,
  data JSONB DEFAULT '{}',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 19. ADS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  type TEXT,
  title TEXT,
  description TEXT,
  image_url TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  price_paid INTEGER,
  status TEXT DEFAULT 'pending',
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 20. AD_CAMPAIGNS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.ad_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id TEXT,
  type TEXT,
  title TEXT,
  description TEXT,
  image_url TEXT,
  target_url TEXT,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  views INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  price_paid NUMERIC,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  owner_id UUID
);
ALTER TABLE public.ad_campaigns ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 21. AD_PLANS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.ad_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  ad_type TEXT,
  duration_days INTEGER,
  price NUMERIC,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ad_plans ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 22. ADVERTORIALS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.advertorials (
  id TEXT PRIMARY KEY,
  title TEXT,
  content TEXT,
  grounding JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  veracity_index INTEGER,
  risk_assessment TEXT
);
ALTER TABLE public.advertorials ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 23. REPORTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 24. LOGISTICS_ORDERS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.logistics_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  tracking_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL,
  pickup_address TEXT,
  delivery_address TEXT,
  total_fee INTEGER,
  rider_payout INTEGER,
  carrier TEXT,
  estimated_delivery TIMESTAMPTZ,
  events JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.logistics_orders ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 25. BOOKINGS (Hospitality)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  hotel_id UUID,
  room_id UUID,
  check_in TIMESTAMPTZ NOT NULL,
  check_out TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'confirmed',
  total_amount NUMERIC NOT NULL,
  payment_id UUID,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 26. ROOMS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_id TEXT NOT NULL,
  room_number TEXT NOT NULL,
  room_type TEXT NOT NULL,
  base_price INTEGER NOT NULL,
  status TEXT DEFAULT 'available',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 27. DRIVERS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  nin_verified BOOLEAN DEFAULT false,
  bvn_verified BOOLEAN DEFAULT false,
  license_verified BOOLEAN DEFAULT false,
  device_imei TEXT,
  compliance_level TEXT DEFAULT 'Level 1: Verified',
  rating FLOAT DEFAULT 5.0,
  status TEXT DEFAULT 'offline',
  current_vehicle_id UUID,
  total_earnings INTEGER DEFAULT 0,
  otp_code TEXT,
  otp_expires_at TIMESTAMPTZ,
  otp_verified BOOLEAN DEFAULT false,
  bank_name TEXT,
  account_number TEXT,
  account_name TEXT,
  bank_code TEXT,
  paystack_recipient_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 28. VEHICLES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_email TEXT NOT NULL,
  plate_number TEXT UNIQUE NOT NULL,
  vin TEXT,
  vehicle_model TEXT,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  current_lat FLOAT,
  current_lng FLOAT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 29. RIDE_BOOKINGS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.ride_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  passenger_email TEXT NOT NULL,
  driver_id UUID REFERENCES public.drivers(id),
  vehicle_id UUID REFERENCES public.vehicles(id),
  pickup_addr TEXT,
  dropoff_addr TEXT,
  amount INTEGER,
  status TEXT DEFAULT 'requested',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ride_bookings ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 30. DRIVER_SIGNALS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.driver_signals (
  driver_id UUID PRIMARY KEY REFERENCES public.drivers(id) ON DELETE CASCADE,
  vehicle_id UUID,
  lat FLOAT,
  lng FLOAT,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.driver_signals ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 31. BUYER_SIGNALS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.buyer_signals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_email TEXT NOT NULL,
  buyer_name TEXT,
  category TEXT NOT NULL,
  urgency TEXT,
  volume TEXT,
  requirement TEXT,
  status TEXT DEFAULT 'open',
  response_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.buyer_signals ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 32. SIGNAL_INTERESTS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.signal_interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id UUID REFERENCES public.buyer_signals(id) ON DELETE CASCADE,
  merchant_id TEXT NOT NULL,
  merchant_name TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.signal_interests ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 33. REFERRALS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reward_granted BOOLEAN DEFAULT false,
  reward_amount INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 34. THRIFT SAVINGS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.thrift_accounts (
  user_email TEXT PRIMARY KEY,
  cycle TEXT DEFAULT 'monthly',
  total_saved NUMERIC DEFAULT 0,
  locked_until TIMESTAMPTZ,
  service_fee_rate NUMERIC DEFAULT 0.035,
  status TEXT DEFAULT 'active',
  start_date TIMESTAMPTZ DEFAULT now(),
  bank_name TEXT,
  account_number TEXT,
  account_name TEXT,
  swift_code TEXT
);
ALTER TABLE public.thrift_accounts ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.thrift_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thrift_id TEXT REFERENCES public.thrift_accounts(user_email) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.thrift_contributions ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.thrift_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  creator_id UUID REFERENCES public.profiles(id),
  contribution_amount NUMERIC NOT NULL,
  cycle_length INTEGER NOT NULL,
  payout_frequency TEXT NOT NULL,
  start_date TIMESTAMPTZ,
  status TEXT DEFAULT 'forming',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.thrift_groups ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.thrift_group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.thrift_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  payout_position INTEGER,
  has_received BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(group_id, user_id)
);
ALTER TABLE public.thrift_group_members ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.thrift_group_contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.thrift_groups(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  amount NUMERIC NOT NULL,
  cycle_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.thrift_group_contributions ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.thrift_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID REFERENCES public.thrift_groups(id),
  user_id UUID REFERENCES public.profiles(id),
  cycle_number INTEGER,
  amount NUMERIC,
  status TEXT DEFAULT 'pending',
  paid_at TIMESTAMPTZ
);
ALTER TABLE public.thrift_payouts ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 35. PLATFORM TABLES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.platform_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  severity TEXT DEFAULT 'info',
  payload JSONB DEFAULT '{}',
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.platform_logs ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.platform_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  app_logo TEXT,
  oracle_avatar TEXT,
  hero_images TEXT[],
  hero_videos JSONB DEFAULT '[]',
  facebook_url TEXT,
  instagram_url TEXT,
  twitter_url TEXT,
  tiktok_url TEXT,
  make_webhook_url TEXT,
  meta_config JSONB DEFAULT '{}',
  domain_activated BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT single_row CHECK (id = 1)
);
ALTER TABLE public.platform_config ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.hospitality_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  featured_hotels TEXT[],
  announcements TEXT[],
  tax_rate FLOAT DEFAULT 0.075,
  service_charge FLOAT DEFAULT 0.05,
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT single_row_hosp CHECK (id = 1)
);
ALTER TABLE public.hospitality_config ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.app_meta (
  key TEXT NOT NULL,
  value TEXT
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT,
  record_id UUID,
  action TEXT,
  performed_by UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT,
  payload JSONB,
  status TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.quality_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  auditor_id UUID REFERENCES public.profiles(id),
  score INTEGER CHECK (score >= 0 AND score <= 100),
  findings TEXT,
  recommendations TEXT,
  status TEXT DEFAULT 'pending',
  next_audit_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.quality_audits ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.vision_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  prompt TEXT,
  result_url TEXT,
  mode TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.vision_history ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID,
  order_id UUID REFERENCES public.orders(id),
  gross_amount INTEGER,
  merchant_share INTEGER,
  platform_share INTEGER,
  vat INTEGER,
  settlement_status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.ledger ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.otp_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- CLEAN RLS POLICIES
-- ==========================================

-- PROFILES
DROP POLICY IF EXISTS "profiles_select_all" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- POSTS
DROP POLICY IF EXISTS "Social Read Access" ON public.posts;
DROP POLICY IF EXISTS "Social Insert Access" ON public.posts;
DROP POLICY IF EXISTS "Social Update Access" ON public.posts;
DROP POLICY IF EXISTS "Social Delete Access" ON public.posts;
DROP POLICY IF EXISTS "posts_public_read" ON public.posts;
DROP POLICY IF EXISTS "posts_insert_own" ON public.posts;
DROP POLICY IF EXISTS "posts_update_own" ON public.posts;
DROP POLICY IF EXISTS "posts_delete_own" ON public.posts;
CREATE POLICY "posts_public_read" ON public.posts FOR SELECT USING (true);
CREATE POLICY "posts_insert_own" ON public.posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "posts_update_own" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "posts_delete_own" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- COMMENTS
DROP POLICY IF EXISTS "Comments Read Access" ON public.comments;
DROP POLICY IF EXISTS "Comments Insert Access" ON public.comments;
DROP POLICY IF EXISTS "Allow read comments" ON public.comments;
DROP POLICY IF EXISTS "Allow insert comments" ON public.comments;
DROP POLICY IF EXISTS "comments_public_read" ON public.comments;
DROP POLICY IF EXISTS "comments_insert_own" ON public.comments;
CREATE POLICY "comments_public_read" ON public.comments FOR SELECT USING (true);
CREATE POLICY "comments_insert_own" ON public.comments FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- LIKES
DROP POLICY IF EXISTS "Likes All Access" ON public.likes;
DROP POLICY IF EXISTS "likes_own" ON public.likes;
CREATE POLICY "likes_own" ON public.likes FOR ALL USING (auth.uid() = user_id);

-- MESSAGES
DROP POLICY IF EXISTS "Messages View Policy" ON public.messages;
DROP POLICY IF EXISTS "Messages Insert Policy" ON public.messages;
DROP POLICY IF EXISTS "messages_view" ON public.messages;
DROP POLICY IF EXISTS "messages_insert" ON public.messages;
CREATE POLICY "messages_view" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "messages_insert" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- WALLETS
DROP POLICY IF EXISTS "Wallet View Policy" ON public.wallets;
DROP POLICY IF EXISTS "wallets_view_own" ON public.wallets;
CREATE POLICY "wallets_view_own" ON public.wallets FOR SELECT USING (auth.uid() = user_id);

-- TRANSACTIONS
DROP POLICY IF EXISTS "Transaction View Policy" ON public.transactions;
DROP POLICY IF EXISTS "transactions_view_own" ON public.transactions;
CREATE POLICY "transactions_view_own" ON public.transactions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.wallets
    WHERE id = transactions.wallet_id AND user_id = auth.uid()
  ));

-- ORDERS
DROP POLICY IF EXISTS "Orders View Policy" ON public.orders;
DROP POLICY IF EXISTS "Orders Update Policy" ON public.orders;
DROP POLICY IF EXISTS "orders_view" ON public.orders;
DROP POLICY IF EXISTS "orders_update" ON public.orders;
CREATE POLICY "orders_view" ON public.orders FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "orders_update" ON public.orders FOR UPDATE
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- NOTIFICATIONS
DROP POLICY IF EXISTS "User Read Notifications" ON public.notifications;
DROP POLICY IF EXISTS "notifications_own" ON public.notifications;
CREATE POLICY "notifications_own" ON public.notifications FOR SELECT USING (auth.uid() = user_id);

-- FAVORITES
DROP POLICY IF EXISTS "Favorites Policy" ON public.favorites;
DROP POLICY IF EXISTS "Public Favorites" ON public.favorites;
DROP POLICY IF EXISTS "users manage favorites" ON public.favorites;
DROP POLICY IF EXISTS "Auth manage favorites" ON public.favorites;
DROP POLICY IF EXISTS "favorites_own" ON public.favorites;
CREATE POLICY "favorites_own" ON public.favorites FOR ALL USING (auth.uid() = user_id);

-- FOLLOWERS
DROP POLICY IF EXISTS "Followers Policy" ON public.followers;
DROP POLICY IF EXISTS "followers_own" ON public.followers;
CREATE POLICY "followers_own" ON public.followers FOR ALL
  USING (auth.uid() = follower_id OR auth.uid() = following_id);

-- PLATFORM CONFIG
DROP POLICY IF EXISTS "Public Read Config" ON public.platform_config;
DROP POLICY IF EXISTS "platform_config_public_read" ON public.platform_config;
CREATE POLICY "platform_config_public_read" ON public.platform_config FOR SELECT USING (true);

-- HOSPITALITY CONFIG
DROP POLICY IF EXISTS "Public Read Hospitality" ON public.hospitality_config;
DROP POLICY IF EXISTS "public read hospitality config" ON public.hospitality_config;
DROP POLICY IF EXISTS "read hospitality config" ON public.hospitality_config;
DROP POLICY IF EXISTS "hospitality_config_public_read" ON public.hospitality_config;
CREATE POLICY "hospitality_config_public_read" ON public.hospitality_config FOR SELECT USING (true);

-- ADVERTORIALS
DROP POLICY IF EXISTS "Public Read Advertorials" ON public.advertorials;
DROP POLICY IF EXISTS "Public read advertorials" ON public.advertorials;
DROP POLICY IF EXISTS "public read advertorials" ON public.advertorials;
DROP POLICY IF EXISTS "advertorials_public_read" ON public.advertorials;
CREATE POLICY "advertorials_public_read" ON public.advertorials FOR SELECT USING (true);

-- BUYER SIGNALS
DROP POLICY IF EXISTS "Public View Signals" ON public.buyer_signals;
DROP POLICY IF EXISTS "public read buyer signals" ON public.buyer_signals;
DROP POLICY IF EXISTS "Auth insert buyer signals" ON public.buyer_signals;
DROP POLICY IF EXISTS "authenticated create buyer signals" ON public.buyer_signals;
DROP POLICY IF EXISTS "buyer_signals_public_read" ON public.buyer_signals;
DROP POLICY IF EXISTS "buyer_signals_insert" ON public.buyer_signals;
CREATE POLICY "buyer_signals_public_read" ON public.buyer_signals FOR SELECT USING (true);
CREATE POLICY "buyer_signals_insert" ON public.buyer_signals FOR INSERT TO authenticated WITH CHECK (true);

-- BUSINESS CLAIMS
DROP POLICY IF EXISTS "Users can view own claims" ON public.business_claims;
DROP POLICY IF EXISTS "Users can create claims" ON public.business_claims;
DROP POLICY IF EXISTS "claims_view_own" ON public.business_claims;
DROP POLICY IF EXISTS "claims_insert" ON public.business_claims;
CREATE POLICY "claims_view_own" ON public.business_claims FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "claims_insert" ON public.business_claims FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- DRIVERS
DROP POLICY IF EXISTS "Public View Drivers" ON public.drivers;
DROP POLICY IF EXISTS "Drivers Manage Own" ON public.drivers;
DROP POLICY IF EXISTS "drivers_public_read" ON public.drivers;
DROP POLICY IF EXISTS "drivers_manage_own" ON public.drivers;
CREATE POLICY "drivers_public_read" ON public.drivers FOR SELECT USING (true);
CREATE POLICY "drivers_manage_own" ON public.drivers FOR ALL
  USING ((auth.jwt() ->> 'email') = user_email);

-- BOOKINGS
DROP POLICY IF EXISTS "users view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "users insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "users update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "users delete own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can delete own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "bookings_own" ON public.bookings;
CREATE POLICY "bookings_own" ON public.bookings FOR ALL USING (auth.uid() = user_id);

-- ADMIN CHECK FUNCTION
CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  IF auth.uid() IS NULL THEN RETURN FALSE; END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- NEW USER TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_username TEXT;
  v_full_name TEXT;
  v_referral_code TEXT;
BEGIN
  v_username := COALESCE(
    new.raw_user_meta_data->>'username',
    split_part(new.email, '@', 1)
  );
  v_full_name := COALESCE(
    new.raw_user_meta_data->>'full_name',
    v_username
  );
  v_referral_code := 'ABA' || upper(substring(md5(random()::text), 1, 6));

  INSERT INTO public.profiles (
    id, email, phone, full_name, username,
    role, referral_code, created_at, updated_at
  ) VALUES (
    new.id, new.email, new.phone, v_full_name, v_username,
    CASE WHEN new.email = 'pastornelsonezi@gmail.com'
      THEN 'admin' ELSE 'registered' END,
    v_referral_code, now(), now()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now(),
    role = CASE
      WHEN public.profiles.email = 'pastornelsonezi@gmail.com' THEN 'admin'
      ELSE public.profiles.role
    END;

  RETURN new;
EXCEPTION WHEN OTHERS THEN
  INSERT INTO public.profiles (id, email, role, referral_code)
  VALUES (
    new.id, new.email, 'registered',
    'ABA' || upper(substring(md5(new.id::text), 1, 6))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- WALLET FUNCTION
CREATE OR REPLACE FUNCTION public.ensure_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.wallets (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- ESCROW RELEASE
CREATE OR REPLACE FUNCTION public.release_escrow(
  p_order_id UUID,
  p_admin_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_order RECORD;
  v_wallet_id UUID;
  v_has_dispute BOOLEAN;
BEGIN
  SELECT * INTO v_order FROM public.orders
  WHERE id = p_order_id FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Order not found: %', p_order_id;
  END IF;

  IF v_order.status = 'completed' THEN
    RAISE EXCEPTION 'Escrow already released for order: %', p_order_id;
  END IF;

  SELECT EXISTS (
    SELECT 1 FROM public.disputes
    WHERE order_id = p_order_id AND status != 'resolved'
  ) INTO v_has_dispute;

  IF v_has_dispute AND p_admin_id IS NULL THEN
    RAISE EXCEPTION 'Escrow locked: Active dispute exists';
  END IF;

  IF v_order.status NOT IN ('paid', 'delivered') THEN
    RAISE EXCEPTION 'Order status % not eligible for release', v_order.status;
  END IF;

  INSERT INTO public.wallets (user_id)
  VALUES (v_order.seller_id) ON CONFLICT (user_id) DO NOTHING;

  SELECT id INTO v_wallet_id FROM public.wallets
  WHERE user_id = v_order.seller_id;

  UPDATE public.wallets
  SET balance = balance + v_order.merchant_payout, updated_at = now()
  WHERE id = v_wallet_id;

  INSERT INTO public.transactions (
    wallet_id, amount, type, status, description, reference
  ) VALUES (
    v_wallet_id, v_order.merchant_payout, 'credit', 'success',
    'Order Payout: ' || p_order_id, 'REL-' || p_order_id
  );

  UPDATE public.orders
  SET status = 'completed', escrow_release_at = now()
  WHERE id = p_order_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON public.businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON public.businesses(category);
CREATE INDEX IF NOT EXISTS idx_businesses_is_verified ON public.businesses(is_verified);
CREATE INDEX IF NOT EXISTS idx_businesses_area ON public.businesses(area);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON public.businesses(status);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller_id ON public.orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON public.transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON public.posts(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);

-- REALTIME
CREATE OR REPLACE FUNCTION public.enable_realtime_for(p_table_name TEXT)
RETURNS VOID AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
    AND schemaname = 'public'
    AND tablename = p_table_name
  ) THEN
    EXECUTE format(
      'ALTER PUBLICATION supabase_realtime ADD TABLE public.%I',
      p_table_name
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

SELECT public.enable_realtime_for('profiles');
SELECT public.enable_realtime_for('businesses');
SELECT public.enable_realtime_for('posts');
SELECT public.enable_realtime_for('orders');
SELECT public.enable_realtime_for('messages');
SELECT public.enable_realtime_for('wallets');
SELECT public.enable_realtime_for('notifications');
SELECT public.enable_realtime_for('driver_signals');
SELECT public.enable_realtime_for('buyer_signals');
SELECT public.enable_realtime_for('transactions');
SELECT public.enable_realtime_for('logistics_orders');
SELECT public.enable_realtime_for('thrift_accounts');
SELECT public.enable_realtime_for('thrift_groups');
SELECT public.enable_realtime_for('thrift_group_members');
SELECT public.enable_realtime_for('thrift_payouts');
SELECT public.enable_realtime_for('payments');
SELECT public.enable_realtime_for('ads');
SELECT public.enable_realtime_for('ad_campaigns');
SELECT public.enable_realtime_for('platform_logs');
SELECT public.enable_realtime_for('disputes');
SELECT public.enable_realtime_for('bookings');
SELECT public.enable_realtime_for('ride_bookings');
SELECT public.enable_realtime_for('driver_signals');
SELECT public.enable_realtime_for('favorites');
SELECT public.enable_realtime_for('followers');
SELECT public.enable_realtime_for('referrals');
SELECT public.enable_realtime_for('vision_history');
SELECT public.enable_realtime_for('quality_audits');
SELECT public.enable_realtime_for('ledger');

-- ============================================================
-- END OF FINDABA MASTER SCHEMA v3.0
-- ============================================================
