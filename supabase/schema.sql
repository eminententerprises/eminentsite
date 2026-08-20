-- Eminent Enterprises — admin-managed property listings
-- Run this once in the Supabase project's SQL Editor (Dashboard -> SQL Editor -> New query).
-- Safe to re-run: every statement is idempotent (IF NOT EXISTS / OR REPLACE / DROP ... IF EXISTS).

create extension if not exists pgcrypto;

create table if not exists public.properties (
  id                     uuid primary key default gen_random_uuid(),
  ref                    text not null unique,
  slug                   text not null unique,
  purpose                text not null check (purpose in ('buy', 'rent')),
  type                   text not null,
  category               text not null check (category in ('residential', 'commercial', 'plots')),
  title                  text not null,
  description            text not null default '',
  price                  numeric not null check (price >= 0),
  price_unit             text not null default 'total' check (price_unit in ('total', 'month')),
  price_per_marla        numeric,
  area_value             numeric not null,
  area_unit              text not null check (area_unit in ('marla', 'kanal', 'sqft', 'sqyd')),
  area_sqft              numeric not null,
  beds                   integer,
  baths                  integer,
  city                   text not null check (city in ('islamabad', 'rawalpindi', 'hills')),
  city_label             text not null,
  area_name              text not null,
  area_slug              text not null,
  sector                 text,
  lat                    numeric not null,
  lng                    numeric not null,
  features               text[] not null default '{}',
  amenities              text[] not null default '{}',
  approval               text not null check (approval in ('CDA Approved', 'RDA Approved', 'Approval Pending', 'Not Applicable')),
  possession             text not null check (possession in ('Ready', 'Under Development', 'Balloted')),
  plot_file_or_registry  text not null check (plot_file_or_registry in ('Plot File', 'Registry', 'Not Applicable')),
  corner_plot            boolean not null default false,
  boulevard_facing       boolean not null default false,
  park_facing            boolean not null default false,
  gas_available          boolean not null default false,
  electricity_available  boolean not null default false,
  water_source           text not null check (water_source in ('Boring', 'Tanker', 'Supply Line', 'Boring + Supply')),
  sewerage               boolean not null default false,
  floors                 integer,
  servant_quarter        boolean not null default false,
  basement               boolean not null default false,
  images                 jsonb not null default '[]',    -- [{ src, alt, width, height }]
  floor_plans            jsonb not null default '[]',    -- [{ src, alt, label }]
  agent_id               text,
  added_at               timestamptz not null default now(),
  is_featured            boolean not null default false,
  is_verified            boolean not null default false,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index if not exists properties_purpose_idx on public.properties (purpose);
create index if not exists properties_category_idx on public.properties (category);
create index if not exists properties_city_idx on public.properties (city);
create index if not exists properties_added_at_idx on public.properties (added_at desc);

-- keep updated_at current on every write
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;
create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- Row Level Security: anyone can read listings (the public site), only
-- authenticated users (the admin) can create/change/remove them. This
-- project uses a single shared admin login — every authenticated user is
-- trusted with full write access.
alter table public.properties enable row level security;

drop policy if exists "Public can read properties" on public.properties;
create policy "Public can read properties"
  on public.properties for select
  to anon, authenticated
  using (true);

drop policy if exists "Authenticated can insert properties" on public.properties;
create policy "Authenticated can insert properties"
  on public.properties for insert
  to authenticated
  with check (true);

drop policy if exists "Authenticated can update properties" on public.properties;
create policy "Authenticated can update properties"
  on public.properties for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete properties" on public.properties;
create policy "Authenticated can delete properties"
  on public.properties for delete
  to authenticated
  using (true);

-- Storage bucket for listing photos, uploaded from the admin dashboard.
insert into storage.buckets (id, name, public)
values ('property-images', 'property-images', true)
on conflict (id) do nothing;

drop policy if exists "Public can view property images" on storage.objects;
create policy "Public can view property images"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'property-images');

drop policy if exists "Authenticated can upload property images" on storage.objects;
create policy "Authenticated can upload property images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'property-images');

drop policy if exists "Authenticated can delete property images" on storage.objects;
create policy "Authenticated can delete property images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'property-images');
