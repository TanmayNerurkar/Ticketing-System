-- Test organizations
INSERT INTO organizations (id, name, type, region, sla_tier) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Apollo Hospital, Hyderabad', 'HOSPITAL', 'IN-TG', 'GOLD'),
  ('22222222-2222-2222-2222-222222222222', 'Apollo Clinic, Warangal', 'CLINIC', 'IN-TG', 'SILVER');

-- Categories
INSERT INTO categories (name, subcategories, required_skill, sort_order) VALUES
  ('Network connectivity', ARRAY['Internet down','Slow network','WiFi issues'], 'network', 1),
  ('Software / EMR',       ARRAY['Login issues','Application crash','Data sync'], 'software', 2),
  ('Hardware',             ARRAY['Printer','Workstation','Peripheral'], 'hardware', 3),
  ('Email / Outlook',      ARRAY['Cannot send','Cannot receive','Calendar'], 'email', 4),
  ('Security',             ARRAY['Suspicious activity','Password reset','Access request'], 'security', 5),
  ('Other',                ARRAY[]::text[], 'general', 99);

-- Test users (password 'password' bcrypt-hashed)
INSERT INTO users (id, email, full_name, password_hash, role, organization_id, outlook_email) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'priya@apollo.in', 'Dr. Priya Sharma',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'CLIENT',
   '11111111-1111-1111-1111-111111111111', 'priya@apollo.in'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'rahul@remoteit.in', 'Rahul Krishnan',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TECHNICIAN', NULL,
   'rahul@remoteit.in'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'sunita@remoteit.in', 'Sunita Mehta',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TECHNICIAN', NULL,
   'sunita@remoteit.in');

-- Technicians
INSERT INTO technicians (user_id, skills, shift, max_concurrent) VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', ARRAY['network','software','email','general'], 'DAY', 10),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', ARRAY['hardware','general'], 'DAY', 10);