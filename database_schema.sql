-- AgroAgents Supabase Database Schema

-- Extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Users / Roles Table
-- Extends the default auth.users table in Supabase
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('ADMIN', 'FIELD_AGENT', 'DISTRIBUTOR', 'FINANCIER')),
  full_name TEXT,
  phone_number TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Farmers Table
CREATE TABLE public.farmers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  phone_number TEXT UNIQUE NOT NULL,
  kyc_status TEXT DEFAULT 'PENDING' CHECK (kyc_status IN ('PENDING', 'VERIFIED', 'FAILED')),
  kyc_verification_id TEXT, -- ID from CAMARA KYC API
  trust_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  agent_id UUID REFERENCES public.profiles(id)
);

-- 3. Farm Plots
CREATE TABLE public.farm_plots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES public.farmers(id) ON DELETE CASCADE,
  boundary GEOGRAPHY(POLYGON, 4326), -- PostGIS geography type for area and distance checks
  area_sqm DECIMAL,
  location_verified BOOLEAN DEFAULT FALSE, -- Result from CAMARA Location API
  crop_history TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Digital Farm Certificates
CREATE TABLE public.digital_farm_certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES public.farmers(id) ON DELETE CASCADE,
  plot_id UUID REFERENCES public.farm_plots(id) ON DELETE CASCADE,
  certificate_hash TEXT NOT NULL, -- Cryptographic hash of the verification payload
  issued_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Orders (Input Subsidy Distribution)
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES public.farmers(id),
  plot_id UUID REFERENCES public.farm_plots(id),
  distributor_id UUID REFERENCES public.profiles(id),
  status TEXT DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ASSIGNED', 'IN_TRANSIT', 'DELIVERED', 'FAILED')),
  -- Computed Input Package
  seed_qty_kg DECIMAL NOT NULL,
  fertilizer_qty_kg DECIMAL NOT NULL,
  tractor_hours DECIMAL NOT NULL,
  -- Delivery Verification
  delivery_code TEXT, -- Auth code for farmer exchange
  delivery_photo_url TEXT,
  delivery_location GEOGRAPHY(POINT, 4326),
  sim_swap_cleared BOOLEAN,
  delivered_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_farm_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Note: We will need to define RLS policies based on the user's role.
