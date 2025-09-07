-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('candidate', 'recruiter', 'admin');

-- Create job category enum
CREATE TYPE public.job_category AS ENUM (
  'menage_nettoyage',
  'livraison_transport', 
  'garde_enfants',
  'jardinage_bricolage',
  'evenementiel_service',
  'vente_commerce',
  'restauration_hotellerie',
  'enseignement_formation',
  'sante_beaute',
  'informatique_digital',
  'autres'
);

-- Create job status enum
CREATE TYPE public.job_status AS ENUM ('pending', 'approved', 'rejected');

-- Create application status enum
CREATE TYPE public.application_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');

-- Create subscription plan enum
CREATE TYPE public.subscription_plan AS ENUM ('standard', 'pro', 'enterprise');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  city TEXT,
  district TEXT,
  role app_role NOT NULL DEFAULT 'candidate',
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[],
  experience_years INTEGER,
  cv_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category job_category NOT NULL,
  city TEXT NOT NULL,
  district TEXT,
  address TEXT,
  salary_min INTEGER,
  salary_max INTEGER,
  is_urgent BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  requirements TEXT[],
  contact_phone TEXT,
  contact_email TEXT,
  status job_status NOT NULL DEFAULT 'pending',
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  cover_letter TEXT,
  status application_status NOT NULL DEFAULT 'pending',
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

-- Create subscriptions table
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan subscription_plan NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create jobs_public_safe view for public job listings
CREATE VIEW public.jobs_public_safe AS 
SELECT 
  j.id,
  j.title,
  j.description,
  j.category,
  j.city,
  j.district,
  j.salary_min,
  j.salary_max,
  j.is_urgent,
  j.is_featured,
  j.requirements,
  j.contact_phone,
  j.contact_email,
  j.created_at,
  p.full_name as recruiter_name,
  p.phone as recruiter_phone
FROM public.jobs j
JOIN public.profiles p ON j.recruiter_id = p.id
WHERE j.status = 'approved' AND j.is_active = true;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = _user_id AND role = _role
  );
$$;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin');
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- RLS Policies for jobs
CREATE POLICY "Anyone can view approved active jobs" ON public.jobs
  FOR SELECT USING (status = 'approved' AND is_active = true);

CREATE POLICY "Recruiters can view their own jobs" ON public.jobs
  FOR SELECT USING (recruiter_id = auth.uid());

CREATE POLICY "Admins can view all jobs" ON public.jobs
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Recruiters can create jobs" ON public.jobs
  FOR INSERT WITH CHECK (
    auth.uid() = recruiter_id AND 
    public.has_role(auth.uid(), 'recruiter')
  );

CREATE POLICY "Recruiters can update their own jobs" ON public.jobs
  FOR UPDATE USING (recruiter_id = auth.uid());

CREATE POLICY "Admins can update any job" ON public.jobs
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- RLS Policies for job applications
CREATE POLICY "Candidates can view their own applications" ON public.job_applications
  FOR SELECT USING (candidate_id = auth.uid());

CREATE POLICY "Recruiters can view applications for their jobs" ON public.job_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE id = job_id AND recruiter_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all applications" ON public.job_applications
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Candidates can create applications" ON public.job_applications
  FOR INSERT WITH CHECK (
    candidate_id = auth.uid() AND 
    public.has_role(auth.uid(), 'candidate')
  );

CREATE POLICY "Candidates can update their own applications" ON public.job_applications
  FOR UPDATE USING (candidate_id = auth.uid());

CREATE POLICY "Recruiters can update applications for their jobs" ON public.job_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.jobs 
      WHERE id = job_id AND recruiter_id = auth.uid()
    )
  );

-- RLS Policies for subscriptions
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all subscriptions" ON public.subscriptions
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Users can create their own subscriptions" ON public.subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own subscriptions" ON public.subscriptions
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can update any subscription" ON public.subscriptions
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'candidate')::app_role
  );
  RETURN new;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at
  BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample jobs data
INSERT INTO public.jobs (
  id,
  recruiter_id,
  title,
  description,
  category,
  city,
  district,
  salary_min,
  salary_max,
  is_urgent,
  is_featured,
  status,
  contact_phone,
  contact_email,
  created_at
) VALUES 
(gen_random_uuid(), gen_random_uuid(), 'Femme de ménage - Cocody', 'Recherche femme de ménage expérimentée pour entretien maison familiale 3 fois par semaine.', 'menage_nettoyage', 'Abidjan', 'Cocody', 80000, 120000, false, true, 'approved', '+225 07 12 34 56 78', 'contact@famille-martin.ci', now() - interval '2 hours'),
(gen_random_uuid(), gen_random_uuid(), 'Livreur moto - Plateau', 'Livreur à moto pour livraisons express dans Abidjan. Moto fournie.', 'livraison_transport', 'Abidjan', 'Plateau', 100000, 150000, true, false, 'approved', '+225 05 98 76 54 32', 'rh@speeddelivery.ci', now() - interval '5 hours'),
(gen_random_uuid(), gen_random_uuid(), 'Garde d''enfants - Marcory', 'Garde d''enfants (2 ans et 4 ans) du lundi au vendredi, 7h-17h.', 'garde_enfants', 'Abidjan', 'Marcory', 90000, 130000, false, true, 'approved', '+225 01 23 45 67 89', 'famille.kone@gmail.com', now() - interval '1 day'),
(gen_random_uuid(), gen_random_uuid(), 'Jardinier - Riviera', 'Entretien jardin et espaces verts, 2 fois par semaine.', 'jardinage_bricolage', 'Abidjan', 'Riviera', 60000, 90000, false, false, 'approved', '+225 07 11 22 33 44', 'villa.riviera@outlook.com', now() - interval '3 days'),
(gen_random_uuid(), gen_random_uuid(), 'Serveur événementiel - Yopougon', 'Service pour événements privés et professionnels, weekends principalement.', 'evenementiel_service', 'Abidjan', 'Yopougon', 5000, 8000, false, false, 'approved', '+225 05 44 55 66 77', 'events@prestige-ci.com', now() - interval '1 week'),
(gen_random_uuid(), gen_random_uuid(), 'Vendeur boutique - Adjamé', 'Vente articles de mode, expérience commerce souhaité.', 'vente_commerce', 'Abidjan', 'Adjamé', 85000, 110000, true, true, 'approved', '+225 01 77 88 99 00', 'boutique.fashion@yahoo.fr', now() - interval '2 days'),
(gen_random_uuid(), gen_random_uuid(), 'Cuisinier - Treichville', 'Cuisinier pour restaurant local, spécialités ivoiriennes.', 'restauration_hotellerie', 'Abidjan', 'Treichville', 120000, 180000, false, false, 'approved', '+225 07 33 44 55 66', 'restaurant.akwaba@gmail.com', now() - interval '4 days'),
(gen_random_uuid(), gen_random_uuid(), 'Professeur particulier - Deux Plateaux', 'Cours particuliers mathématiques niveau collège/lycée.', 'enseignement_formation', 'Abidjan', 'Deux Plateaux', 3000, 5000, false, true, 'approved', '+225 05 22 33 44 55', 'prof.maths.ci@gmail.com', now() - interval '6 days'),
(gen_random_uuid(), gen_random_uuid(), 'Coiffeuse - Koumassi', 'Coiffeuse expérimentée pour salon de beauté moderne.', 'sante_beaute', 'Abidjan', 'Koumassi', 75000, 120000, false, false, 'approved', '+225 01 66 77 88 99', 'salon.elegance@hotmail.com', now() - interval '5 days'),
(gen_random_uuid(), gen_random_uuid(), 'Développeur web freelance - Plateau', 'Développement sites web pour PME, télétravail possible.', 'informatique_digital', 'Abidjan', 'Plateau', 200000, 400000, true, true, 'approved', '+225 07 55 66 77 88', 'tech@digitalsolutions.ci', now() - interval '3 hours'),
(gen_random_uuid(), gen_random_uuid(), 'Agent de sécurité - Bouaké Centre', 'Surveillance locaux commerciaux, horaires de nuit.', 'autres', 'Bouaké', 'Centre', 70000, 95000, false, false, 'approved', '+225 05 11 22 33 44', 'securite.bouake@yahoo.fr', now() - interval '1 day'),
(gen_random_uuid(), gen_random_uuid(), 'Mécanicien auto - Yamoussoukro', 'Réparation véhicules légers, garage établi.', 'autres', 'Yamoussoukro', 'Centre-ville', 100000, 150000, false, true, 'approved', '+225 01 44 55 66 77', 'garage.capitale@gmail.com', now() - interval '2 days'),
(gen_random_uuid(), gen_random_uuid(), 'Aide ménagère - San Pedro', 'Ménage et repassage, 3 fois par semaine.', 'menage_nettoyage', 'San Pedro', 'Centre', 65000, 85000, false, false, 'approved', '+225 07 88 99 00 11', 'maison.sanpedro@outlook.com', now() - interval '4 hours'),
(gen_random_uuid(), gen_random_uuid(), 'Chauffeur VTC - Daloa', 'Transport personnes avec véhicule fourni.', 'livraison_transport', 'Daloa', 'Centre', 90000, 130000, true, false, 'approved', '+225 05 77 88 99 00', 'vtc.daloa@gmail.com', now() - interval '6 hours'),
(gen_random_uuid(), gen_random_uuid(), 'Babysitter occasionnel - Korhogo', 'Garde enfants pour sorties parents, weekends.', 'garde_enfants', 'Korhogo', 'Centre', 2500, 4000, false, false, 'approved', '+225 01 55 66 77 88', 'famille.nord@yahoo.fr', now() - interval '1 week');