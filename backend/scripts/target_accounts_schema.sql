-- Schema for the curated target-account list + their contacts.
-- Applied to Supabase project vmpzkytxdruwbdftxtnm (Aurora) as migration
-- `hackathon_target_accounts_and_contacts`. Kept here for reproducibility.
-- Populated by scripts/ingest_target_accounts.py (Snowflake -> Supabase).

create table if not exists public.hackathon_target_accounts (
  domain text primary key,
  brand text,
  gmv_musd numeric,              -- curated GMV in $M (seed list)
  sig text,                      -- curated signal shorthand (seed list)
  company_name text,
  marketing_annual_gmv numeric,  -- from internal.marketing.brands
  tier text,
  som_category text,
  industry text,
  platform text,
  has_deal boolean,
  estimated_employee_count numeric,
  hubspot_id text,
  parent_domain text,
  created_at timestamptz not null default now()
);

create table if not exists public.hackathon_target_contacts (
  id text primary key,           -- brand_contacts.id (Snowflake)
  parent_domain text not null
    references public.hackathon_target_accounts(domain) on delete cascade,
  domain text,
  full_name text,
  first_name text,
  last_name text,
  job_title text,
  job_seniority text,
  department text,
  job_function text,
  email text,
  personal_email text,
  has_verified_email boolean,
  linkedin_page text,
  country text,
  city text,
  state text,
  persona_score numeric,
  is_icp boolean,
  is_likely_to_engage boolean,
  company_name text,
  created_at timestamptz not null default now()
);

create index if not exists idx_hackathon_target_contacts_parent_domain
  on public.hackathon_target_contacts (parent_domain);

-- Backend uses the service-role key (bypasses RLS); RLS on keeps anon locked out.
alter table public.hackathon_target_accounts enable row level security;
alter table public.hackathon_target_contacts enable row level security;
