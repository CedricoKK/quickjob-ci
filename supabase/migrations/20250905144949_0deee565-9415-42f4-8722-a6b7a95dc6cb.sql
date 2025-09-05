-- Insert test accounts with proper auth users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_user_meta_data)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@test.ci', crypt('Admin123', gen_salt('bf')), now(), now(), now(), '{"full_name": "Administrateur Test", "role": "admin"}'),
  ('00000000-0000-0000-0000-000000000002', 'recruteur@test.ci', crypt('Recruit123', gen_salt('bf')), now(), now(), now(), '{"full_name": "Recruteur Test", "role": "recruiter"}'),
  ('00000000-0000-0000-0000-000000000003', 'candidat@test.ci', crypt('Candidat123', gen_salt('bf')), now(), now(), now(), '{"full_name": "Candidat Test", "role": "candidate"}')
ON CONFLICT (email) DO NOTHING;