/*
# Create Demo User for AEGIS Seed Data

1. New Content
- Creates a demo user in auth.users with email demo@aegis.gov
- Password: aegis2024
- User ID is captured and used in subsequent seed data

2. Security
- Demo user gets 'admin' role in profiles
- Used for all seed data insertion
*/

-- Create demo user
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'demo@aegis.gov',
  crypt('aegis2024', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Demo Administrator"}'
)
ON CONFLICT (id) DO UPDATE SET
  email = 'demo@aegis.gov',
  encrypted_password = crypt('aegis2024', gen_salt('bf')),
  email_confirmed_at = now(),
  updated_at = now();

-- Ensure profile has admin role
UPDATE profiles
SET role = 'admin', full_name = 'Demo Administrator'
WHERE id = '00000000-0000-0000-0000-000000000001';
