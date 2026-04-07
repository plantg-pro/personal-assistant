-- Per-row and profile defaults for future AI features (no AI logic in app yet)

alter table public.profiles
  add column if not exists privacy_level text not null default 'normal',
  add column if not exists is_used_in_ai boolean not null default true;

alter table public.journal_entries
  add column if not exists is_used_in_ai boolean not null default true;

alter table public.memories
  add column if not exists is_used_in_ai boolean not null default true;
