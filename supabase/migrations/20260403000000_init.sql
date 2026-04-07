-- Privacy levels for personal data
-- normal | sensitive | frozen | temporary

-- Profiles (1:1 with auth.users)
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  timezone text not null default 'UTC',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Journal entries
create table public.journal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null default '',
  body text not null default '',
  privacy_level text not null
    default 'normal'
    check (privacy_level in ('normal', 'sensitive', 'frozen', 'temporary')),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index journal_entries_user_created_idx
  on public.journal_entries (user_id, created_at desc);

alter table public.journal_entries enable row level security;

create policy "journal_select_own"
  on public.journal_entries for select
  using (auth.uid() = user_id);

create policy "journal_insert_own"
  on public.journal_entries for insert
  with check (auth.uid() = user_id);

create policy "journal_update_own"
  on public.journal_entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "journal_delete_own"
  on public.journal_entries for delete
  using (auth.uid() = user_id);

-- Memories
create table public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  content text not null,
  label text,
  privacy_level text not null
    default 'normal'
    check (privacy_level in ('normal', 'sensitive', 'frozen', 'temporary')),
  status text not null
    default 'active'
    check (status in ('active', 'archived')),
  source text not null
    default 'manual'
    check (source in ('manual', 'chat_suggested', 'import')),
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index memories_user_created_idx
  on public.memories (user_id, created_at desc);

alter table public.memories enable row level security;

create policy "memories_select_own"
  on public.memories for select
  using (auth.uid() = user_id);

create policy "memories_insert_own"
  on public.memories for insert
  with check (auth.uid() = user_id);

create policy "memories_update_own"
  on public.memories for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "memories_delete_own"
  on public.memories for delete
  using (auth.uid() = user_id);
