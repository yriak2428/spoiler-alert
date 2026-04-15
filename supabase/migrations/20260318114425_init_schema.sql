create type "public"."item_status" as enum ('out_of_stock', 'safe', 'risky', 'expired');

create type "public"."storage_loc" as enum ('CABINET', 'FRIDGE', 'FREEZER');


  create table "public"."item_categories" (
    "category_name" text not null,
    "owner_id" uuid default auth.uid(),
    "is_global" boolean not null default true,
    "id" uuid not null default gen_random_uuid()
      );


alter table "public"."item_categories" enable row level security;


  create table "public"."items" (
    "id" uuid not null default gen_random_uuid(),
    "item_name" text not null,
    "quantity" bigint not null default '1'::bigint,
    "weight" double precision,
    "description" text,
    "expiry_date" date,
    "production_date" date,
    "purchase_date" date,
    "owner_id" uuid not null default auth.uid(),
    "created_at" timestamp with time zone not null default now(),
    "last_updated" timestamp with time zone not null default now(),
    "Cateogry" uuid not null default 'dff402d9-4e5d-42b2-a552-f8c7c5adc2d3'::uuid,
    "reminder_at" timestamp with time zone,
    "storage_location" public.storage_loc,
    "item_status" public.item_status default 'safe'::public.item_status
      );


alter table "public"."items" enable row level security;


  create table "public"."profiles" (
    "user_id" uuid not null default auth.uid(),
    "created_at" timestamp with time zone not null default now(),
    "last_updated" timestamp with time zone not null default now(),
    "username" text not null,
    "email" text not null,
    "phone" text
      );


alter table "public"."profiles" enable row level security;

CREATE UNIQUE INDEX item_categories_pkey ON public.item_categories USING btree (id);

CREATE UNIQUE INDEX items_pkey ON public.items USING btree (id);

CREATE UNIQUE INDEX profiles_phone_key ON public.profiles USING btree (phone);

CREATE UNIQUE INDEX users_pkey ON public.profiles USING btree (user_id);

CREATE UNIQUE INDEX users_username_key ON public.profiles USING btree (username);

alter table "public"."item_categories" add constraint "item_categories_pkey" PRIMARY KEY using index "item_categories_pkey";

alter table "public"."items" add constraint "items_pkey" PRIMARY KEY using index "items_pkey";

alter table "public"."profiles" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."item_categories" add constraint "item_categories_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."item_categories" validate constraint "item_categories_owner_id_fkey";

alter table "public"."items" add constraint "items_Cateogry_fkey" FOREIGN KEY ("Cateogry") REFERENCES public.item_categories(id) ON UPDATE CASCADE not valid;

alter table "public"."items" validate constraint "items_Cateogry_fkey";

alter table "public"."items" add constraint "items_owner_id_fkey1" FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."items" validate constraint "items_owner_id_fkey1";

alter table "public"."profiles" add constraint "profiles_phone_key" UNIQUE using index "profiles_phone_key";

alter table "public"."profiles" add constraint "profiles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_user_id_fkey";

alter table "public"."profiles" add constraint "users_username_key" UNIQUE using index "users_username_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_user_changes()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO public.profiles (user_id, email, phone)
    VALUES (NEW.id, NEW.email, NEW.phone);
  ELSIF (TG_OP = 'UPDATE') THEN
    UPDATE public.profiles
    SET email = NEW.email, 
        phone = NEW.phone
    WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
-- Added 'SET search_path = public' to lock the schema
$function$
;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
 RETURNS event_trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'pg_catalog'
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."item_categories" to "anon";

grant insert on table "public"."item_categories" to "anon";

grant references on table "public"."item_categories" to "anon";

grant select on table "public"."item_categories" to "anon";

grant trigger on table "public"."item_categories" to "anon";

grant truncate on table "public"."item_categories" to "anon";

grant update on table "public"."item_categories" to "anon";

grant delete on table "public"."item_categories" to "authenticated";

grant insert on table "public"."item_categories" to "authenticated";

grant references on table "public"."item_categories" to "authenticated";

grant select on table "public"."item_categories" to "authenticated";

grant trigger on table "public"."item_categories" to "authenticated";

grant truncate on table "public"."item_categories" to "authenticated";

grant update on table "public"."item_categories" to "authenticated";

grant delete on table "public"."item_categories" to "postgres";

grant insert on table "public"."item_categories" to "postgres";

grant references on table "public"."item_categories" to "postgres";

grant select on table "public"."item_categories" to "postgres";

grant trigger on table "public"."item_categories" to "postgres";

grant truncate on table "public"."item_categories" to "postgres";

grant update on table "public"."item_categories" to "postgres";

grant delete on table "public"."item_categories" to "service_role";

grant insert on table "public"."item_categories" to "service_role";

grant references on table "public"."item_categories" to "service_role";

grant select on table "public"."item_categories" to "service_role";

grant trigger on table "public"."item_categories" to "service_role";

grant truncate on table "public"."item_categories" to "service_role";

grant update on table "public"."item_categories" to "service_role";

grant delete on table "public"."items" to "anon";

grant insert on table "public"."items" to "anon";

grant references on table "public"."items" to "anon";

grant select on table "public"."items" to "anon";

grant trigger on table "public"."items" to "anon";

grant truncate on table "public"."items" to "anon";

grant update on table "public"."items" to "anon";

grant delete on table "public"."items" to "authenticated";

grant insert on table "public"."items" to "authenticated";

grant references on table "public"."items" to "authenticated";

grant select on table "public"."items" to "authenticated";

grant trigger on table "public"."items" to "authenticated";

grant truncate on table "public"."items" to "authenticated";

grant update on table "public"."items" to "authenticated";

grant delete on table "public"."items" to "postgres";

grant insert on table "public"."items" to "postgres";

grant references on table "public"."items" to "postgres";

grant select on table "public"."items" to "postgres";

grant trigger on table "public"."items" to "postgres";

grant truncate on table "public"."items" to "postgres";

grant update on table "public"."items" to "postgres";

grant delete on table "public"."items" to "service_role";

grant insert on table "public"."items" to "service_role";

grant references on table "public"."items" to "service_role";

grant select on table "public"."items" to "service_role";

grant trigger on table "public"."items" to "service_role";

grant truncate on table "public"."items" to "service_role";

grant update on table "public"."items" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "postgres";

grant insert on table "public"."profiles" to "postgres";

grant references on table "public"."profiles" to "postgres";

grant select on table "public"."profiles" to "postgres";

grant trigger on table "public"."profiles" to "postgres";

grant truncate on table "public"."profiles" to "postgres";

grant update on table "public"."profiles" to "postgres";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";


  create policy "Enable users to modify their own data only"
  on "public"."items"
  as permissive
  for all
  to authenticated
using ((( SELECT auth.uid() AS uid) = owner_id))
with check ((( SELECT auth.uid() AS uid) = owner_id));



  create policy "Enable users to only modify their own profile"
  on "public"."profiles"
  as permissive
  for all
  to public
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));


CREATE TRIGGER item_update_timestamp AFTER UPDATE ON public.items FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_user_changes();

CREATE TRIGGER on_auth_user_updated AFTER UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_user_changes();


