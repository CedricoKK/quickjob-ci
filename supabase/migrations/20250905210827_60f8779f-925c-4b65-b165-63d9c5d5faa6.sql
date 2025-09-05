-- Insert more sample jobs to reach maximum variety
INSERT INTO public.jobs (
  title, description, city, commune, quartier, 
  category, salary_min, salary_max,
  recruiter_id, contact_email, contact_phone,
  is_featured, is_urgent, is_active
) VALUES 
  ('Femme de Ménage Résidentiel', 'Nettoyage résidences privées Cocody. Ménage complet, lessive, repassage. Références exigées, sérieux.', 'Abidjan', 'Cocody', 'Cocody Danga', 'menage', 50000, 75000, '00000000-0000-0000-0000-000000000002', 'menage.cocody@gmail.com', '+2250701123456', false, false, true),
  
  ('Jardinier Temps Partiel', 'Entretien jardins particuliers Yopougon. Taille haies, tonte pelouse, arrosage. Matériel fourni.', 'Abidjan', 'Yopougon', 'Yopougon Maroc', 'jardinage', 40000, 65000, '00000000-0000-0000-0000-000000000002', 'jardin.yopougon@gmail.com', '+2250702234567', false, false, true),
  
  ('Réparateur Électroménager', 'Réparation frigos, machines à laver, climatiseurs. Déplacement à domicile. Expérience obligatoire.', 'Abidjan', 'Marcory', 'Marcory Biafra', 'bricolage', 80000, 120000, '00000000-0000-0000-0000-000000000002', 'reparation.marcory@gmail.com', '+2250703345678', true, false, true),
  
  ('Livreur Weekend', 'Livraisons weekend uniquement. Colis, courses, repas. Véhicule personnel, essence remboursée.', 'Abidjan', 'Treichville', 'Treichville Belleville', 'livraison', 30000, 50000, '00000000-0000-0000-0000-000000000002', 'weekend.treichville@gmail.com', '+2250704456789', false, true, true),
  
  ('Nounou Expérimentée', 'Garde enfants 2-8 ans famille Plateau. Préparation repas, aide devoirs, activités. Références requises.', 'Abidjan', 'Plateau', 'Plateau Nord', 'garde_enfant', 80000, 120000, '00000000-0000-0000-0000-000000000002', 'nounou.plateau@gmail.com', '+2250705567890', true, false, true),
  
  ('Aide Soignant', 'Assistance personne âgée autonomie réduite. Soins de base, compagnie, sorties médicales.', 'Abidjan', 'Bingerville', 'Bingerville Adiopodoumé', 'aide_personne_agee', 70000, 100000, '00000000-0000-0000-0000-000000000002', 'soins.bingerville@gmail.com', '+2250706678901', false, false, true),
  
  ('Professeur Anglais', 'Cours particuliers anglais tous niveaux. Conversation, grammaire, préparation examens.', 'Abidjan', 'Cocody', 'Cocody Centre', 'cours_particulier', 45000, 75000, '00000000-0000-0000-0000-000000000002', 'anglais.cocody@gmail.com', '+2250707789012', false, false, true),
  
  ('Chef Cuisinier', 'Chef pour restaurant familial Koumassi. Cuisine locale et internationale. Gestion équipe 3 personnes.', 'Abidjan', 'Koumassi', 'Koumassi Centre', 'restauration', 120000, 180000, '00000000-0000-0000-0000-000000000002', 'chef.koumassi@gmail.com', '+2250708890123', true, false, true),
  
  ('Photographe Événements', 'Photographe mariages, baptêmes, anniversaires. Matériel professionnel, retouche incluse.', 'Abidjan', 'Port-Bouët', 'Port-Bouët Aéroport', 'evenementiel', 60000, 150000, '00000000-0000-0000-0000-000000000002', 'photo.portbouet@gmail.com', '+2250709901234', false, false, true),
  
  ('Webmaster Freelance', 'Création et maintenance sites web PME. WordPress, e-commerce, SEO. Portfolio requis.', 'Abidjan', 'Plateau', 'Plateau Centre', 'informatique', 100000, 200000, '00000000-0000-0000-0000-000000000002', 'web.plateau@gmail.com', '+2250700012345', true, false, true)
  
ON CONFLICT DO NOTHING;