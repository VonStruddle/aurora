create table if not exists landings (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  contact_url           text not null,
  persona_type          text not null check (persona_type in ('founder','marketing','finance','ecom','retention')),
  company_name          text not null,
  company_industry      text,
  company_estimated_gmv text,
  company_logo_url      text,
  company_pain_points   text[],
  recipient_name        text,
  recipient_title       text,
  hook_text             text not null,
  hero_headline         text,
  hero_subheadline      text,
  closing_outcome       text
);

alter table landings enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'landings' and policyname = 'Public read'
  ) then
    execute 'create policy "Public read" on landings for select using (true)';
  end if;
end $$;
