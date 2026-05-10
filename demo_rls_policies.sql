-- Phase 6b: RLS Policies for Demo Tables
-- Run this in Supabase SQL Editor
-- Note: PostgreSQL does not support "IF NOT EXISTS" for policies.
-- This script uses DROP + CREATE to be safe on re-runs.

-- FARMERS
DROP POLICY IF EXISTS "Allow anon read farmers" ON public.farmers;
DROP POLICY IF EXISTS "Allow anon insert farmers" ON public.farmers;
CREATE POLICY "Allow anon read farmers" ON public.farmers FOR SELECT USING (true);
CREATE POLICY "Allow anon insert farmers" ON public.farmers FOR INSERT WITH CHECK (true);

-- ORDERS
DROP POLICY IF EXISTS "Allow anon read orders" ON public.orders;
DROP POLICY IF EXISTS "Allow anon insert orders" ON public.orders;
DROP POLICY IF EXISTS "Allow anon update orders" ON public.orders;
CREATE POLICY "Allow anon read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow anon insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update orders" ON public.orders FOR UPDATE USING (true);

-- FARM_PLOTS
DROP POLICY IF EXISTS "Allow anon read farm_plots" ON public.farm_plots;
DROP POLICY IF EXISTS "Allow anon insert farm_plots" ON public.farm_plots;
CREATE POLICY "Allow anon read farm_plots" ON public.farm_plots FOR SELECT USING (true);
CREATE POLICY "Allow anon insert farm_plots" ON public.farm_plots FOR INSERT WITH CHECK (true);

-- API_LOGS
DROP POLICY IF EXISTS "Allow anon read api_logs" ON public.api_logs;
DROP POLICY IF EXISTS "Allow anon insert api_logs" ON public.api_logs;
CREATE POLICY "Allow anon read api_logs" ON public.api_logs FOR SELECT USING (true);
CREATE POLICY "Allow anon insert api_logs" ON public.api_logs FOR INSERT WITH CHECK (true);

-- PROFILES
DROP POLICY IF EXISTS "Allow anon read profiles" ON public.profiles;
CREATE POLICY "Allow anon read profiles" ON public.profiles FOR SELECT USING (true);

-- Also enable Realtime for the key tables via publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.api_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.farmers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
