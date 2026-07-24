ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS dietary_restrictions text[] DEFAULT '{}'::text[],
ADD COLUMN IF NOT EXISTS cultural_preferences text[] DEFAULT '{}'::text[];
