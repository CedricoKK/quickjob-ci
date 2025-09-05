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

-- Insert some sample jobs for the homepage using correct enum values
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
  'informatique',
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
  'Livreur Moto',
  'Recherche livreur avec moto pour livraisons rapides dans Abidjan. Permis A requis.',
  'livraison',
  'Abidjan',
  'Marcory',
  'Zone 4',
  250000,
  400000,
  true,
  false,
  'livraison@example.com',
  '+225 05 06 07 08 09'
),
(
  (SELECT id FROM public.profiles WHERE role = 'recruiter' LIMIT 1),
  'Aide Ménagère',
  'Recherche aide ménagère pour entretien maison familiale. Expérience souhaitée.',
  'menage',
  'Abidjan',
  'Yopougon',
  'Siporex',
  200000,
  300000,
  false,
  false,
  'menage@example.com',
  '+225 07 08 09 10 11'
),
(
  (SELECT id FROM public.profiles WHERE role = 'recruiter' LIMIT 1),
  'Serveur Restaurant',
  'Restaurant cherche serveur expérimenté. Connaissance service client requis.',
  'restauration',
  'Bouaké',
  'Bouaké',
  'Centre-ville',
  180000,
  280000,
  false,
  true,
  'restaurant@example.com',
  '+225 09 10 11 12 13'
),
(
  (SELECT id FROM public.profiles WHERE role = 'recruiter' LIMIT 1),
  'Garde d''Enfant',
  'Famille cherche garde d''enfant responsable pour 2 enfants (5 et 8 ans).',
  'garde_enfant',
  'Abidjan',
  'Cocody',
  'Danga',
  150000,
  250000,
  true,
  false,
  'garde@example.com',
  '+225 01 23 45 67 89'
);