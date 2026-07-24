INSERT INTO public.item_categories (category_name) VALUES ('Uncategorized'), ('Other'), ('Meat'), ('Seafood'), ('Vegetables'), ('Fruits'), ('Dairy'), ('Eggs'), ('Deli'), ('Grains & Legumes'), ('Baking Goods'), ('Spices & Seasonings'), ('Herbs'), ('Oils & Vinegars'), ('Sauces & Condiments'), ('Canned Goods'), ('Frozen Meals'), ('Frozen Produce'), ('Prepped Meals'), ('Desserts'), ('Ready-made Meals'),  ('Snacks'), ('Cereal'), ('Alcohol'), ('Soft Drinks'), ('Personal Hygiene'), ('Cleaning');
-- Ensure pgcrypto extension is available
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- 1. Insert User with dynamically generated bcrypt hash
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_token,
  confirmation_token,
  email_change_token_new,
  email_change,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'authenticated',
  'authenticated',
  'dev@example.com',
  -- Generates a valid GoTrue-compatible bcrypt hash for 'password123'
  extensions.crypt('password123', extensions.gen_salt('bf')),
  now(),
  '',
  '',
  '',
  '',
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Dev User"}',
  false,
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert Matching Identity
INSERT INTO auth.identities (
  id,
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  '{"sub": "a1b2c3d4-e5f6-7890-abcd-ef1234567890", "email": "dev@example.com"}',
  'email',
  now(),
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- Ensure pgcrypto extension is available
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- 1. Insert Second User
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_token,
  confirmation_token,
  email_change_token_new,
  email_change,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'b2c3d4e5-f6a7-8901-bcde-f23456789012', -- Distinct UUID
  'authenticated',
  'authenticated',
  'dev2@example.com',
  -- Password is 'password456'
  extensions.crypt('password456', extensions.gen_salt('bf')),
  now(),
  '',
  '',
  '',
  '',
  '{"provider": "email", "providers": ["email"]}',
  '{"name": "Second Dev User"}',
  false,
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert Identity for Second User
INSERT INTO auth.identities (
  id,
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES (
  'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  'b2c3d4e5-f6a7-8901-bcde-f23456789012',
  '{"sub": "b2c3d4e5-f6a7-8901-bcde-f23456789012", "email": "dev2@example.com"}',
  'email',
  now(),
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

-- 3. Update profile preferences for dev@example.com
UPDATE public.profiles 
SET dietary_restrictions = ARRAY['dairy-free'], 
    cultural_preferences = ARRAY['Western', 'Italian']
WHERE user_id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';