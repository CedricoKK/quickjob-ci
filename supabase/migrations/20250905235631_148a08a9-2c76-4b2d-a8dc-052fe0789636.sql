-- Add sample jobs with correct categories
INSERT INTO public.jobs (title, description, city, commune, quartier, category, salary_min, salary_max, recruiter_id, contact_email, contact_phone, is_featured, is_urgent) VALUES
-- Abidjan jobs
('Agent de ménage - Cocody', 'Recherche agent de ménage expérimenté pour villa à Cocody. Travail du lundi au vendredi, 8h-16h. Références exigées.', 'Abidjan', 'Cocody', '2 Plateaux', 'menage', 80000, 120000, (SELECT id FROM auth.users LIMIT 1), 'contact@exemple.ci', '+225 01 02 03 04 05', true, false),
('Jardinier - Marcory', 'Entretien de jardin pour résidence privée à Marcory. Expérience en jardinage tropical souhaitée.', 'Abidjan', 'Marcory', 'Zone 4', 'jardinage', 100000, 150000, (SELECT id FROM auth.users LIMIT 1), 'jardinage@exemple.ci', '+225 02 03 04 05 06', false, true),
('Livreur moto - Yopougon', 'Recherche livreur avec moto pour zone Yopougon. Disponibilité flexible, bon salaire.', 'Abidjan', 'Yopougon', 'Sicogi', 'livraison', 120000, 180000, (SELECT id FROM auth.users LIMIT 1), 'livraison@exemple.ci', '+225 03 04 05 06 07', true, true),
('Garde d''enfant - Treichville', 'Garde d''enfant pour enfant de 3 ans. Expérience requise, références vérifiables.', 'Abidjan', 'Treichville', 'Zone 2', 'garde_enfant', 90000, 130000, (SELECT id FROM auth.users LIMIT 1), 'garde@exemple.ci', '+225 04 05 06 07 08', false, false),
('Bricoleur - Adjamé', 'Petits travaux de bricolage et réparations diverses. Outils fournis.', 'Abidjan', 'Adjamé', 'Adjamé 220 Logements', 'bricolage', 60000, 100000, (SELECT id FROM auth.users LIMIT 1), 'bricolage@exemple.ci', '+225 05 06 07 08 09', false, false),

-- Bouaké jobs
('Cuisinier - Bouaké Centre', 'Restaurant recherche cuisinier expérimenté en cuisine ivoirienne et internationale.', 'Bouaké', 'Bouaké', 'Centre-ville', 'restauration', 150000, 250000, (SELECT id FROM auth.users LIMIT 1), 'resto@exemple.ci', '+225 06 07 08 09 10', true, false),
('Aide à domicile - Koko', 'Aide aux personnes âgées. Soins de base et compagnie. Formation assurée.', 'Bouaké', 'Koko', 'Belleville', 'aide_personne_agee', 80000, 120000, (SELECT id FROM auth.users LIMIT 1), 'aide@exemple.ci', '+225 07 08 09 10 11', false, false),

-- Yamoussoukro jobs
('Cours particuliers - Yamoussoukro', 'Cours de mathématiques niveau collège/lycée. Diplôme requis.', 'Yamoussoukro', 'Yamoussoukro', 'Centre-ville', 'cours_particulier', 15000, 25000, (SELECT id FROM auth.users LIMIT 1), 'cours@exemple.ci', '+225 08 09 10 11 12', false, false),
('Technicien informatique - Habitat', 'Maintenance ordinateurs et réseaux pour PME locale.', 'Yamoussoukro', 'Yamoussoukro', 'Habitat', 'informatique', 200000, 300000, (SELECT id FROM auth.users LIMIT 1), 'it@exemple.ci', '+225 09 10 11 12 13', true, false),

-- San Pedro jobs
('Événementiel - San Pedro Port', 'Organisation d''événements au marché du port. Expérience événementiel souhaitée.', 'San Pedro', 'San Pedro', 'Zone Portuaire', 'evenementiel', 80000, 120000, (SELECT id FROM auth.users LIMIT 1), 'event@exemple.ci', '+225 10 11 12 13 14', false, false),

-- More Abidjan jobs for variety
('Professeur particulier - Plateau', 'Cours particuliers français niveau primaire/collège. Diplôme requis.', 'Abidjan', 'Plateau', 'Plateau Centre', 'cours_particulier', 12000, 20000, (SELECT id FROM auth.users LIMIT 1), 'francais@exemple.ci', '+225 11 12 13 14 15', false, false),
('Jardinage - Riviera', 'Entretien espaces verts pour résidence. Outils fournis.', 'Abidjan', 'Cocody', 'Riviera', 'jardinage', 75000, 110000, (SELECT id FROM auth.users LIMIT 1), 'jardin@exemple.ci', '+225 12 13 14 15 16', false, false),
('Femme de ménage - Riviera', 'Ménage pour appartement 3 pièces, 3 fois par semaine. Sérieuse et ponctuelle.', 'Abidjan', 'Cocody', 'Riviera', 'menage', 75000, 100000, (SELECT id FROM auth.users LIMIT 1), 'proprete@exemple.ci', '+225 13 14 15 16 17', false, false),
('Réparations diverses - Port-Bouët', 'Bricolage et petites réparations domestiques. Expérience 2 ans minimum.', 'Abidjan', 'Port-Bouët', 'Vridi', 'bricolage', 80000, 120000, (SELECT id FROM auth.users LIMIT 1), 'reparation@exemple.ci', '+225 14 15 16 17 18', true, false),
('Service traiteur - Abobo', 'Aide en cuisine pour service traiteur weekend. Formation assurée.', 'Abidjan', 'Abobo', 'Abobo-Baoulé', 'restauration', 60000, 80000, (SELECT id FROM auth.users LIMIT 1), 'traiteur@exemple.ci', '+225 15 16 17 18 19', false, false);