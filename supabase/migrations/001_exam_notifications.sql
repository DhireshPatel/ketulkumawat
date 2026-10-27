-- =====================================================================
-- Exam Notifications: one new table, safe to run more than once.
-- Does NOT touch any existing table, policy, function or auth object.
-- Everything created here is namespaced: exam_notifications,
-- exam_alerts_* functions/triggers/policies.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. ADMIN CHECK  (>>> EDIT THE BODY TO MATCH YOUR EXISTING ADMIN SYSTEM <<<)
-- ---------------------------------------------------------------------
-- Both the RLS policies and the Next.js server code call this ONE function,
-- so there is a single source of truth for "who is an admin".
--
-- Run this first to see how your project identifies admins:
--   select table_name from information_schema.tables where table_schema='public';
--
-- Your admin login is a normal Supabase email/password login, so the safest simple choice is
-- Example C (your own admin email). Pick ONE example, uncomment it, and delete the others.
-- The function is fail-closed: any error returns false.
create or replace function public.exam_alerts_is_admin()
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return false;
  end if;

  -- Example A: an admin-membership table with a user_id column
  -- return exists (select 1 from public.admin_users where user_id = auth.uid());

  -- Example B: a profiles table with a role column
  -- return exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');

  -- Example C: a single known admin email (only if you have nothing else)
  -- return lower(coalesce(auth.jwt() ->> 'email', '')) in ('your-admin-email@example.com');

  -- Default: nobody is admin until you edit this function (fail-closed).
  return false;
exception when others then
  return false;
end;
$$;

revoke all on function public.exam_alerts_is_admin() from public;
grant execute on function public.exam_alerts_is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------
-- 2. TABLE
-- ---------------------------------------------------------------------
create table if not exists public.exam_notifications (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  slug               text not null,
  category           text not null,
  short_description  text,
  description        text,
  application_start  date,
  application_end    date,
  exam_date          date,
  eligibility        text,
  application_fee    text,
  application_url    text,
  official_notice_url text,
  publication_status text not null default 'draft',
  is_featured        boolean not null default false,
  verified_at        timestamptz,
  published_at       timestamptz,
  created_by         uuid references auth.users (id) on delete set null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),

  constraint exam_notifications_slug_key unique (slug),
  constraint exam_notifications_title_len check (char_length(title) between 1 and 200),
  constraint exam_notifications_slug_format check (
    slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 120
  ),
  constraint exam_notifications_status_valid check (
    publication_status in ('draft', 'published', 'archived')
  ),
  constraint exam_notifications_dates_order check (
    application_start is null or application_end is null
    or application_start <= application_end
  ),
  constraint exam_notifications_app_url_https check (
    application_url is null or application_url ~* '^https://[^\s]+$'
  ),
  constraint exam_notifications_notice_url_https check (
    official_notice_url is null or official_notice_url ~* '^https://[^\s]+$'
  ),
  -- A published row must always have a verified application link and a verification date.
  constraint exam_notifications_publish_requirements check (
    publication_status <> 'published'
    or (application_url is not null and verified_at is not null)
  )
);

-- ---------------------------------------------------------------------
-- 3. INDEXES
-- ---------------------------------------------------------------------
create index if not exists exam_notifications_public_idx
  on public.exam_notifications (published_at desc nulls last, created_at desc)
  where publication_status = 'published';

create index if not exists exam_notifications_status_idx
  on public.exam_notifications (publication_status, created_at desc);

create index if not exists exam_notifications_category_idx
  on public.exam_notifications (category);

-- ---------------------------------------------------------------------
-- 4. TRIGGERS: updated_at, published_at, immutable created_by
-- ---------------------------------------------------------------------
create or replace function public.exam_alerts_before_write()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();

  if tg_op = 'INSERT' then
    if new.publication_status = 'published' and new.published_at is null then
      new.published_at := now();
    end if;
  else
    -- created_by can never be changed after insert
    new.created_by := old.created_by;
    new.created_at := old.created_at;
    if new.publication_status = 'published'
       and old.publication_status is distinct from 'published' then
      new.published_at := now();
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists exam_notifications_before_write on public.exam_notifications;
create trigger exam_notifications_before_write
  before insert or update on public.exam_notifications
  for each row execute function public.exam_alerts_before_write();

-- ---------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------
-- These policies exist only on the new table, so they cannot clash with
-- policies on your other tables. Drop-and-create keeps the script re-runnable.
alter table public.exam_notifications enable row level security;

drop policy if exists "exam_notifications_public_read_published" on public.exam_notifications;
create policy "exam_notifications_public_read_published"
  on public.exam_notifications
  for select
  to anon, authenticated
  using (publication_status = 'published');

drop policy if exists "exam_notifications_admin_read_all" on public.exam_notifications;
create policy "exam_notifications_admin_read_all"
  on public.exam_notifications
  for select
  to authenticated
  using (public.exam_alerts_is_admin());

drop policy if exists "exam_notifications_admin_insert" on public.exam_notifications;
create policy "exam_notifications_admin_insert"
  on public.exam_notifications
  for insert
  to authenticated
  with check (public.exam_alerts_is_admin() and created_by = auth.uid());

drop policy if exists "exam_notifications_admin_update" on public.exam_notifications;
create policy "exam_notifications_admin_update"
  on public.exam_notifications
  for update
  to authenticated
  using (public.exam_alerts_is_admin())
  with check (public.exam_alerts_is_admin());

drop policy if exists "exam_notifications_admin_delete" on public.exam_notifications;
create policy "exam_notifications_admin_delete"
  on public.exam_notifications
  for delete
  to authenticated
  using (public.exam_alerts_is_admin());

-- Table privileges: anon gets read only; RLS limits it to published rows.
revoke all on public.exam_notifications from anon, authenticated;
grant select on public.exam_notifications to anon;
grant select, insert, update, delete on public.exam_notifications to authenticated;
