
export interface Business {
  id?: string;
  user_id: string;
  name: string;
  email: string;
  category: string;
  primary_product_or_service: string | null;
  area: string | null;
  address: string | null;
  phone_whatsapp: string | null;
  phone: string | null;
  image_url: string | null;
  description: string | null;
  location: string | null;
  city: string;
  services: string[] | null;
  status: 'active' | 'pending' | 'inactive';
  is_verified: boolean;
  hub_tier: string | null;
  subscription_tier: string | null;
  latitude: number | null;
  longitude: number | null;
  integrity_grade?: string;
  verification_status?: string;
  verification_level?: string;
  is_export_ready?: boolean;
  premium_features_enabled?: boolean;
  active_features?: any;
  products?: any[];
  created_at?: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  created_at?: string;
  updated_at?: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'pending' | 'completed' | 'failed';
  description?: string;
  created_at?: string;
}

export interface Product {
  id: string;
  business_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category?: string;
  created_at?: string;
}

export interface Saving {
  id: string;
  user_id: string;
  amount: number;
  goal?: string;
  status: 'active' | 'completed' | 'cancelled';
  created_at?: string;
}

export interface ThriftGroup {
  id: string;
  name: string;
  description?: string;
  contribution_amount: number;
  cycle_period: 'daily' | 'weekly' | 'monthly';
  member_count: number;
  created_at?: string;
}

export interface LogisticsOrder {
  id: string;
  user_id?: string;
  user_email: string;
  business_id?: string;
  pickup_address: string;
  delivery_address: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  tracking_number?: string;
  trackingId?: string;
  carrier?: string;
  totalFee?: number;
  timestamp?: string;
  created_at?: string;
}

export interface Hotel {
  id: string;
  business_id?: string;
  name: string;
  address: string;
  description?: string;
  rooms_available: number;
  price_per_night: number;
  image_url?: string;
  created_at?: string;
}

export enum SubscriptionTier {
  FREE = 'Free',
  VERIFIED = 'Verified',
  GROWTH = 'Growth',
  PREMIUM = 'Premium'
}

export enum HubTier {
  STARTER = 'Starter',
  LOCAL_TRUST = 'Local Trust',
  GROWTH_ENGINE = 'Growth Engine',
  ENTERPRISE_HUB = 'Enterprise Hub'
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed'
}

export interface PlatformConfig {
  id: number;
  app_logo?: string;
  oracle_avatar?: string;
  hero_images?: string[];
  hero_videos?: string[];
  facebook_url?: string;
  instagram_url?: string;
  twitter_url?: string;
  tiktok_url?: string;
  domain_activated?: boolean;
  updated_at?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  priority?: number;
  due_date?: string;
  updated_at?: string;
}

export interface PaymentLog {
  id: string;
  order_id?: string;
  amount: number;
  status: string;
  provider: string;
  created_at?: string;
}

export interface Order {
  id: string;
  buyer_id?: string;
  merchant_id?: string;
  amount: number;
  commission_deducted: number;
  merchant_payout: number;
  status: OrderStatus;
  created_at?: string;
  merchant?: Business;
}

export interface Room {
  id: string;
  hotel_id: string;
  type: string;
  price: number;
  is_available: boolean;
}

export interface Booking {
  id: string;
  user_id: string;
  item_id: string;
  type: 'hotel' | 'service';
  status: string;
  created_at?: string;
}

export interface LedgerEntry {
  id: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  created_at?: string;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at?: string;
}

export interface Advertorial {
  id: string;
  title: string;
  content: string;
  image_url?: string;
}

export interface AdPlan {
  id: string;
  name: string;
  price: number;
  duration_days: number;
}
export interface ThriftAccount { 
  id: string; 
  user_email: string; 
  total_saved: number; 
  cycle: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  status: 'active' | 'matured' | 'withdrawn';
  start_date: string;
  locked_until: string;
  service_fee_rate: number;
}

export interface ThriftContribution { 
  id: string; 
  account_id: string; 
  amount: number; 
  created_at: string; 
}

export interface ThriftGroupMember { 
  id: string; 
  group_id: string; 
  user_id: string; 
}

export interface ThriftGroupContribution { 
  id: string; 
  group_id: string; 
  user_id: string; 
  amount: number; 
}

export interface ThriftPayout { 
  id: string; 
  group_id: string; 
  user_id: string; 
  amount: number; 
  date: string; 
}

export interface Dispute { 
  id: string; 
  order_id: string; 
  merchant_id: string; 
  reason: string; 
  status: string; 
  resolved_at?: string; 
}

export interface QualityAudit { 
  id: string; 
  business_id: string; 
  score: number; 
  notes?: string; 
}

export enum RoomType {
  STANDARD = 'Standard',
  DELUXE = 'Deluxe',
  SUITE = 'Suite',
  SR_EXEC = 'SR_EXEC',
  SR_PRESIDENTIAL = 'SR_PRESIDENTIAL'
}

export interface BuyerSignal { 
  id: string; 
  user_id: string; 
  category: string; 
  intent: string; 
}

export interface SignalInterest { 
  id: string; 
  signal_id: string; 
  merchant_id: string; 
}

export interface AdCampaign { 
  id: string; 
  name: string; 
  budget: number; 
  status: string; 
}

export interface HospitalityConfig { 
  id: string; 
  hotel_id: string; 
  check_in_time: string; 
  check_out_time: string; 
}

export interface AppNotification { 
  id: string; 
  user_id: string; 
  title: string; 
  message: string; 
  type?: string; 
  read: boolean; 
  created_at: string; 
  timestamp?: string; 
}

export interface HubTierRecord { 
  id: string; 
  name: string; 
  price: number; 
}

export interface SupportMessage { 
  id: string; 
  user_id: string; 
  subject: string; 
  message: string; 
  status: string; 
}

export interface User {
  id: string;
  email?: string;
}
