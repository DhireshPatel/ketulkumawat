-- =====================================================================
--  PYQ (Previous Year Question Papers) system
--  Run this whole file once in: Supabase Dashboard -> SQL Editor -> New query
--  Safe to re-run (idempotent).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1. Admin allow-list
--    Only users listed here are admins. Add yourself AFTER creating your
--    user in Authentication -> Users:
--      insert into public.admin_users (user_id)
--      select id from auth.users where email = 'you@example.com';
-- ---------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
-- No policies on purpose: nobody except the service role / is_admin() can read it.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated, service_role;

-- ---------------------------------------------------------------------
-- 2. updated_at trigger
-- ---------------------------------------------------------------------
create or replace function public.pyq_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- 3. Exams
-- ---------------------------------------------------------------------
create table if not exists public.pyq_exams (
  id             uuid primary key default gen_random_uuid(),
  name           text not null check (char_length(name) between 2 and 100),
  slug           text not null unique
                   check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) <= 80),
  description    text check (description is null or char_length(description) <= 500),
  thumbnail_path text,
  display_order  integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

drop trigger if exists trg_pyq_exams_updated on public.pyq_exams;
create trigger trg_pyq_exams_updated before update on public.pyq_exams
  for each row execute function public.pyq_set_updated_at();

create index if not exists idx_pyq_exams_active_order
  on public.pyq_exams (is_active, display_order, name);

-- ---------------------------------------------------------------------
-- 4. Papers  (many papers per exam+year are allowed - NO unique on exam+year)
-- ---------------------------------------------------------------------
create table if not exists public.pyq_papers (
  id                 uuid primary key default gen_random_uuid(),
  exam_id            uuid not null references public.pyq_exams(id) on delete restrict,
  year               integer not null check (year between 1900 and 2200),
  title              text not null check (char_length(title) between 2 and 200),
  session            text check (session  is null or char_length(session)  <= 100),
  shift              text check (shift    is null or char_length(shift)    <= 100),
  subject            text check (subject  is null or char_length(subject)  <= 100),
  paper_type         text not null default 'question_paper'
                       check (paper_type in ('question_paper','answer_key','solution','other')),
  language           text check (language is null or char_length(language) <= 100),
  description        text check (description is null or char_length(description) <= 1000),
  storage_path       text not null unique,
  original_file_name text,
  file_size          bigint check (file_size is null or file_size > 0),
  mime_type          text not null default 'application/pdf' check (mime_type = 'application/pdf'),
  status             text not null default 'draft' check (status in ('draft','published')),
  display_order      integer not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

drop trigger if exists trg_pyq_papers_updated on public.pyq_papers;
create trigger trg_pyq_papers_updated before update on public.pyq_papers
  for each row execute function public.pyq_set_updated_at();

create index if not exists idx_pyq_papers_exam_year   on public.pyq_papers (exam_id, year desc);
create index if not exists idx_pyq_papers_exam_status on public.pyq_papers (exam_id, status, year desc);
create index if not exists idx_pyq_papers_status      on public.pyq_papers (status);
create index if not exists idx_pyq_papers_year        on public.pyq_papers (year);
create index if not exists idx_pyq_papers_updated     on public.pyq_papers (updated_at desc);

-- ---------------------------------------------------------------------
-- 5. Log of storage files that could not be deleted (for later cleanup)
-- ---------------------------------------------------------------------
create table if not exists public.pyq_orphaned_files (
  id          uuid primary key default gen_random_uuid(),
  bucket      text not null,
  path        text not null,
  reason      text,
  created_at  timestamptz not null default now(),
  resolved_at timestamptz
);
alter table public.pyq_orphaned_files enable row level security;
-- No policies: only the service role (server) can use it.

-- Files in the private bucket that no paper row points to (older than 1 hour).
create or replace view public.pyq_orphan_objects as
select o.name as path, o.created_at
from storage.objects o
where o.bucket_id = 'pyq-papers'
  and o.created_at < now() - interval '1 hour'
  and not exists (select 1 from public.pyq_papers p where p.storage_path = o.name);
revoke all on public.pyq_orphan_objects from public, anon, authenticated;
grant select on public.pyq_orphan_objects to service_role;

-- ---------------------------------------------------------------------
-- 6. Row Level Security
-- ---------------------------------------------------------------------
alter table public.pyq_exams  enable row level security;
alter table public.pyq_papers enable row level security;

drop policy if exists "pyq_exams public read active" on public.pyq_exams;
create policy "pyq_exams public read active" on public.pyq_exams
  for select to anon, authenticated
  using (is_active = true);

drop policy if exists "pyq_exams admin all" on public.pyq_exams;
create policy "pyq_exams admin all" on public.pyq_exams
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

drop policy if exists "pyq_papers public read published" on public.pyq_papers;
create policy "pyq_papers public read published" on public.pyq_papers
  for select to anon, authenticated
  using (
    status = 'published'
    and exists (select 1 from public.pyq_exams e where e.id = exam_id and e.is_active = true)
  );

drop policy if exists "pyq_papers admin all" on public.pyq_papers;
create policy "pyq_papers admin all" on public.pyq_papers
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ---------------------------------------------------------------------
-- 7. Storage buckets
--    pyq-papers     : PRIVATE, PDF only, 25 MB  (served via short-lived signed URLs)
--    pyq-thumbnails : public, images only, 2 MB (exam logos - not sensitive)
--    If you change the limit, also change PYQ_MAX_FILE_MB in .env.local.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('pyq-papers', 'pyq-papers', false, 26214400, array['application/pdf'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('pyq-thumbnails', 'pyq-thumbnails', true, 2097152,
        array['image/png','image/jpeg','image/webp'])
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Storage policies. There is intentionally NO anon/public policy on pyq-papers:
-- students can only reach PDFs through the app, which checks "published" first.
drop policy if exists "pyq_papers_bucket admin all" on storage.objects;
create policy "pyq_papers_bucket admin all" on storage.objects
  for all to authenticated
  using (bucket_id = 'pyq-papers' and public.is_admin())
  with check (bucket_id = 'pyq-papers' and public.is_admin());

drop policy if exists "pyq_thumbnails_bucket admin all" on storage.objects;
create policy "pyq_thumbnails_bucket admin all" on storage.objects
  for all to authenticated
  using (bucket_id = 'pyq-thumbnails' and public.is_admin())
  with check (bucket_id = 'pyq-thumbnails' and public.is_admin());
