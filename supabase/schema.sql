-- ============================================================================
-- AI Security Academy — Supabase schema, security policies, and owner analytics
-- Run this ONCE in your Supabase project: SQL Editor → paste → Run.
-- ============================================================================

-- 1) Per-user progress. One row per authenticated user.
--    `state`   = full app state blob (progress, quizBest, srs, ivRate, streak, ...)
--    `summary` = lightweight rollup the client writes for fast analytics.
create table if not exists public.progress (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  state      jsonb not null default '{}'::jsonb,
  summary    jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;

-- 2) Row-level security: a user may only read/write THEIR OWN row.
--    (Owner analytics goes through the SECURITY DEFINER function below, not direct reads.)
drop policy if exists "progress_select_own" on public.progress;
create policy "progress_select_own" on public.progress
  for select using (auth.uid() = user_id);

drop policy if exists "progress_insert_own" on public.progress;
create policy "progress_insert_own" on public.progress
  for insert with check (auth.uid() = user_id);

drop policy if exists "progress_update_own" on public.progress;
create policy "progress_update_own" on public.progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 3) Owners allow-list. Only emails in here can call owner_stats().
create table if not exists public.owners ( email text primary key );
alter table public.owners enable row level security;
-- (No policies => not readable by clients; the SECURITY DEFINER function bypasses RLS.)

-- >>> IMPORTANT: add your own email so you can see the Admin dashboard:
-- insert into public.owners(email) values ('you@example.com') on conflict do nothing;

-- 4) Keep updated_at fresh on every write.
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists progress_touch on public.progress;
create trigger progress_touch before update on public.progress
  for each row execute function public.touch_updated_at();

-- 5) Owner analytics. Aggregates across ALL users, but only for allow-listed owners.
--    Returns anonymized-by-default usage stats + a per-user activity list.
create or replace function public.owner_stats()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  caller text := auth.jwt() ->> 'email';
  result json;
begin
  if caller is null or caller not in (select email from public.owners) then
    raise exception 'not authorized';
  end if;

  select json_build_object(
    'generated_at', now(),
    'total_users', count(*),
    'active_1d',  count(*) filter (where updated_at > now() - interval '1 day'),
    'active_7d',  count(*) filter (where updated_at > now() - interval '7 days'),
    'active_30d', count(*) filter (where updated_at > now() - interval '30 days'),
    'avg_pct',    coalesce(round(avg( nullif(summary->>'pct','')::numeric ), 1), 0),
    'avg_quiz',   coalesce(round(avg( nullif(summary->>'quizAvg','')::numeric ), 1), 0),
    'lessons_completed_total', coalesce(sum( nullif(summary->>'lessonsDone','')::int ), 0),
    'users', coalesce(
      json_agg(
        json_build_object(
          'email',        email,
          'pct',          coalesce((summary->>'pct')::numeric, 0),
          'lessons',      coalesce((summary->>'lessonsDone')::int, 0),
          'quiz',         summary->>'quizAvg',
          'streak',       coalesce((summary->>'streak')::int, 0),
          'cards_seen',   coalesce((summary->>'cardsSeen')::int, 0),
          'iv_drilled',   coalesce((summary->>'ivDrilled')::int, 0),
          'active_path',  summary->>'activePath',
          'last_active',  updated_at
        )
        order by updated_at desc
      ),
      '[]'::json
    )
  )
  into result
  from public.progress;

  return result;
end;
$$;

grant execute on function public.owner_stats() to authenticated;
