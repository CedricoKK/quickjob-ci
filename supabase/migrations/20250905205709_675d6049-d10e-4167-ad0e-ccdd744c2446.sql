-- Insert sample jobs with valid enum categories
INSERT INTO public.jobs (
  title, description, city, commune, quartier, 
  category, salary_min, salary_max,
  recruiter_id, contact_email, contact_phone,
  is_featured, is_urgent, is_active,
  latitude, longitude
) VALUES 
  ('Agent de Ménage Bureau', 'Recherche agent de ménage pour bureaux Adjamé. Nettoyage espaces, sols, sanitaires. Travail de nuit ou tôt matin.', 'Abidjan', 'Adjamé', 'Adjamé Marché', 'menage', 60000, 90000, '00000000-0000-0000-0000-000000000002', 'bureau.adjame@gmail.com', '+2250707123456', true, false, true, 5.3609, -4.0108),
  
  ('Livreur Moto Express', 'Livreur moto pour restaurant, livraisons rapides dans Cocody et environs. Moto fournie, permis obligatoire. Horaires flexibles.', 'Abidjan', 'Cocody', 'Riviera Golf', 'livraison', 60000, 90000, '00000000-0000-0000-0000-000000000002', 'delivery.cocody@gmail.com', '+2250708234567', false, true, true, 5.3845, -3.9875),
  
  ('Électricien Dépannage', 'Électricien pour dépannage urgent et travaux résidentiels. Installation, réparation, mise aux normes électriques.', 'Abidjan', 'Marcory', 'Marcory Zone 4', 'bricolage', 90000, 140000, '00000000-0000-0000-0000-000000000002', 'elec.marcory@gmail.com', '+2250709345678', false, false, true, 5.2845, -4.0005),
  
  ('Garde Enfants Soir', 'Garde enfants pour famille Plateau. Surveillance, aide devoirs, repas. Disponibilité soirs semaine et weekends.', 'Abidjan', 'Plateau', 'Plateau Centre', 'garde_enfant', 70000, 110000, '00000000-0000-0000-0000-000000000002', 'garde.plateau@gmail.com', '+2250701456789', true, false, true, 5.3197, -4.0217),
  
  ('Aide Personne Âgée', 'Accompagnement personne âgée résidence Deux-Plateaux. Aide quotidienne, courses, compagnie. Très patient(e) exigé(e).', 'Abidjan', 'Cocody', 'Deux-Plateaux Vallon', 'aide_personne_agee', 65000, 95000, '00000000-0000-0000-0000-000000000002', 'aide.2plateaux@gmail.com', '+2250702567890', false, false, true, 5.3667, -3.9833),
  
  ('Professeur Mathématiques', 'Cours particuliers mathématiques niveau collège-lycée. Disponibilité soirs et weekends. Pédagogie et patience.', 'Abidjan', 'Yopougon', 'Yopougon Sideci', 'cours_particulier', 50000, 80000, '00000000-0000-0000-0000-000000000002', 'cours.yopougon@gmail.com', '+2250703678901', false, true, true, 5.3456, -4.0956),
  
  ('Serveur Restaurant', 'Serveur expérimenté pour restaurant local Treichville. Service clientèle, commandes, présentation soignée.', 'Abidjan', 'Treichville', 'Treichville Centre', 'restauration', 75000, 110000, '00000000-0000-0000-0000-000000000002', 'resto.treichville@gmail.com', '+2250704789012', true, false, true, 5.2967, -4.0167),
  
  ('Technicien Informatique', 'Technicien pour maintenance PC et réseaux. Réparation, installation logiciels, dépannage. Formation IT appréciée.', 'Abidjan', 'Koumassi', 'Koumassi Remblais', 'informatique', 95000, 150000, '00000000-0000-0000-0000-000000000002', 'tech.koumassi@gmail.com', '+2250705890123', false, false, true, 5.2833, -3.9667),
  
  ('Hôtesse Événementiel', 'Hôtesse pour événements et salons Port-Bouët. Accueil invités, orientation, présentation impeccable.', 'Abidjan', 'Port-Bouët', 'Port-Bouët Zone 3', 'evenementiel', 40000, 60000, '00000000-0000-0000-0000-000000000002', 'event.portbouet@gmail.com', '+2250706901234', false, false, true, 5.2500, -3.9167),
  
  ('Jardinier Expérimenté', 'Jardinier pour entretien espaces verts résidence Bingerville. Taille, plantation, arrosage. Expérience requise.', 'Abidjan', 'Bingerville', 'Bingerville Centre', 'jardinage', 55000, 85000, '00000000-0000-0000-0000-000000000002', 'jardin.bingerville@gmail.com', '+2250707012345', true, true, true, 5.3500, -3.9000),
  
  ('Agent Ménage Résidentiel', 'Femme de ménage pour résidences privées Plateau. Nettoyage complet, repassage. Références exigées.', 'Abidjan', 'Plateau', 'Plateau Administratif', 'menage', 50000, 75000, '00000000-0000-0000-0000-000000000002', 'menage.plateau@gmail.com', '+2250708123456', false, false, true, 5.3200, -4.0200),
  
  ('Livreur Courses', 'Livreur pour service courses à domicile Cocody. Vélo ou moto, disponibilité journée. Commission attractive.', 'Abidjan', 'Cocody', 'Cocody Angré', 'livraison', 45000, 70000, '00000000-0000-0000-0000-000000000002', 'courses.angre@gmail.com', '+2250709234567', false, false, true, 5.3900, -3.9700),
  
  ('Plombier Réparateur', 'Plombier pour interventions dépannage. Réparations fuites, installations sanitaires. Outils fournis.', 'Abidjan', 'Adjamé', 'Adjamé Liberté', 'bricolage', 85000, 125000, '00000000-0000-0000-0000-000000000002', 'plombier.adjame@gmail.com', '+2250701345678', false, false, true, 5.3550, -4.0150),
  
  ('Baby-sitter Weekend', 'Garde enfants fins de semaine Yopougon. Surveillance, jeux, activités. Expérience avec enfants 3-10 ans.', 'Abidjan', 'Yopougon', 'Yopougon Millionnaire', 'garde_enfant', 35000, 55000, '00000000-0000-0000-0000-000000000002', 'babysit.yopougon@gmail.com', '+2250702456789', true, false, true, 5.3400, -4.1000),
  
  ('Accompagnant Senior', 'Accompagnement personne âgée Marcory. Aide quotidienne, sorties, compagnie. Bienveillance et patience.', 'Abidjan', 'Marcory', 'Marcory Anoumabo', 'aide_personne_agee', 60000, 90000, '00000000-0000-0000-0000-000000000002', 'senior.marcory@gmail.com', '+2250703567890', false, false, true, 5.2800, -4.0100),
  
  ('Répétiteur Français', 'Cours particuliers français niveau primaire-collège. Soutien scolaire, aide devoirs. Pédagogie adaptée.', 'Abidjan', 'Cocody', 'Cocody Riviera Palmeraie', 'cours_particulier', 40000, 65000, '00000000-0000-0000-0000-000000000002', 'francais.riviera@gmail.com', '+2250704678901', false, false, true, 5.3750, -3.9800),
  
  ('Cuisinier Événements', 'Cuisinier pour événements privés et réceptions. Spécialités locales et internationales. Équipe dynamique.', 'Abidjan', 'Treichville', 'Treichville Biafra', 'restauration', 80000, 120000, '00000000-0000-0000-0000-000000000002', 'chef.treichville@gmail.com', '+2250705789012', false, true, true, 5.2950, -4.0200),
  
  ('Animateur Mariage', 'Animateur pour mariages et événements familiaux. Musique, animation, ambiance festive. Matériel fourni.', 'Abidjan', 'Plateau', 'Plateau Lagunaire', 'evenementiel', 50000, 100000, '00000000-0000-0000-0000-000000000002', 'anim.plateau@gmail.com', '+2250706890123', true, false, true, 5.3150, -4.0250),
  
  ('Développeur Web', 'Développeur web freelance pour projets PME. HTML, CSS, JavaScript, WordPress. Portfolio requis.', 'Abidjan', 'Cocody', 'Cocody II Plateaux', 'informatique', 120000, 200000, '00000000-0000-0000-0000-000000000002', 'dev.cocody@gmail.com', '+2250707901234', false, false, true, 5.3650, -3.9850),
  
  ('Assistant Divers', 'Assistant pour tâches diverses Marcory. Courses, petits travaux, organisation. Polyvalence appréciée.', 'Abidjan', 'Marcory', 'Marcory Résidentiel', 'autre', 55000, 85000, '00000000-0000-0000-0000-000000000002', 'assist.marcory@gmail.com', '+2250708012345', true, false, true, 5.2900, -3.9950)
  
ON CONFLICT DO NOTHING;