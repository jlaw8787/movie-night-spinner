-- Reel Dinner Phase 2 (built 16 Nov 2026, NOT applied live until Josh says deploy):
-- friends, invite links, Dinner Duel, the inbox, email alert settings and Galaxy Video late fees.
-- Same pattern as Match night and the member card: tables have RLS on and no policies, so the page can't
-- read them directly. Everything goes through the functions below, which only ever act for auth.uid().
-- Deleting an account (member_delete) deletes the auth user, and every row here cascades away with it.

-- ---------- tables ----------
create table if not exists movies.friends (
  user_id uuid not null references auth.users(id) on delete cascade,
  friend_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, friend_id),
  check (user_id <> friend_id)
);
create index if not exists friends_friend_idx on movies.friends(friend_id);

create table if not exists movies.friend_requests (
  from_user uuid not null references auth.users(id) on delete cascade,
  to_user uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (from_user, to_user),
  check (from_user <> to_user)
);
create index if not exists friend_requests_to_idx on movies.friend_requests(to_user);

create table if not exists movies.blocks (
  user_id uuid not null references auth.users(id) on delete cascade,
  blocked_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, blocked_id)
);
create index if not exists blocks_blocked_idx on movies.blocks(blocked_id);

create table if not exists movies.duels (
  id uuid primary key default gen_random_uuid(),
  from_user uuid not null references auth.users(id) on delete cascade,
  to_user uuid references auth.users(id) on delete cascade,           -- null until an invite link is opened
  vibe text not null default 'any' check (length(vibe) <= 40),
  deck jsonb not null check (jsonb_typeof(deck) = 'array' and jsonb_array_length(deck) between 1 and 30),
  status text not null default 'open' check (status in ('open','matched','nomatch','settled','closed')),
  match text check (match is null or length(match) <= 160),
  from_done boolean not null default false,
  to_done boolean not null default false,
  created_at timestamptz not null default now(),
  last_move_at timestamptz not null default now(),
  nudged_at timestamptz,
  check (to_user is null or to_user <> from_user)
);
create index if not exists duels_from_idx on movies.duels(from_user, last_move_at desc);
create index if not exists duels_to_idx on movies.duels(to_user, last_move_at desc);

create table if not exists movies.duel_swipes (
  duel_id uuid not null references movies.duels(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  film text not null check (length(film) <= 160),
  keep boolean not null,
  at timestamptz not null default now(),
  primary key (duel_id, user_id, film)
);

create table if not exists movies.invites (
  code text primary key check (code ~ '^[A-Z2-9]{8}$'),
  from_user uuid not null references auth.users(id) on delete cascade,
  duel_id uuid references movies.duels(id) on delete cascade,         -- null = a plain friend link
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '14 days',
  uses int not null default 0
);
create index if not exists invites_from_idx on movies.invites(from_user);
create index if not exists invites_duel_idx on movies.invites(duel_id);

create table if not exists movies.inbox (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('friend_joined','friend_request','friend_accepted','duel_new','duel_match','duel_nomatch','duel_settled','late_fee')),
  from_user uuid references auth.users(id) on delete cascade,
  duel_id uuid references movies.duels(id) on delete cascade,
  film text check (film is null or length(film) <= 160),
  created_at timestamptz not null default now(),
  read_at timestamptz,
  emailed_at timestamptz
);
create index if not exists inbox_user_idx on movies.inbox(user_id, id desc);
create index if not exists inbox_email_idx on movies.inbox(created_at) where emailed_at is null and read_at is null;

create table if not exists movies.alert_prefs (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email_on boolean not null default true,      -- emails for duel invites, late fees, friend requests and matches
  digest boolean not null default true,        -- Monday email, only sent when someone is waiting on you
  late_fees boolean not null default true,     -- the joke late fee notices (inbox and email)
  last_email_at timestamptz,
  last_digest_at timestamptz
);

alter table movies.friends enable row level security;
alter table movies.friend_requests enable row level security;
alter table movies.blocks enable row level security;
alter table movies.duels enable row level security;
alter table movies.duel_swipes enable row level security;
alter table movies.invites enable row level security;
alter table movies.inbox enable row level security;
alter table movies.alert_prefs enable row level security;

-- ---------- helpers (not callable from the page) ----------
-- How a member shows to friends: the name on their card, else their member number.
create or replace function movies.who(p uuid)
returns jsonb language sql stable security definer
set search_path to 'movies', 'public'
as $$
  select case when p is null then null
    when m.no is null then jsonb_build_object('id', p, 'name', 'A Galaxy Video member', 'no', null)
    else jsonb_build_object('id', p, 'no', m.no,
      'name', left(coalesce(nullif(btrim(m.data->'member'->>'name'), ''), 'Member ' || substr(m.no, 1, 3) || ' ' || substr(m.no, 4)), 24))
  end
  from (select 1) x left join movies.members m on m.user_id = p
$$;

create or replace function movies.blocked(a uuid, b uuid)
returns boolean language sql stable security definer
set search_path to 'movies', 'public'
as $$ select exists (select 1 from movies.blocks where (user_id = a and blocked_id = b) or (user_id = b and blocked_id = a)) $$;

create or replace function movies.are_friends(a uuid, b uuid)
returns boolean language sql stable security definer
set search_path to 'movies', 'public'
as $$ select exists (select 1 from movies.friends where user_id = a and friend_id = b) $$;

create or replace function movies.make_friends(a uuid, b uuid)
returns boolean language plpgsql security definer
set search_path to 'movies', 'public'
as $$
declare fresh boolean := not movies.are_friends(a, b);
begin
  insert into movies.friends(user_id, friend_id) values (a, b), (b, a) on conflict do nothing;
  delete from movies.friend_requests where (from_user = a and to_user = b) or (from_user = b and to_user = a);
  return fresh;
end $$;

-- One inbox line. Nothing from someone you've blocked, and no second unread line about the same duel.
create or replace function movies.notify(p_to uuid, p_kind text, p_from uuid, p_duel uuid, p_film text)
returns void language plpgsql security definer
set search_path to 'movies', 'public'
as $$
begin
  if p_to is null or p_to = p_from then return; end if;
  if p_from is not null and movies.blocked(p_to, p_from) then return; end if;
  if p_duel is not null and exists (select 1 from movies.inbox where user_id = p_to and kind = p_kind and duel_id = p_duel and read_at is null) then return; end if;
  insert into movies.inbox(user_id, kind, from_user, duel_id, film) values (p_to, p_kind, p_from, p_duel, p_film);
end $$;

-- 8 letters and numbers, nothing that reads two ways (no 0/O, 1/I/L).
create or replace function movies.new_code()
returns text language plpgsql volatile
set search_path to 'movies', 'extensions', 'public'
as $$
declare a text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; b bytea; c text;
begin
  loop
    b := extensions.gen_random_bytes(8); c := '';
    for i in 0..7 loop c := c || substr(a, 1 + (get_byte(b, i) % length(a)), 1); end loop;
    exit when not exists (select 1 from movies.invites where code = c);
  end loop;
  return c;
end $$;

-- Wins in a row with one friend: the most recent finished duels that matched, up to the first one that didn't.
create or replace function movies.streak(a uuid, b uuid)
returns int language sql stable security definer
set search_path to 'movies', 'public'
as $$
  select count(*)::int from (
    select status, sum(case when status = 'matched' then 0 else 1 end) over (order by last_move_at desc rows unbounded preceding) as breaks
    from movies.duels
    where ((from_user = a and to_user = b) or (from_user = b and to_user = a)) and status in ('matched','nomatch','settled')
  ) s where breaks = 0
$$;

-- The whole duel as one person sees it. Their keeps stay hidden until the deck runs out with no match.
create or replace function movies.duel_view(p_id uuid, p_uid uuid)
returns jsonb language plpgsql stable security definer
set search_path to 'movies', 'public'
as $$
declare d movies.duels; them uuid; mine jsonb; theirs jsonb := null; tn int; both_k jsonb; c text;
begin
  select * into d from movies.duels where id = p_id;
  if not found or (d.from_user <> p_uid and d.to_user is distinct from p_uid) then return jsonb_build_object('status','gone'); end if;
  them := case when d.from_user = p_uid then d.to_user else d.from_user end;
  select coalesce(jsonb_agg(jsonb_build_object('f', film, 'k', keep) order by at), '[]'::jsonb) into mine
    from movies.duel_swipes where duel_id = d.id and user_id = p_uid;
  select count(*) into tn from movies.duel_swipes where duel_id = d.id and user_id = them;
  select coalesce(jsonb_agg(a.film order by greatest(a.at, b.at)), '[]'::jsonb) into both_k
    from movies.duel_swipes a join movies.duel_swipes b on b.duel_id = a.duel_id and b.film = a.film and b.user_id = them and b.keep
    where a.duel_id = d.id and a.user_id = p_uid and a.keep;
  if d.status in ('nomatch','settled') then
    select coalesce(jsonb_agg(film order by at), '[]'::jsonb) into theirs from movies.duel_swipes where duel_id = d.id and user_id = them and keep;
  end if;
  select code into c from movies.invites where duel_id = d.id and expires_at > now() limit 1;
  return jsonb_build_object('status','ok','id',d.id,'state',d.status,'me',case when d.from_user = p_uid then 1 else 2 end,
    'friend',movies.who(them),'vibe',d.vibe,'deck',d.deck,'mine',mine,'their_n',tn,'both',both_k,'theirs',theirs,
    'match',d.match,'code',c,'created_at',d.created_at);
end $$;

-- ---------- invite links ----------
-- Your friend link (reused while it's live, so a group chat can share one).
create or replace function public.friend_invite()
returns jsonb language plpgsql security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid(); c text;
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  select code into c from movies.invites where from_user = uid and duel_id is null and expires_at > now() + interval '2 days' order by created_at desc limit 1;
  if c is null then
    if (select count(*) from movies.invites where from_user = uid and created_at > now() - interval '1 day') >= 30 then return jsonb_build_object('status','slow'); end if;
    c := movies.new_code();
    insert into movies.invites(code, from_user) values (c, uid);
  end if;
  return jsonb_build_object('status','ok','code',c);
end $$;

-- What a link is, before anyone signs in: who sent it and whether it's a duel. Guests can call this.
create or replace function public.invite_peek(p_code text)
returns jsonb language plpgsql stable security definer
set search_path to 'movies', 'public'
as $$
declare i movies.invites; d movies.duels;
begin
  if p_code is null or upper(p_code) !~ '^[A-Z2-9]{8}$' then return jsonb_build_object('status','bad'); end if;
  select * into i from movies.invites where code = upper(p_code);
  if not found then return jsonb_build_object('status','gone'); end if;
  if i.expires_at < now() then return jsonb_build_object('status','expired'); end if;
  if i.duel_id is not null then select * into d from movies.duels where id = i.duel_id; end if;
  return jsonb_build_object('status','ok','from',(movies.who(i.from_user)->>'name'),'duel',i.duel_id is not null,
    'vibe',d.vibe,'n',case when d.id is null then null else jsonb_array_length(d.deck) end,'taken',d.to_user is not null);
end $$;

-- Open a link while signed in: you're friends, and a duel link hands you the duel (one person only).
create or replace function public.invite_accept(p_code text)
returns jsonb language plpgsql security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid(); i movies.invites; d movies.duels; fresh boolean; dl uuid := null; tk boolean := false;
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  if p_code is null or upper(p_code) !~ '^[A-Z2-9]{8}$' then return jsonb_build_object('status','bad'); end if;
  select * into i from movies.invites where code = upper(p_code) for update;
  if not found then return jsonb_build_object('status','gone'); end if;
  if i.expires_at < now() then return jsonb_build_object('status','expired'); end if;
  if i.from_user = uid then return jsonb_build_object('status','self','duel',i.duel_id); end if;
  if movies.blocked(uid, i.from_user) then return jsonb_build_object('status','gone'); end if;
  fresh := movies.make_friends(uid, i.from_user);
  if fresh then perform movies.notify(i.from_user, 'friend_joined', uid, null, null); end if;
  update movies.invites set uses = uses + 1 where code = i.code;
  if i.duel_id is not null then
    select * into d from movies.duels where id = i.duel_id for update;
    if found and d.status <> 'closed' then
      if d.to_user is null then
        update movies.duels set to_user = uid, last_move_at = now() where id = d.id;
        delete from movies.invites where code = i.code;   -- a duel link is one person's
        dl := d.id;
      elsif d.to_user = uid then dl := d.id;
      else tk := true;
      end if;
    else tk := true;
    end if;
  end if;
  return jsonb_build_object('status','ok','friend',movies.who(i.from_user),'new',fresh,'duel',dl,'taken',tk);
end $$;

-- ---------- friends ----------
-- Add someone by the number on their member card. They get a request to accept; no names are given away.
create or replace function public.friend_request_by_no(p_no text)
returns jsonb language plpgsql security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid(); them uuid; n text := regexp_replace(coalesce(p_no,''), '\D', '', 'g');
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  if n !~ '^[0-9]{6}$' then return jsonb_build_object('status','bad'); end if;
  if (select count(*) from movies.friend_requests where from_user = uid and created_at > now() - interval '1 day') >= 20 then return jsonb_build_object('status','slow'); end if;
  select user_id into them from movies.members where no = n and user_id is not null;
  if them is null or movies.blocked(uid, them) then return jsonb_build_object('status','notfound'); end if;
  if them = uid then return jsonb_build_object('status','self'); end if;
  if movies.are_friends(uid, them) then return jsonb_build_object('status','already','friend',movies.who(them)); end if;
  -- they already asked you: that's a yes both ways
  if exists (select 1 from movies.friend_requests where from_user = them and to_user = uid) then
    perform movies.make_friends(uid, them);
    perform movies.notify(them, 'friend_accepted', uid, null, null);
    return jsonb_build_object('status','friends','friend',movies.who(them));
  end if;
  insert into movies.friend_requests(from_user, to_user) values (uid, them) on conflict do nothing;
  perform movies.notify(them, 'friend_request', uid, null, null);
  return jsonb_build_object('status','sent');
end $$;

create or replace function public.friend_respond(p_from uuid, p_accept boolean)
returns jsonb language plpgsql security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  if not exists (select 1 from movies.friend_requests where from_user = p_from and to_user = uid) then return jsonb_build_object('status','gone'); end if;
  if p_accept then
    perform movies.make_friends(uid, p_from);
    perform movies.notify(p_from, 'friend_accepted', uid, null, null);
  else
    delete from movies.friend_requests where from_user = p_from and to_user = uid;
  end if;
  update movies.inbox set read_at = now() where user_id = uid and kind = 'friend_request' and from_user = p_from and read_at is null;
  return jsonb_build_object('status','ok');
end $$;

-- Remove a friend (or take back a request). Open duels between you close.
create or replace function public.friend_remove(p_friend uuid)
returns jsonb language plpgsql security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  delete from movies.friends where (user_id = uid and friend_id = p_friend) or (user_id = p_friend and friend_id = uid);
  delete from movies.friend_requests where (from_user = uid and to_user = p_friend) or (from_user = p_friend and to_user = uid);
  update movies.duels set status = 'closed' where status in ('open','nomatch')
    and ((from_user = uid and to_user = p_friend) or (from_user = p_friend and to_user = uid));
  return jsonb_build_object('status','ok');
end $$;

-- Block: removes them, hides what they sent you, and stops requests, links and duels both ways.
create or replace function public.friend_block(p_user uuid)
returns jsonb language plpgsql security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  if p_user is null or p_user = uid then return jsonb_build_object('status','bad'); end if;
  perform public.friend_remove(p_user);
  insert into movies.blocks(user_id, blocked_id) values (uid, p_user) on conflict do nothing;
  delete from movies.inbox where user_id = uid and from_user = p_user;
  return jsonb_build_object('status','ok');
end $$;

create or replace function public.friends_list()
returns jsonb language plpgsql stable security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid(); f jsonb; inc jsonb; outg jsonb;
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  select coalesce(jsonb_agg(movies.who(friend_id) || jsonb_build_object('since', created_at, 'streak', movies.streak(uid, friend_id))
    order by lower(movies.who(friend_id)->>'name')), '[]'::jsonb) into f from movies.friends where user_id = uid;
  select coalesce(jsonb_agg(movies.who(from_user) || jsonb_build_object('at', created_at) order by created_at desc), '[]'::jsonb) into inc
    from movies.friend_requests where to_user = uid;
  select coalesce(jsonb_agg(movies.who(to_user) || jsonb_build_object('at', created_at) order by created_at desc), '[]'::jsonb) into outg
    from movies.friend_requests where from_user = uid;
  return jsonb_build_object('status','ok','friends',f,'incoming',inc,'outgoing',outg);
end $$;

-- ---------- Dinner Duel ----------
-- Start a duel with a friend, or (no friend given) one that goes out as a link.
create or replace function public.duel_create(p_friend uuid, p_vibe text, p_deck jsonb)
returns jsonb language plpgsql security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid(); nid uuid; c text := null;
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  if p_deck is null or jsonb_typeof(p_deck) <> 'array' or jsonb_array_length(p_deck) not between 1 and 30
     or exists (select 1 from jsonb_array_elements(p_deck) e where jsonb_typeof(e) <> 'string' or length(e #>> '{}') > 160)
     or (select count(distinct e) from jsonb_array_elements_text(p_deck) e) <> jsonb_array_length(p_deck)
  then return jsonb_build_object('status','bad'); end if;
  if (select count(*) from movies.duels where from_user = uid and created_at > now() - interval '1 day') >= 20 then return jsonb_build_object('status','slow'); end if;
  if p_friend is not null then
    if not movies.are_friends(uid, p_friend) or movies.blocked(uid, p_friend) then return jsonb_build_object('status','notfriends'); end if;
    if (select count(*) from movies.duels where status in ('open','nomatch')
        and ((from_user = uid and to_user = p_friend) or (from_user = p_friend and to_user = uid))) >= 3
    then return jsonb_build_object('status','toomany'); end if;
  end if;
  insert into movies.duels(from_user, to_user, vibe, deck) values (uid, p_friend, left(coalesce(nullif(p_vibe,''),'any'), 40), p_deck) returning id into nid;
  if p_friend is null then
    c := movies.new_code();
    insert into movies.invites(code, from_user, duel_id) values (c, uid, nid);
  end if;
  return movies.duel_view(nid, uid);
end $$;

create or replace function public.duel_state(p_id uuid)
returns jsonb language plpgsql stable security definer
set search_path to 'movies', 'public'
as $$
begin
  if auth.uid() is null then return jsonb_build_object('status','signedout'); end if;
  return movies.duel_view(p_id, auth.uid());
end $$;

-- One swipe. The first film you both keep is the match; when both decks run out with no match, it's a tie-breaker.
create or replace function public.duel_swipe(p_id uuid, p_film text, p_keep boolean)
returns jsonb language plpgsql security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid(); d movies.duels; them uuid; n int; done_now boolean;
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  select * into d from movies.duels where id = p_id for update;
  if not found or (d.from_user <> uid and d.to_user is distinct from uid) then return jsonb_build_object('status','gone'); end if;
  if d.status not in ('open','matched') then return movies.duel_view(p_id, uid); end if;
  if p_film is null or not (d.deck ? p_film) then return jsonb_build_object('status','bad'); end if;
  insert into movies.duel_swipes(duel_id, user_id, film, keep) values (d.id, uid, p_film, coalesce(p_keep, false))
    on conflict (duel_id, user_id, film) do update set keep = excluded.keep, at = now();
  them := case when d.from_user = uid then d.to_user else d.from_user end;
  select count(*) into n from movies.duel_swipes where duel_id = d.id and user_id = uid;
  done_now := n >= jsonb_array_length(d.deck);
  if d.from_user = uid then
    -- the sender finishing their 20 is what lands the duel in the friend's inbox
    if done_now and not d.from_done then perform movies.notify(d.to_user, 'duel_new', uid, d.id, d.deck ->> 0); end if;
    update movies.duels set from_done = done_now, last_move_at = now() where id = d.id;
  else
    update movies.duels set to_done = done_now, last_move_at = now() where id = d.id;
  end if;
  if p_keep and d.match is null and them is not null
     and exists (select 1 from movies.duel_swipes where duel_id = d.id and user_id = them and film = p_film and keep) then
    update movies.duels set status = 'matched', match = p_film where id = d.id;
    perform movies.notify(them, 'duel_match', uid, d.id, p_film);
  end if;
  select * into d from movies.duels where id = p_id;
  if d.status = 'open' and d.from_done and d.to_done and d.match is null then
    update movies.duels set status = 'nomatch' where id = d.id;
    perform movies.notify(them, 'duel_nomatch', uid, d.id, null);
  end if;
  return movies.duel_view(p_id, uid);
end $$;

-- Take back the last card (only while the duel is still open: a match is a match).
create or replace function public.duel_unswipe(p_id uuid, p_film text)
returns jsonb language plpgsql security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid(); d movies.duels;
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  select * into d from movies.duels where id = p_id for update;
  if not found or (d.from_user <> uid and d.to_user is distinct from uid) then return jsonb_build_object('status','gone'); end if;
  if d.status = 'open' then
    delete from movies.duel_swipes where duel_id = d.id and user_id = uid and film = p_film;
    if d.from_user = uid then update movies.duels set from_done = false, last_move_at = now() where id = d.id;
    else update movies.duels set to_done = false, last_move_at = now() where id = d.id; end if;
  end if;
  return movies.duel_view(p_id, uid);
end $$;

-- No match: the tie-breaker spin. The database picks from both people's keeps so both phones land on the same film.
create or replace function public.duel_settle(p_id uuid)
returns jsonb language plpgsql security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid(); d movies.duels; w text; them uuid;
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  select * into d from movies.duels where id = p_id for update;
  if not found or (d.from_user <> uid and d.to_user is distinct from uid) then return jsonb_build_object('status','gone'); end if;
  if d.status = 'nomatch' then
    select film into w from (select distinct film from movies.duel_swipes where duel_id = d.id and keep) k order by random() limit 1;
    if w is null then
      update movies.duels set status = 'closed' where id = d.id;
      return jsonb_build_object('status','empty');
    end if;
    update movies.duels set status = 'settled', match = w, last_move_at = now() where id = d.id;
    them := case when d.from_user = uid then d.to_user else d.from_user end;
    perform movies.notify(them, 'duel_settled', uid, d.id, w);
  end if;
  return movies.duel_view(p_id, uid);
end $$;

-- Take a duel off your board (closes it for both).
create or replace function public.duel_close(p_id uuid)
returns jsonb language plpgsql security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  update movies.duels set status = 'closed' where id = p_id and (from_user = uid or to_user = uid);
  delete from movies.invites where duel_id = p_id and from_user = uid;
  return jsonb_build_object('status','ok');
end $$;

-- The Now Showing board: every live duel, whose turn it is, and the score.
create or replace function public.duels_list()
returns jsonb language plpgsql stable security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid(); r jsonb;
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  select coalesce(jsonb_agg(x.j order by x.at desc), '[]'::jsonb) into r from (
    select d.last_move_at as at, jsonb_build_object(
      'id', d.id, 'state', d.status, 'me', case when d.from_user = uid then 1 else 2 end,
      'friend', movies.who(case when d.from_user = uid then d.to_user else d.from_user end),
      'vibe', d.vibe, 'n', jsonb_array_length(d.deck), 'mine', m.n, 'their_n', t.n, 'match', d.match,
      'code', (select code from movies.invites i where i.duel_id = d.id and i.expires_at > now() limit 1),
      'turn', case when d.status in ('matched','settled') then 'done' when d.status = 'nomatch' then 'decide'
                   when m.n < jsonb_array_length(d.deck) then 'you' else 'them' end,
      'at', d.last_move_at) as j
    from movies.duels d
    cross join lateral (select count(*)::int as n from movies.duel_swipes s where s.duel_id = d.id and s.user_id = uid) m
    cross join lateral (select count(*)::int as n from movies.duel_swipes s where s.duel_id = d.id and s.user_id <> uid) t
    where (d.from_user = uid or d.to_user = uid) and d.status <> 'closed' and d.last_move_at > now() - interval '30 days'
    order by d.last_move_at desc limit 40
  ) x;
  return jsonb_build_object('status','ok','duels',r);
end $$;

-- ---------- the inbox ----------
create or replace function public.inbox_list()
returns jsonb language plpgsql stable security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid(); r jsonb;
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  select coalesce(jsonb_agg(jsonb_build_object('id', id, 'kind', kind, 'from', movies.who(from_user), 'duel', duel_id, 'film', film,
    'at', created_at, 'read', read_at is not null) order by id desc), '[]'::jsonb) into r
  from (select * from movies.inbox where user_id = uid order by id desc limit 50) i;
  return jsonb_build_object('status','ok','items',r);
end $$;

-- The bell: unread lines, and duels waiting on you.
create or replace function public.inbox_unread()
returns jsonb language plpgsql stable security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  return jsonb_build_object('status','ok',
    'unread', (select count(*) from movies.inbox where user_id = uid and read_at is null),
    'turns', (select count(*) from movies.duels d where (d.from_user = uid or d.to_user = uid) and d.to_user is not null
      and (d.status = 'nomatch' or (d.status = 'open' and (select count(*) from movies.duel_swipes s where s.duel_id = d.id and s.user_id = uid) < jsonb_array_length(d.deck)))));
end $$;

create or replace function public.inbox_read(p_ids bigint[])
returns jsonb language plpgsql security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  update movies.inbox set read_at = now() where user_id = uid and read_at is null and (p_ids is null or id = any(p_ids));
  return jsonb_build_object('status','ok');
end $$;

-- ---------- alert settings ----------
create or replace function public.alert_prefs_get()
returns jsonb language plpgsql stable security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid(); p movies.alert_prefs;
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  select * into p from movies.alert_prefs where user_id = uid;
  return jsonb_build_object('status','ok','email',coalesce(p.email_on, true),'digest',coalesce(p.digest, true),'late_fees',coalesce(p.late_fees, true));
end $$;

create or replace function public.alert_prefs_set(p_email boolean, p_digest boolean, p_late_fees boolean)
returns jsonb language plpgsql security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  insert into movies.alert_prefs(user_id, email_on, digest, late_fees) values (uid, coalesce(p_email, true), coalesce(p_digest, true), coalesce(p_late_fees, true))
    on conflict (user_id) do update set email_on = excluded.email_on, digest = excluded.digest, late_fees = excluded.late_fees;
  return public.alert_prefs_get();
end $$;

-- ---------- late fees and tidying (pg_cron, hourly) ----------
-- A friend sits on your duel for two days: one joke late fee from Galaxy Video, per duel, never more.
create or replace function movies.late_fee_sweep()
returns int language plpgsql security definer
set search_path to 'movies', 'public'
as $$
declare r record; n int := 0;
begin
  for r in
    select d.id, d.deck ->> 0 as film,
      case when d.from_done then d.to_user else d.from_user end as owe,
      case when d.from_done then d.from_user else d.to_user end as owed
    from movies.duels d
    where d.status = 'open' and d.to_user is not null and d.nudged_at is null and d.from_done <> d.to_done
      and d.last_move_at < now() - interval '2 days'
    for update skip locked
  loop
    if coalesce((select late_fees from movies.alert_prefs where user_id = r.owe), true) then
      perform movies.notify(r.owe, 'late_fee', r.owed, r.id, r.film); n := n + 1;
    end if;
    update movies.duels set nudged_at = now() where id = r.id;
  end loop;
  -- tidy: duels nobody touched for 30 days, link duels nobody opened in 14, old links, old read inbox lines
  update movies.duels set status = 'closed' where status in ('open','nomatch') and last_move_at < now() - interval '30 days';
  update movies.duels set status = 'closed' where status = 'open' and to_user is null and created_at < now() - interval '14 days';
  delete from movies.invites where expires_at < now();
  delete from movies.inbox where read_at is not null and read_at < now() - interval '90 days';
  delete from movies.duels where status = 'closed' and last_move_at < now() - interval '60 days';
  return n;
end $$;

-- ---------- for the rd-alerts email function only (service role) ----------
-- People with something worth an email: unread for 10 minutes (they may have seen it on the site), not in
-- quiet hours (9pm to 8am Brisbane time), emails switched on, and no more than one email a day each.
create or replace function public.alerts_due(p_limit int)
returns jsonb language sql stable security definer
set search_path to 'movies', 'public'
as $$
  select coalesce(jsonb_agg(s), '[]'::jsonb) from (
    select u.id, u.email, movies.who(u.id) ->> 'name' as name, max(i.id) as maxid,
      jsonb_agg(jsonb_build_object('kind', i.kind, 'from', movies.who(i.from_user) ->> 'name', 'film', i.film, 'duel', i.duel_id) order by i.id) as items
    from movies.inbox i
    join auth.users u on u.id = i.user_id
    left join movies.alert_prefs p on p.user_id = i.user_id
    where i.emailed_at is null and i.read_at is null
      and i.kind in ('duel_new','late_fee','friend_request','duel_match')
      and i.created_at between now() - interval '3 days' and now() - interval '10 minutes'
      and coalesce(p.email_on, true)
      and (p.last_email_at is null or p.last_email_at < now() - interval '20 hours')
      and extract(hour from now() at time zone 'Australia/Brisbane') between 8 and 20
      and u.email is not null and u.email <> ''
    group by u.id, u.email
    limit greatest(1, least(coalesce(p_limit, 50), 200))
  ) s
$$;

create or replace function public.alerts_mark(p_user uuid, p_maxid bigint)
returns void language sql security definer
set search_path to 'movies', 'public'
as $$
  update movies.inbox set emailed_at = now() where user_id = p_user and id <= p_maxid and emailed_at is null;
  insert into movies.alert_prefs(user_id, last_email_at) values (p_user, now())
    on conflict (user_id) do update set last_email_at = now();
$$;

-- Monday digest: only to people somebody is actually waiting on.
create or replace function public.alerts_digest_due(p_limit int)
returns jsonb language sql stable security definer
set search_path to 'movies', 'public'
as $$
  select coalesce(jsonb_agg(s), '[]'::jsonb) from (
    select u.id, u.email, movies.who(u.id) ->> 'name' as name,
      jsonb_agg(jsonb_build_object('from', movies.who(case when d.from_user = u.id then d.to_user else d.from_user end) ->> 'name',
        'state', d.status, 'film', d.deck ->> 0)) as waiting
    from auth.users u
    join movies.duels d on (d.from_user = u.id or d.to_user = u.id) and d.to_user is not null
    left join movies.alert_prefs p on p.user_id = u.id
    where coalesce(p.digest, true)
      and (p.last_digest_at is null or p.last_digest_at < now() - interval '6 days')
      and extract(isodow from now() at time zone 'Australia/Brisbane') = 1
      and extract(hour from now() at time zone 'Australia/Brisbane') between 9 and 20
      and u.email is not null and u.email <> ''
      and (d.status = 'nomatch' or (d.status = 'open'
        and (case when d.from_user = u.id then d.to_done else d.from_done end)
        and (select count(*) from movies.duel_swipes s where s.duel_id = d.id and s.user_id = u.id) < jsonb_array_length(d.deck)))
    group by u.id, u.email
    limit greatest(1, least(coalesce(p_limit, 50), 200))
  ) s
$$;

create or replace function public.alerts_digest_mark(p_user uuid)
returns void language sql security definer
set search_path to 'movies', 'public'
as $$
  insert into movies.alert_prefs(user_id, last_digest_at) values (p_user, now())
    on conflict (user_id) do update set last_digest_at = now();
$$;

-- The unsubscribe link in every email (the function checks its signature first).
create or replace function public.alerts_unsub(p_user uuid, p_what text)
returns void language sql security definer
set search_path to 'movies', 'public'
as $$
  insert into movies.alert_prefs(user_id, email_on, digest) values (p_user, p_what <> 'all', p_what not in ('all','digest'))
    on conflict (user_id) do update set
      email_on = case when p_what = 'all' then false else movies.alert_prefs.email_on end,
      digest = case when p_what in ('all','digest') then false else movies.alert_prefs.digest end;
$$;

-- ---------- who can call what ----------
do $$
declare f text;
begin
  foreach f in array array[
    'public.friend_invite()', 'public.invite_accept(text)', 'public.friend_request_by_no(text)', 'public.friend_respond(uuid, boolean)',
    'public.friend_remove(uuid)', 'public.friend_block(uuid)', 'public.friends_list()',
    'public.duel_create(uuid, text, jsonb)', 'public.duel_state(uuid)', 'public.duel_swipe(uuid, text, boolean)', 'public.duel_unswipe(uuid, text)',
    'public.duel_settle(uuid)', 'public.duel_close(uuid)', 'public.duels_list()',
    'public.inbox_list()', 'public.inbox_unread()', 'public.inbox_read(bigint[])', 'public.alert_prefs_get()', 'public.alert_prefs_set(boolean, boolean, boolean)']
  loop
    execute format('revoke all on function %s from public, anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
  foreach f in array array['public.alerts_due(int)', 'public.alerts_mark(uuid, bigint)', 'public.alerts_digest_due(int)', 'public.alerts_digest_mark(uuid)', 'public.alerts_unsub(uuid, text)']
  loop
    execute format('revoke all on function %s from public, anon, authenticated', f);
    execute format('grant execute on function %s to service_role', f);
  end loop;
  foreach f in array array['movies.who(uuid)', 'movies.blocked(uuid, uuid)', 'movies.are_friends(uuid, uuid)', 'movies.make_friends(uuid, uuid)',
    'movies.notify(uuid, text, uuid, uuid, text)', 'movies.new_code()', 'movies.streak(uuid, uuid)', 'movies.duel_view(uuid, uuid)', 'movies.late_fee_sweep()']
  loop
    execute format('revoke all on function %s from public, anon, authenticated', f);
  end loop;
end $$;
revoke all on function public.invite_peek(text) from public;
grant execute on function public.invite_peek(text) to anon, authenticated;

-- hourly late fee check and tidy (at :41, clear of the Match night cleanup at :17)
select cron.schedule('rd-late-fees', '41 * * * *', $$select movies.late_fee_sweep()$$);
