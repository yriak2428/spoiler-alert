drop policy "Enable users to modify their own data only" on "public"."items";

drop policy "Enable users to only modify their own profile" on "public"."profiles";

alter table "public"."item_categories" drop constraint "item_categories_owner_id_fkey";

alter table "public"."items" drop constraint "items_Cateogry_fkey";

alter table "public"."items" drop constraint "items_owner_id_fkey1";

alter table "public"."item_categories" drop constraint "item_categories_pkey";

drop index if exists "public"."item_categories_pkey";

alter table "public"."item_categories" drop column "id";

alter table "public"."item_categories" drop column "owner_id";

alter table "public"."item_categories" add column "user_id" uuid default auth.uid();

alter table "public"."item_categories" disable row level security;

alter table "public"."items" drop column "Cateogry";

alter table "public"."items" drop column "owner_id";

alter table "public"."items" add column "category" text;

alter table "public"."items" add column "user_id" uuid not null default auth.uid();

CREATE UNIQUE INDEX item_categories_pkey ON public.item_categories USING btree (category_name);

alter table "public"."item_categories" add constraint "item_categories_pkey" PRIMARY KEY using index "item_categories_pkey";

alter table "public"."item_categories" add constraint "item_categories_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."item_categories" validate constraint "item_categories_user_id_fkey";

alter table "public"."items" add constraint "items_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."items" validate constraint "items_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.set_random_username()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.username IS NULL THEN
    -- Generates a random 8-character hex string
    NEW.username := 'user_' || substring(md5(random()::text), 1, 8);
  END IF;
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;$function$
;


  create policy "Enable users to modify their own data only"
  on "public"."items"
  as permissive
  for all
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Enable users to only modify their own profile"
  on "public"."profiles"
  as permissive
  for all
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


CREATE TRIGGER before_insert_username BEFORE INSERT ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_random_username();