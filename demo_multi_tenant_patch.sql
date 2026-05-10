-- Phase 6: Multi-Tenant & Demo Robustness Patch
-- Run this in your Supabase SQL Editor

-- 1. Drop the UNIQUE constraint on the phone_number in the farmers table 
-- This allows multiple demo users (or the same user trying multiple times) 
-- to successfully onboard the +99999991001 number without crashing the DB.
ALTER TABLE public.farmers DROP CONSTRAINT IF EXISTS farmers_phone_number_key;

-- 2. Add tenant_id to tables to isolate data for each registered admin
ALTER TABLE public.farmers ADD COLUMN IF NOT EXISTS tenant_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS tenant_id TEXT;

-- 3. Create a dedicated API Logs table for the real-time Nokia NaC Console
CREATE TABLE IF NOT EXISTS public.api_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id TEXT,
    method TEXT NOT NULL,
    endpoint TEXT NOT NULL,
    status_code TEXT NOT NULL,
    response_body TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: Ensure Realtime is enabled for the 'api_logs' table in your Supabase Dashboard!
-- Go to Database -> Replication -> and toggle 'api_logs' to enable real-time streams.
