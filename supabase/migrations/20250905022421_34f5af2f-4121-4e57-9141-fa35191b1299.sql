-- ÉTAPE 1: Créer une vue publique sécurisée (sans informations de contact)
CREATE OR REPLACE VIEW public.jobs_public_safe AS
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
FROM public.jobs
WHERE is_active = true;

-- ÉTAPE 2: Supprimer les politiques RLS dangereuses qui exposent toutes les colonnes
DROP POLICY IF EXISTS "Anonymous users can view basic job info" ON public.jobs;
DROP POLICY IF EXISTS "Anyone can view basic job info" ON public.jobs;

-- ÉTAPE 3: Créer de nouvelles politiques RLS sécurisées

-- Politique pour utilisateurs authentifiés : accès complet (incluant contact_email et contact_phone)
CREATE POLICY "Authenticated users can view full job details including contacts"
ON public.jobs
FOR SELECT
TO authenticated
USING (is_active = true);

-- Politique pour utilisateurs anonymes : accès limité via la vue sécurisée sera géré au niveau de l'application

-- ÉTAPE 4: Assurer que la vue publique sécurisée est accessible à tous
GRANT SELECT ON public.jobs_public_safe TO anon;
GRANT SELECT ON public.jobs_public_safe TO authenticated;