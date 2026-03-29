-- ProposalPulse Database Schema

create table if not exists pp_proposals (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  client_name text not null,
  client_email text default '',
  title text not null,
  blocks jsonb default '[]',
  status text check (status in ('draft', 'sent', 'viewed', 'accepted', 'declined')) default 'draft',
  total_value integer default 0,
  share_token text unique not null,
  signature_name text,
  signature_date timestamptz,
  sent_at timestamptz,
  viewed_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists pp_proposal_views (
  id uuid default gen_random_uuid() primary key,
  proposal_id uuid references pp_proposals(id) on delete cascade not null,
  viewed_at timestamptz default now(),
  time_spent_seconds integer default 0,
  sections_viewed jsonb default '[]'
);

-- RLS
alter table pp_proposals enable row level security;
alter table pp_proposal_views enable row level security;

create policy "Users manage their proposals" on pp_proposals for all using (auth.uid() = user_id);
create policy "Anyone can view shared proposals" on pp_proposals for select using (status != 'draft');
create policy "Anyone can accept/decline" on pp_proposals for update using (true);
create policy "Anyone can track views" on pp_proposal_views for insert with check (true);
create policy "Owners read views" on pp_proposal_views for select using (
  proposal_id in (select id from pp_proposals where user_id = auth.uid())
);

-- Indexes
create index if not exists idx_pp_proposals_user_id on pp_proposals(user_id);
create index if not exists idx_pp_proposals_share_token on pp_proposals(share_token);
create index if not exists idx_pp_proposals_status on pp_proposals(status);
create index if not exists idx_pp_views_proposal_id on pp_proposal_views(proposal_id);
