drop policy "Allow update and delete access to own custom categories only" on "public"."item_categories";

drop policy "Allow insert access to own categories only" on "public"."item_categories";

drop policy "Allow read access to global and own categories" on "public"."item_categories";


  create table "public"."recipes" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "title" text not null,
    "ingredients" jsonb not null,
    "instructions" text[] not null,
    "image_url" text,
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."recipes" enable row level security;

CREATE UNIQUE INDEX recipes_pkey ON public.recipes USING btree (id);

alter table "public"."recipes" add constraint "recipes_pkey" PRIMARY KEY using index "recipes_pkey";

alter table "public"."recipes" add constraint "recipes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."recipes" validate constraint "recipes_user_id_fkey";

grant delete on table "public"."recipes" to "anon";

grant insert on table "public"."recipes" to "anon";

grant references on table "public"."recipes" to "anon";

grant select on table "public"."recipes" to "anon";

grant trigger on table "public"."recipes" to "anon";

grant truncate on table "public"."recipes" to "anon";

grant update on table "public"."recipes" to "anon";

grant delete on table "public"."recipes" to "authenticated";

grant insert on table "public"."recipes" to "authenticated";

grant references on table "public"."recipes" to "authenticated";

grant select on table "public"."recipes" to "authenticated";

grant trigger on table "public"."recipes" to "authenticated";

grant truncate on table "public"."recipes" to "authenticated";

grant update on table "public"."recipes" to "authenticated";

grant delete on table "public"."recipes" to "postgres";

grant insert on table "public"."recipes" to "postgres";

grant references on table "public"."recipes" to "postgres";

grant select on table "public"."recipes" to "postgres";

grant trigger on table "public"."recipes" to "postgres";

grant truncate on table "public"."recipes" to "postgres";

grant update on table "public"."recipes" to "postgres";

grant delete on table "public"."recipes" to "service_role";

grant insert on table "public"."recipes" to "service_role";

grant references on table "public"."recipes" to "service_role";

grant select on table "public"."recipes" to "service_role";

grant trigger on table "public"."recipes" to "service_role";

grant truncate on table "public"."recipes" to "service_role";

grant update on table "public"."recipes" to "service_role";


  create policy "Allow delete access to own custom categories only"
  on "public"."item_categories"
  as permissive
  for delete
  to authenticated
using (((user_id = ( SELECT auth.uid() AS uid)) AND (is_global = false)));



  create policy "Allow update access to own custom categories only"
  on "public"."item_categories"
  as permissive
  for update
  to authenticated
using (((user_id = ( SELECT auth.uid() AS uid)) AND (is_global = false)))
with check (((user_id = ( SELECT auth.uid() AS uid)) AND (is_global = false)));



  create policy "Users can modify their own recipes"
  on "public"."recipes"
  as permissive
  for all
  to authenticated
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



  create policy "Allow insert access to own categories only"
  on "public"."item_categories"
  as permissive
  for insert
  to authenticated
with check (((user_id = ( SELECT auth.uid() AS uid)) AND (is_global = false)));



  create policy "Allow read access to global and own categories"
  on "public"."item_categories"
  as permissive
  for select
  to authenticated
using (((is_global = true) OR (user_id = ( SELECT auth.uid() AS uid))));



