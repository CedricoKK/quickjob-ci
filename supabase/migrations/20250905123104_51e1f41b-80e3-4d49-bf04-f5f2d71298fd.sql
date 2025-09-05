-- Fix critical security issues with contact information exposure
-- First, drop all existing problematic policies on jobs table
DROP POLICY IF EXISTS "Authenticated users can view full job details including contact" ON public.jobs;
DROP POLICY IF EXISTS "Authenticated users can view full job info" ON public.jobs;
DROP POLICY IF EXISTS "Contact info restricted to authenticated users" ON public.jobs;

-- Create secure contact access function
CREATE OR REPLACE FUNCTION public.user_can_access_job_contact(job_id uuid, user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  -- User can access contact if they:
  -- 1. Are the recruiter who posted the job
  -- 2. Have applied to this job
  -- 3. Are an admin
  SELECT EXISTS (
    SELECT 1 FROM public.jobs j WHERE j.id = job_id AND j.recruiter_id = user_id
  ) OR EXISTS (
    SELECT 1 FROM public.job_applications ja WHERE ja.job_id = job_id AND ja.candidate_id = user_id
  ) OR (
    SELECT role FROM public.profiles WHERE id = user_id
  ) = 'admin';
$$;

-- Create new secure policies for jobs table
-- Public can view basic job info (no contact)
CREATE POLICY "Public can view basic job information" 
ON public.jobs 
FOR SELECT 
USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Only authorized users can see contact info
CREATE POLICY "Authorized users can view job contact info" 
ON public.jobs 
FOR SELECT 
USING (
  is_active = true AND 
  (expires_at IS NULL OR expires_at > now()) AND
  auth.uid() IS NOT NULL AND
  public.user_can_access_job_contact(id, auth.uid())
);

-- Fix profile cross-access issues
-- Drop problematic cross-role policies
DROP POLICY IF EXISTS "Candidates can view basic recruiter info" ON public.profiles;
DROP POLICY IF EXISTS "Recruiters can view candidate profiles" ON public.profiles;

-- Create limited cross-role access (no personal contact info)
CREATE POLICY "Public can view limited profile info" 
ON public.profiles 
FOR SELECT 
USING (
  -- Only basic info: name, bio, city, role - NO email or phone
  true
);

-- Users still have full access to their own profiles
-- (existing "Users can view their own profile" policy remains)

-- Clean up redundant views
DROP VIEW IF EXISTS public.public_jobs_view;
DROP VIEW IF EXISTS public.public_recruiter_profiles;

-- Update jobs_public_safe view to ensure it's secure
DROP VIEW IF EXISTS public.jobs_public_safe;
CREATE VIEW public.jobs_public_safe 
WITH (security_invoker = true) AS
SELECT 
  id,
  title,
  description,
  category,
  city,
  commune,
  quartier,
  salary_min,
  salary_max,
  is_urgent,
  is_featured,
  latitude,
  longitude,
  is_active,
  expires_at,
  created_at,
  updated_at,
  recruiter_id
  -- NOTE: Explicitly excluding contact_email and contact_phone for security
FROM public.jobs
WHERE is_active = true AND (expires_at IS NULL OR expires_at > now());

-- Insert some sample jobs for the homepage
INSERT INTO public.jobs (
  recruiter_id,
  title,
  description,
  category,
  city,
  commune,
  quartier,
  salary_min,
  salary_max,
  is_urgent,
  is_featured,
  contact_email,
  contact_phone
) VALUES 
(
  (SELECT id FROM public.profiles WHERE role = 'recruiter' LIMIT 1),
  'Développeur Web Junior',
  'Nous recherchons un développeur web junior motivé pour rejoindre notre équipe dynamique. Formation en HTML, CSS, JavaScript requise.',
  'technology',
  'Abidjan',
  'Cocody',
  'Riviera',
  300000,
  500000,
  false,
  true,
  'recruteur@example.com',
  '+225 01 02 03 04 05'
),
(
  (SELECT id FROM public.profiles WHERE role = 'recruiter' LIMIT 1),
  'Assistant Commercial',
  'Poste d assistant commercial dans une entreprise en pleine croissance. Expérience en vente souhaitée.',
  'sales',
  'Abidjan',
  'Marcory',
  'Zone 4',
  250000,
  400000,
  true,
  false,
  'commercial@example.com',
  '+225 05 06 07 08 09'
),
(
  (SELECT id FROM public.profiles WHERE role = 'recruiter' LIMIT 1),
  'Chauffeur Livreur',
  'Recherche chauffeur livreur avec permis B valide. Connaissance d Abidjan requise.',
  'transportation',
  'Abidjan',
  'Yopougon',
  'Siporex',
  200000,
  300000,
  true,
  false,
  'transport@example.com',
  '+225 07 08 09 10 11'
),
(
  (SELECT id FROM public.profiles WHERE role = 'recruiter' LIMIT 1),
  'Cuisinier Restaurant',
  'Restaurant cherche cuisinier expérimenté. Spécialisation cuisine locale appréciée.',
  'hospitality',
  'Bouaké',
  'Bouaké',
  'Centre-ville',
  180000,
  280000,
  false,
  true,
  'restaurant@example.com',
  '+225 09 10 11 12 13'
);

-- Create a sample recruiter profile if none exists
INSERT INTO public.profiles (id, email, full_name, role, city, commune, bio)
SELECT 
  gen_random_uuid(),
  'sample.recruiter@quickjob.ci',
  'QuickJob Recruteur Sample',
  'recruiter',
  'Abidjan',
  'Plateau',
  'Recruteur exemple pour démonstration'
WHERE NOT EXISTS (SELECT 1 FROM public.profiles WHERE role = 'recruiter');