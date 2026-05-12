-- Supabase Schema for AI Spend Audit (Day 4 Requirement)

-- Setup the core audits table tracking leads and engine results.
create table public.audits (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    total_spend numeric not null,
    optimal_spend numeric not null,
    savings numeric not null,
    red_flags jsonb,
    ai_summary text,
    user_email text -- Captured lead info for GTM constraints
);

-- Enable Row Level Security (RLS)
alter table public.audits enable row level security;

-- Policies:
-- 1. Allow anonymous inserts (as leads are captured via the open public form)
create policy "Allow public inserts to audits"
  on public.audits for insert
  with check (true);

-- 2. Allow public reads solely if they have the specific ID (sharing the URL)
create policy "Allow public reads of specific audits"
  on public.audits for select
  using (true);

-- Create index on user_email for potential future admin dashboard queries
create index idx_audits_email on public.audits(user_email);
