-- Reel Dinner members (Phase 1, 16 Nov 2026).
-- Real sign-in (email code, Google) on top of the existing member card table.
-- Additive: the old member number + PIN cards keep working through mns-sync.
-- A card belongs to an account through user_id. Deleting the account deletes the card.

alter table movies.members add column if not exists user_id uuid unique references auth.users(id) on delete cascade;
alter table movies.members alter column pin_hash drop not null;

-- The signed-in member's card, or status new.
create or replace function public.member_load()
returns jsonb language plpgsql security definer
set search_path to 'movies', 'public'
as $$
declare r movies.members; uid uuid := auth.uid();
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  select * into r from movies.members where user_id = uid;
  if not found then return jsonb_build_object('status','new'); end if;
  return jsonb_build_object('status','ok','no',r.no,'data',r.data,'updated_at',r.updated_at);
end $$;

-- Save the signed-in member's card. First save makes the card: it keeps the
-- device's member number when nobody else has it, otherwise picks a free one.
create or replace function public.member_save(p_no text, p_data jsonb)
returns jsonb language plpgsql security definer
set search_path to 'movies', 'public'
as $$
declare r movies.members; uid uuid := auth.uid(); n text; tries int := 0;
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  if p_data is null or jsonb_typeof(p_data) <> 'object' then return jsonb_build_object('status','bad'); end if;
  if octet_length(p_data::text) > 200000 then return jsonb_build_object('status','toobig'); end if;
  select * into r from movies.members where user_id = uid;
  if found then
    update movies.members set data = p_data, updated_at = now() where user_id = uid;
    return jsonb_build_object('status','ok','no',r.no,'updated_at',now());
  end if;
  n := case when p_no ~ '^[0-9]{6}$' then p_no else null end;
  while n is null or exists (select 1 from movies.members where no = n) loop
    tries := tries + 1;
    if tries > 50 then return jsonb_build_object('status','error'); end if;
    n := lpad((100000 + floor(random() * 900000))::int::text, 6, '0');
  end loop;
  insert into movies.members(no, pin_hash, data, user_id) values (n, null, p_data, uid);
  return jsonb_build_object('status','ok','no',n,'updated_at',now(),'new',true);
end $$;

-- Bring an old number + PIN card into the account (only when the account has no card yet).
create or replace function public.member_link(p_no text, p_pin text)
returns jsonb language plpgsql security definer
set search_path to 'movies', 'extensions', 'public'
as $$
declare r movies.members; uid uuid := auth.uid();
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  if p_no !~ '^[0-9]{6}$' or p_pin !~ '^[0-9]{4}$' then return jsonb_build_object('status','bad'); end if;
  if exists (select 1 from movies.members where user_id = uid) then return jsonb_build_object('status','hascard'); end if;
  select * into r from movies.members where no = p_no;
  if not found then return jsonb_build_object('status','new'); end if;
  if r.user_id is not null then return jsonb_build_object('status','taken'); end if;
  if r.fails >= 10 then return jsonb_build_object('status','locked'); end if;
  if r.pin_hash is null or r.pin_hash <> extensions.crypt(p_pin, r.pin_hash) then
    update movies.members set fails = fails + 1 where no = p_no;
    return jsonb_build_object('status','badpin');
  end if;
  update movies.members set user_id = uid, pin_hash = null, fails = 0, updated_at = now() where no = p_no;
  return jsonb_build_object('status','ok','no',r.no,'data',r.data);
end $$;

-- Delete the account and, through the cascade, its card.
create or replace function public.member_delete()
returns jsonb language plpgsql security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  delete from movies.members where user_id = uid;
  delete from auth.users where id = uid;
  return jsonb_build_object('status','deleted');
end $$;

revoke all on function public.member_load() from public, anon;
revoke all on function public.member_save(text, jsonb) from public, anon;
revoke all on function public.member_link(text, text) from public, anon;
revoke all on function public.member_delete() from public, anon;
grant execute on function public.member_load() to authenticated;
grant execute on function public.member_save(text, jsonb) to authenticated;
grant execute on function public.member_link(text, text) to authenticated;
grant execute on function public.member_delete() to authenticated;

-- The old PIN functions must not touch account cards.
create or replace function public.mns_load(p_no text, p_pin text)
returns jsonb language plpgsql security definer
set search_path to 'movies', 'extensions', 'public'
as $$
declare r movies.members;
begin
  if p_no !~ '^[0-9]{6}$' or p_pin !~ '^[0-9]{4}$' then return jsonb_build_object('status','bad'); end if;
  select * into r from movies.members where no = p_no;
  if not found then return jsonb_build_object('status','new'); end if;
  if r.user_id is not null or r.pin_hash is null then return jsonb_build_object('status','account'); end if;
  if r.fails >= 10 then return jsonb_build_object('status','locked'); end if;
  if r.pin_hash <> extensions.crypt(p_pin, r.pin_hash) then
    update movies.members set fails = fails + 1 where no = p_no;
    return jsonb_build_object('status','badpin');
  end if;
  update movies.members set fails = 0 where no = p_no;
  return jsonb_build_object('status','ok','data',r.data,'updated_at',r.updated_at);
end $$;

create or replace function public.mns_save(p_no text, p_pin text, p_data jsonb)
returns jsonb language plpgsql security definer
set search_path to 'movies', 'extensions', 'public'
as $$
declare r movies.members;
begin
  if p_no !~ '^[0-9]{6}$' or p_pin !~ '^[0-9]{4}$' then return jsonb_build_object('status','bad'); end if;
  if octet_length(p_data::text) > 200000 then return jsonb_build_object('status','toobig'); end if;
  select * into r from movies.members where no = p_no;
  if not found then
    insert into movies.members(no, pin_hash, data) values (p_no, extensions.crypt(p_pin, extensions.gen_salt('bf')), p_data);
    return jsonb_build_object('status','ok','updated_at',now());
  end if;
  if r.user_id is not null or r.pin_hash is null then return jsonb_build_object('status','account'); end if;
  if r.fails >= 10 then return jsonb_build_object('status','locked'); end if;
  if r.pin_hash <> extensions.crypt(p_pin, r.pin_hash) then
    update movies.members set fails = fails + 1 where no = p_no;
    return jsonb_build_object('status','badpin');
  end if;
  update movies.members set data = p_data, updated_at = now(), fails = 0 where no = p_no;
  return jsonb_build_object('status','ok','updated_at',now());
end $$;

-- An account card has no PIN: without this check a null PIN hash would let anyone delete it.
create or replace function public.mns_delete(p_no text, p_pin text)
returns jsonb language plpgsql security definer
set search_path to 'movies', 'extensions', 'public'
as $$
declare r movies.members;
begin
  if p_no !~ '^[0-9]{6}$' or p_pin !~ '^[0-9]{4}$' then return jsonb_build_object('status','bad'); end if;
  select * into r from movies.members where no = p_no;
  if not found then return jsonb_build_object('status','gone'); end if;
  if r.user_id is not null or r.pin_hash is null then return jsonb_build_object('status','account'); end if;
  if r.fails >= 10 then return jsonb_build_object('status','locked'); end if;
  if r.pin_hash <> extensions.crypt(p_pin, r.pin_hash) then
    update movies.members set fails = fails + 1 where no = p_no;
    return jsonb_build_object('status','badpin');
  end if;
  delete from movies.members where no = p_no;
  return jsonb_build_object('status','deleted');
end $$;
