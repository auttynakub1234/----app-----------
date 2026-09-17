-- ============================================
-- SKM Wellness App - Supabase Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Users Profile Table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  line_id TEXT,
  avatar_url TEXT,
  goal_type TEXT CHECK (goal_type IN ('lean', 'fat_loss', 'medical_care')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  category TEXT CHECK (category IN ('lean', 'fat_loss', 'medical_care')),
  badge TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  product_id INTEGER REFERENCES public.products(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  contact TEXT NOT NULL,
  order_type TEXT CHECK (order_type IN ('trial', 'full')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- BMI Records Table
CREATE TABLE IF NOT EXISTS public.bmi_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  weight DECIMAL(5,2) NOT NULL,
  height DECIMAL(5,2) NOT NULL,
  bmi DECIMAL(4,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weight Logs Table (Daily tracking)
CREATE TABLE IF NOT EXISTS public.weight_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  weight DECIMAL(5,2) NOT NULL,
  symptom TEXT CHECK (symptom IN ('normal', 'dizzy', 'frequent', 'stable')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Checklist Table
CREATE TABLE IF NOT EXISTS public.daily_checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  checklist_date DATE NOT NULL DEFAULT CURRENT_DATE,
  morning_supplement BOOLEAN DEFAULT FALSE,
  water_intake BOOLEAN DEFAULT FALSE,
  evening_detox BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, checklist_date)
);

-- Coach Messages Table
CREATE TABLE IF NOT EXISTS public.coach_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  coach_name TEXT DEFAULT 'พญ. พิมพ์ สุขภาพดี',
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bmi_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_messages ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Products Policies (Public read access)
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

-- Orders Policies
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- BMI Records Policies
CREATE POLICY "Users can view own BMI records" ON public.bmi_records
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own BMI records" ON public.bmi_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Weight Logs Policies
CREATE POLICY "Users can view own weight logs" ON public.weight_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight logs" ON public.weight_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Daily Checklists Policies
CREATE POLICY "Users can view own checklists" ON public.daily_checklists
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checklists" ON public.daily_checklists
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checklists" ON public.daily_checklists
  FOR UPDATE USING (auth.uid() = user_id);

-- Coach Messages Policies
CREATE POLICY "Users can view own messages" ON public.coach_messages
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_checklists_updated_at BEFORE UPDATE ON public.daily_checklists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DATA (Sample Products)
-- ============================================

INSERT INTO public.products (name, description, price, category, badge, icon, color) VALUES
  ('Whey & Muscle Pro Plant', 'โปรตีนบริสุทธิ์ดูดซึมไว เสริมมวลกล้ามเนื้อ', 1290, 'lean', 'สายลีนหุ่นเฟิร์ม', '🥛', 'amber'),
  ('Keto Burn & Detox Fiber', 'บล็อกแป้ง เร่งดึงไขมันเก่ามาใช้ ไฟเบอร์ปรับสมดุล', 990, 'fat_loss', 'ลดไวไม่โทรม', '🔥', 'blue'),
  ('Glucocare Meta-Balance', 'ช่วยคุมระดับน้ำตาล ไขมันในเลือด ปลอดภัยต่อตับไต', 1590, 'medical_care', 'เน้นฟื้นฟูสุขภาพ', '🌿', 'rose')
ON CONFLICT DO NOTHING;

-- ============================================
-- INDEXES for Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_bmi_records_user_id ON public.bmi_records(user_id);
CREATE INDEX IF NOT EXISTS idx_weight_logs_user_id ON public.weight_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_weight_logs_created_at ON public.weight_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_checklists_user_date ON public.daily_checklists(user_id, checklist_date);
CREATE INDEX IF NOT EXISTS idx_coach_messages_user_id ON public.coach_messages(user_id);
