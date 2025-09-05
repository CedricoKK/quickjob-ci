-- Insert sample jobs with comprehensive data (corrected escaping)
INSERT INTO public.jobs (
  title, description, city, commune, quartier, 
  category, salary_min, salary_max,
  recruiter_id, contact_email, contact_phone,
  is_featured, is_urgent, is_active,
  latitude, longitude
) VALUES 
  ('Vendeur en Boutique', 'Recherche vendeur expérimenté pour boutique de vêtements à Adjamé. Accueil clientèle, vente, gestion stock. Excellente présentation exigée.', 'Abidjan', 'Adjamé', 'Adjamé Marché', 'retail', 80000, 120000, '00000000-0000-0000-0000-000000000002', 'boutique.adjame@gmail.com', '+2250707123456', true, false, true, 5.3609, -4.0108),
  
  ('Livreur Moto', 'Livreur moto pour restaurant, livraisons rapides dans Cocody et environs. Moto fournie, permis obligatoire. Horaires flexibles.', 'Abidjan', 'Cocody', 'Riviera Golf', 'delivery', 60000, 90000, '00000000-0000-0000-0000-000000000002', 'delivery.cocody@gmail.com', '+2250708234567', false, true, true, 5.3845, -3.9875),
  
  ('Agent de Sécurité', 'Agent de sécurité pour centre commercial de Marcory. Service de nuit 20h-6h. Formation sécurité appréciée. Très sérieux.', 'Abidjan', 'Marcory', 'Marcory Zone 4', 'security', 70000, 95000, '00000000-0000-0000-0000-000000000002', 'securite.marcory@gmail.com', '+2250709345678', false, false, true, 5.2845, -4.0005),
  
  ('Secrétaire Assistante', 'Assistante administrative pour PME à Plateau. Accueil, téléphone, courrier, planning. Maîtrise Pack Office requise.', 'Abidjan', 'Plateau', 'Plateau Centre', 'office', 100000, 150000, '00000000-0000-0000-0000-000000000002', 'admin.plateau@gmail.com', '+2250701456789', true, false, true, 5.3197, -4.0217),
  
  ('Femme de Ménage', 'Femme de ménage pour résidence privée à Deux-Plateaux. 3 fois par semaine, 4h/jour. Expérience domestique exigée.', 'Abidjan', 'Cocody', 'Deux-Plateaux Vallon', 'domestic', 45000, 60000, '00000000-0000-0000-0000-000000000002', 'maison.2plateaux@gmail.com', '+2250702567890', false, false, true, 5.3667, -3.9833),
  
  ('Chauffeur VTC', 'Chauffeur VTC avec véhicule propre pour service transport privé. Permis B, expérience conduite urbaine, discrétion.', 'Abidjan', 'Yopougon', 'Yopougon Sideci', 'transport', 85000, 130000, '00000000-0000-0000-0000-000000000002', 'vtc.yopougon@gmail.com', '+2250703678901', false, true, true, 5.3456, -4.0956),
  
  ('Cuisinière Restaurant', 'Cuisinière expérimentée pour restaurant local à Treichville. Spécialités ivoiriennes et plats rapides. Hygiène stricte.', 'Abidjan', 'Treichville', 'Treichville Centre', 'restaurant', 75000, 110000, '00000000-0000-0000-0000-000000000002', 'resto.treichville@gmail.com', '+2250704789012', true, false, true, 5.2967, -4.0167),
  
  ('Mécanicien Auto', 'Mécanicien automobile pour garage Koumassi. Réparation moteurs, diagnostic pannes, entretien véhicules. Expérience 3 ans min.', 'Abidjan', 'Koumassi', 'Koumassi Remblais', 'automotive', 90000, 140000, '00000000-0000-0000-0000-000000000002', 'garage.koumassi@gmail.com', '+2250705890123', false, false, true, 5.2833, -3.9667),
  
  ('Vendeur Pharmacie', 'Vendeur en pharmacie à Port-Bouët. Conseil clientèle, gestion stock médicaments, préparateur apprécie. Sérieux exigé.', 'Abidjan', 'Port-Bouët', 'Port-Bouët Zone 3', 'healthcare', 80000, 120000, '00000000-0000-0000-0000-000000000002', 'pharma.portbouet@gmail.com', '+2250706901234', false, false, true, 5.2500, -3.9167),
  
  ('Électricien Bâtiment', 'Électricien pour travaux résidentiels et commerciaux à Bingerville. Installation, dépannage, mise aux normes électriques.', 'Abidjan', 'Bingerville', 'Bingerville Centre', 'construction', 95000, 160000, '00000000-0000-0000-0000-000000000002', 'elec.bingerville@gmail.com', '+2250707012345', true, true, true, 5.3500, -3.9000),
  
  ('Agent Call Center', 'Agent centre appels pour service client bancaire à Plateau. Bilingue français/anglais. Formation fournie.', 'Abidjan', 'Plateau', 'Plateau Administratif', 'customer_service', 70000, 100000, '00000000-0000-0000-0000-000000000002', 'call.plateau@gmail.com', '+2250708123456', false, false, true, 5.3200, -4.0200),
  
  ('Jardinier Paysagiste', 'Jardinier pour entretien espaces verts résidence haut standing Cocody. Taille, arrosage, plantation. Expérience requise.', 'Abidjan', 'Cocody', 'Cocody Angré', 'landscaping', 55000, 80000, '00000000-0000-0000-0000-000000000002', 'jardin.angre@gmail.com', '+2250709234567', false, false, true, 5.3900, -3.9700),
  
  ('Caissière Supermarché', 'Caissière pour grand supermarché Adjamé. Expérience caisse, calcul mental, relationnel client. Horaires variables.', 'Abidjan', 'Adjamé', 'Adjamé Liberté', 'retail', 65000, 85000, '00000000-0000-0000-0000-000000000002', 'caisse.adjame@gmail.com', '+2250701345678', false, false, true, 5.3550, -4.0150),
  
  ('Maçon Expérimenté', 'Maçon pour chantiers construction Yopougon. Fondations, murs, finitions. Équipe dynamique, chantiers réguliers.', 'Abidjan', 'Yopougon', 'Yopougon Millionnaire', 'construction', 100000, 150000, '00000000-0000-0000-0000-000000000002', 'macon.yopougon@gmail.com', '+2250702456789', true, false, true, 5.3400, -4.1000),
  
  ('Coiffeur/Coiffeuse', 'Coiffeur(se) pour salon moderne Marcory. Techniques modernes, coloration, défrisage. Clientèle établie, ambiance conviviale.', 'Abidjan', 'Marcory', 'Marcory Anoumabo', 'beauty', 70000, 110000, '00000000-0000-0000-0000-000000000002', 'salon.marcory@gmail.com', '+2250703567890', false, false, true, 5.2800, -4.0100),
  
  ('Professeur Cours Particuliers', 'Professeur pour cours particuliers maths et français niveau collège-lycée. Disponibilité soirs et weekends.', 'Abidjan', 'Cocody', 'Cocody Riviera Palmeraie', 'education', 60000, 100000, '00000000-0000-0000-0000-000000000002', 'cours.riviera@gmail.com', '+2250704678901', false, false, true, 5.3750, -3.9800),
  
  ('Plombier Dépannage', 'Plombier pour interventions dépannage urgent. Réparations fuites, installations sanitaires. Véhicule et outils fournis.', 'Abidjan', 'Treichville', 'Treichville Biafra', 'maintenance', 85000, 125000, '00000000-0000-0000-0000-000000000002', 'plombier.treichville@gmail.com', '+2250705789012', false, true, true, 5.2950, -4.0200),
  
  ('Réceptionniste Hôtel', 'Réceptionniste pour hôtel 3 étoiles Plateau. Accueil, réservations, facturation. Anglais courant, présentation soignée.', 'Abidjan', 'Plateau', 'Plateau Lagunaire', 'hospitality', 90000, 130000, '00000000-0000-0000-0000-000000000002', 'hotel.plateau@gmail.com', '+2250706890123', true, false, true, 5.3150, -4.0250),
  
  ('Comptable Junior', 'Assistant comptable pour cabinet expertise-comptable. Saisie, rapprochements, déclarations. Formation comptabilité requise.', 'Abidjan', 'Cocody', 'Cocody II Plateaux', 'finance', 120000, 180000, '00000000-0000-0000-0000-000000000002', 'compta.cocody@gmail.com', '+2250707901234', false, false, true, 5.3650, -3.9850),
  
  ('Agent Immobilier', 'Négociateur immobilier pour agence réputée. Prospection, visite, négociation. Commission attractive, formation possible.', 'Abidjan', 'Marcory', 'Marcory Résidentiel', 'sales', 80000, 200000, '00000000-0000-0000-0000-000000000002', 'immo.marcory@gmail.com', '+2250708012345', true, false, true, 5.2900, -3.9950)
  
ON CONFLICT DO NOTHING;