-- Insert missing recruiter profile first
INSERT INTO public.profiles (id, email, full_name, role, phone, city, commune, quartier, is_active)
VALUES ('00000000-0000-0000-0000-000000000002', 'recruteur@test.ci', 'Recruteur Test', 'recruiter', '+2250707000000', 'Abidjan', 'Plateau', 'Plateau Centre', true)
ON CONFLICT (id) DO NOTHING;

-- Then insert sample jobs with valid enum categories
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
  ('Technicien Informatique', 'Technicien pour maintenance PC et réseaux. Réparation, installation logiciels, dépannage. Formation IT appréciée.', 'Abidjan', 'Koumassi', 'Koumassi Remblais', 'informatique', 95000, 150000, '00000000-0000-0000-0000-000000000002', 'tech.koumassi@gmail.com', '+2250705890123', false, false, true, 5.2833, -3.9667)
  
ON CONFLICT DO NOTHING;