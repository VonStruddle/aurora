import pg from 'pg'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Load .env.local manually
const envPath = resolve(__dirname, '../.env.local')
const envContent = readFileSync(envPath, 'utf8')
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const [key, ...rest] = trimmed.split('=')
  process.env[key] = rest.join('=')
}

const { Client } = pg
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

const SQL = `
create table if not exists landings (
  id                   uuid primary key default gen_random_uuid(),
  created_at           timestamptz not null default now(),
  contact_url          text not null,
  persona_type         text not null check (persona_type in ('founder','marketing','finance','ecom','retention')),
  company_name         text not null,
  company_industry     text,
  company_estimated_gmv text,
  company_logo_url     text,
  company_pain_points  text[],
  recipient_name       text,
  recipient_title      text,
  hook_text            text not null,
  hero_headline        text,
  hero_subheadline     text,
  closing_outcome      text
);

alter table landings enable row level security;

do $$ begin
  if not exists (
    select 1 from pg_policies where tablename = 'landings' and policyname = 'Public read'
  ) then
    execute 'create policy "Public read" on landings for select using (true)';
  end if;
end $$;
`

try {
  await client.connect()
  console.log('Connected to database.')

  await client.query(SQL)
  console.log('Table "landings" created (or already exists).')
  console.log('RLS enabled + public read policy applied.')
} catch (err) {
  console.error('Migration failed:', err.message)
  process.exit(1)
} finally {
  await client.end()
}
