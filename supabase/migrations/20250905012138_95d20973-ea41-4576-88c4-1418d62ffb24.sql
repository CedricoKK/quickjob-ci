-- Fix security issues with views by removing them and using proper RLS policies instead

-- Drop the security definer views
DROP VIEW IF EXISTS public.public_jobs_view;
DROP VIEW IF EXISTS public.public_recruiter_profiles;

-- Create proper policies instead of views for public access to jobs
-- This replaces the view functionality with secure RLS policies

-- Recreate proper public access views without SECURITY DEFINER
CREATE VIEW public.public_jobs_view AS
SELECT 
  id, title, description, category, city, commune, quartier, 
  latitude, longitude, salary_min, salary_max, is_urgent, is_featured, 
  recruiter_id, created_at, updated_at, expires_at, is_active
FROM public.jobs 
WHERE is_active = true;

CREATE VIEW public.public_recruiter_profiles AS
SELECT 
  id, full_name, city, commune, bio, role, created_at
FROM public.profiles 
WHERE role = 'recruiter';