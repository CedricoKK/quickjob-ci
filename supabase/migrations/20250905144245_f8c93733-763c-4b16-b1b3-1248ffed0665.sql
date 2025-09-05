-- Create subscription upgrade plans table for test accounts
INSERT INTO public.profiles (id, email, full_name, role) VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@test.ci', 'Administrateur Test', 'admin'),
  ('00000000-0000-0000-0000-000000000002', 'recruteur@test.ci', 'Recruteur Test', 'recruiter'),
  ('00000000-0000-0000-0000-000000000003', 'candidat@test.ci', 'Candidat Test', 'candidate')
ON CONFLICT (email) DO NOTHING;

-- Update subscriptions table to add Paystack fields and trial period
ALTER TABLE public.subscriptions 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS monthly_price INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS annual_price INTEGER DEFAULT 0;

-- Create ratings table for candidate ratings by recruiters  
CREATE TABLE IF NOT EXISTS public.candidate_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id UUID NOT NULL,
  candidate_id UUID NOT NULL, 
  job_id UUID NOT NULL,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(recruiter_id, candidate_id, job_id)
);

-- Enable RLS
ALTER TABLE public.candidate_ratings ENABLE ROW LEVEL SECURITY;

-- Policies for candidate ratings
CREATE POLICY "Recruiters can create ratings" 
ON public.candidate_ratings 
FOR INSERT 
WITH CHECK (
  auth.uid() = recruiter_id AND 
  get_user_role(auth.uid()) = ANY(ARRAY['recruiter'::user_role, 'admin'::user_role])
);

CREATE POLICY "Recruiters can view their ratings" 
ON public.candidate_ratings 
FOR SELECT 
USING (
  auth.uid() = recruiter_id OR 
  get_user_role(auth.uid()) = 'admin'::user_role
);

CREATE POLICY "Recruiters can update their ratings" 
ON public.candidate_ratings 
FOR UPDATE 
USING (
  auth.uid() = recruiter_id OR 
  get_user_role(auth.uid()) = 'admin'::user_role
);

-- Add availability status to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS availability_status TEXT DEFAULT 'available' CHECK (availability_status IN ('available', 'unavailable', 'busy'));

-- Create notifications table  
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  type TEXT DEFAULT 'info',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies for notifications
CREATE POLICY "Users can view their notifications" 
ON public.notifications 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications" 
ON public.notifications 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can create notifications" 
ON public.notifications 
FOR INSERT 
WITH CHECK (get_user_role(auth.uid()) = 'admin'::user_role);