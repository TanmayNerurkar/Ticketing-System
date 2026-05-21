-- Admin user for the platform (not tied to any organization)
-- Password hash here is a placeholder; DataInitializer resets it to "password" on startup.
INSERT INTO users (id, email, full_name, password_hash, role, organization_id, outlook_email) VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'admin@lifeline.local', 'Lifeline Admin',
   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN', NULL, NULL)
ON CONFLICT (email) DO NOTHING;