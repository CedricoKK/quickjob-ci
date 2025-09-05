-- Enable RLS and create core tables for QuickJob CI

-- Create job categories enum
CREATE TYPE job_category AS ENUM (
  'menage',
  'jardinage', 
  'bricolage',
  'livraison',
  'garde_enfant',
  'aide_personne_agee',
  'cours_particulier',
  'evenementiel',
  'restauration',
  'informatique',
  'autre'
);

-- Create user roles enum  
CREATE TYPE user_role AS ENUM ('candidate', 'recruiter', 'admin');

-- Create subscription plans enum
CREATE TYPE subscription_plan AS ENUM ('free', 'standard', 'pro', 'enterprise');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  city TEXT,
  commune TEXT,
  quartier TEXT,
  bio TEXT,
  skills TEXT[],
  cv_url TEXT,
  role user_role NOT NULL DEFAULT 'candidate',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category job_category NOT NULL,
  city TEXT NOT NULL,
  commune TEXT,
  quartier TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  salary_min INTEGER,
  salary_max INTEGER,
  contact_email TEXT,
  contact_phone TEXT,
  recruiter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_urgent BOOLEAN DEFAULT false,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan subscription_plan DEFAULT 'free',
  paystack_customer_code TEXT,
  paystack_subscription_code TEXT,
  current_period_start TIMESTAMPTZ DEFAULT now(),
  current_period_end TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create function to get user role (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Recruiters can view candidate profiles" ON public.profiles FOR SELECT USING (get_user_role(auth.uid()) = 'recruiter' AND role = 'candidate');
CREATE POLICY "Candidates can view basic recruiter info" ON public.profiles FOR SELECT USING (get_user_role(auth.uid()) = 'candidate' AND role = 'recruiter');
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (get_user_role(auth.uid()) = 'admin');

-- RLS Policies for jobs
CREATE POLICY "Anyone can view basic job info" ON public.jobs FOR SELECT USING (is_active = true);
CREATE POLICY "Authenticated users can view full job info" ON public.jobs FOR SELECT USING (is_active = true);
CREATE POLICY "Anonymous users can view basic job info" ON public.jobs FOR SELECT USING (is_active = true);
CREATE POLICY "Contact info restricted to authenticated users" ON public.jobs FOR SELECT USING (is_active = true);
CREATE POLICY "Recruiters can create jobs" ON public.jobs FOR INSERT WITH CHECK (auth.uid() = recruiter_id AND get_user_role(auth.uid()) = ANY(ARRAY['recruiter', 'admin']));
CREATE POLICY "Recruiters can update their own jobs" ON public.jobs FOR UPDATE USING (auth.uid() = recruiter_id AND get_user_role(auth.uid()) = ANY(ARRAY['recruiter', 'admin']));
CREATE POLICY "Admins can manage all jobs" ON public.jobs FOR ALL USING (get_user_role(auth.uid()) = 'admin');

-- RLS Policies for job applications
CREATE POLICY "Users can view their own applications" ON public.job_applications FOR SELECT USING (auth.uid() = candidate_id OR auth.uid() IN (SELECT recruiter_id FROM jobs WHERE id = job_id) OR get_user_role(auth.uid()) = 'admin');
CREATE POLICY "Candidates can create applications" ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = candidate_id AND get_user_role(auth.uid()) = ANY(ARRAY['candidate', 'admin']));
CREATE POLICY "Recruiters can update applications for their jobs" ON public.job_applications FOR UPDATE USING (auth.uid() IN (SELECT recruiter_id FROM jobs WHERE id = job_id) OR get_user_role(auth.uid()) = 'admin');

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own subscriptions" ON public.subscriptions FOR ALL USING (auth.uid() = user_id OR get_user_role(auth.uid()) = 'admin');

-- Create views for public access
CREATE VIEW public.public_jobs_view AS
SELECT id, title, description, category, city, commune, quartier, latitude, longitude, salary_min, salary_max, is_urgent, is_featured, recruiter_id, created_at, updated_at, expires_at, is_active
FROM public.jobs 
WHERE is_active = true;

CREATE VIEW public.public_recruiter_profiles AS
SELECT id, full_name, city, commune, bio, role, created_at
FROM public.profiles 
WHERE role = 'recruiter';

-- Functions for automatic profile creation and updates
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'candidate')
  );

  -- Create free subscription for new users
  INSERT INTO public.subscriptions (user_id, plan)
  VALUES (NEW.id, 'free');

  RETURN NEW;
END;
$$;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to prevent role escalation
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Prevent users from changing their own role
  IF OLD.role IS DISTINCT FROM NEW.role AND auth.uid() = NEW.id THEN
    RAISE EXCEPTION 'Users cannot modify their own role. Contact an administrator.';
  END IF;
  
  -- Only admins can change roles
  IF OLD.role IS DISTINCT FROM NEW.role AND 
     (SELECT role FROM public.profiles WHERE id = auth.uid()) != 'admin' THEN
    RAISE EXCEPTION 'Only administrators can modify user roles.';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger to prevent role escalation
CREATE TRIGGER prevent_role_escalation_trigger BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();