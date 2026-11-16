-- Final Cut for Match night, Reel Dinner Supabase project (zpcgxupmclkxbzikdnfb). Apply as migration final_cut.
-- Both people swipe the deck; every film both keep makes the shortlist; then rounds of just the shortlist until one
-- film is left. A round that knocks out everything (or nothing) sends the last films head to head, this or that,
-- winner stays on. Head to head picks are stored as swipes in round 100 + step (keep = true on the film picked).
-- When the two pick differently, whose pick goes through takes turns, player one (the sender) first.
-- The page runs the same rules (RDFinalCut.replay in match.js), so a reload or a second phone rebuilds the same night.
-- Safe with the page that's live now: every changed function keeps its old arguments working (new ones have defaults).

-- ---------- room codes (guests) ----------
alter table public.match_rooms add column if not exists final boolean not null default false;
alter table public.match_swipes add column if not exists round smallint not null default 1;
alter table public.match_swipes drop constraint if exists match_swipes_pkey;
alter table public.match_swipes add constraint match_swipes_pkey primary key (code, player, round, film);
alter table public.match_swipes drop constraint if exists match_swipes_round_check;
alter table public.match_swipes add constraint match_swipes_round_check check (round between 1 and 60 or round between 101 and 160);

drop function if exists public.match_create(text, jsonb);
create or replace function public.match_create(p_vibe text, p_deck jsonb, p_final boolean default false)
returns text language plpgsql security definer set search_path = '' as $$
declare c text; abc text := 'ABCDEFGHJKMNPQRSTUVWXYZ'; i int; tries int := 0;
begin
  delete from public.match_rooms where created_at < now() - interval '12 hours';
  if jsonb_typeof(p_deck) <> 'array' or jsonb_array_length(p_deck) < 1 or jsonb_array_length(p_deck) > 20 then raise exception 'bad deck'; end if;
  if exists (select 1 from jsonb_array_elements(p_deck) e where jsonb_typeof(e) <> 'string' or length(e #>> '{}') > 160) then raise exception 'bad deck'; end if;
  loop
    c := '';
    for i in 1..4 loop c := c || substr(abc, 1 + floor(random() * length(abc))::int, 1); end loop;
    begin
      insert into public.match_rooms(code, vibe, deck, final) values (c, left(coalesce(p_vibe,''), 40), p_deck, coalesce(p_final, false));
      return c;
    exception when unique_violation then
      tries := tries + 1; if tries > 20 then raise exception 'no code'; end if;
    end;
  end loop;
end $$;

create or replace function public.match_join(p_code text, p_dev text default null)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare r public.match_rooms;
begin
  select * into r from public.match_rooms where code = upper(p_code) and created_at > now() - interval '12 hours';
  if not found then return null; end if;
  if r.players >= 2 and r.joiner is not null and (p_dev is null or p_dev <> r.joiner) then
    return jsonb_build_object('full', true);
  end if;
  update public.match_rooms set players = 2, joiner = coalesce(joiner, left(p_dev, 40)) where code = r.code;
  return jsonb_build_object('vibe', r.vibe, 'deck', r.deck, 'final', r.final);
end $$;

drop function if exists public.match_swipe(text, integer, text, boolean);
create or replace function public.match_swipe(p_code text, p_player integer, p_film text, p_keep boolean, p_round integer default 1)
returns boolean language plpgsql security definer set search_path = '' as $$
declare rd int := coalesce(p_round, 1);
begin
  if p_player not in (1,2) or not (rd between 1 and 60 or rd between 101 and 160) then return false; end if;
  if not exists (select 1 from public.match_rooms where code = upper(p_code) and created_at > now() - interval '12 hours' and deck ? p_film) then return false; end if;
  -- one head to head pick per person per step
  if rd > 100 then delete from public.match_swipes where code = upper(p_code) and player = p_player and round = rd and film <> p_film; end if;
  insert into public.match_swipes(code, player, round, film, keep) values (upper(p_code), p_player, rd, p_film, p_keep)
  on conflict (code, player, round, film) do update set keep = excluded.keep, at = now();
  return true;
end $$;

drop function if exists public.match_unswipe(text, integer, text);
create or replace function public.match_unswipe(p_code text, p_player integer, p_film text, p_round integer default 1)
returns boolean language sql security definer set search_path = '' as $$
  delete from public.match_swipes where code = upper(p_code) and player = p_player and film = p_film and round = coalesce(p_round, 1) returning true;
$$;

create or replace function public.match_state(p_code text)
returns jsonb language sql stable security definer set search_path = '' as $$
  select case when r.code is null then null else jsonb_build_object(
    'players', r.players,
    'picks', r.picks,
    'final', r.final,
    'swipes', coalesce((select jsonb_agg(jsonb_build_object('p', s.player, 'f', s.film, 'k', s.keep, 'r', s.round) order by s.at) from public.match_swipes s where s.code = r.code), '[]'::jsonb)
  ) end
  from (select 1) x left join public.match_rooms r on r.code = upper(p_code) and r.created_at > now() - interval '12 hours';
$$;

grant execute on function public.match_create(text, jsonb, boolean), public.match_swipe(text, integer, text, boolean, integer),
  public.match_unswipe(text, integer, text, integer) to anon, authenticated;

-- ---------- Dinner Duel (members) ----------
alter table movies.duels add column if not exists final boolean not null default false;
alter table movies.duel_swipes add column if not exists round smallint not null default 1;
alter table movies.duel_swipes drop constraint if exists duel_swipes_pkey;
alter table movies.duel_swipes add constraint duel_swipes_pkey primary key (duel_id, user_id, round, film);
alter table movies.duel_swipes drop constraint if exists duel_swipes_round_check;
alter table movies.duel_swipes add constraint duel_swipes_round_check check (round between 1 and 60 or round between 101 and 160);
-- quiet: a "your turn" line that stays off email (only the first "your turn" each day goes by email)
alter table movies.inbox add column if not exists quiet boolean not null default false;
alter table movies.inbox drop constraint if exists inbox_kind_check;
alter table movies.inbox add constraint inbox_kind_check check (kind in ('friend_joined','friend_request','friend_accepted','duel_new','duel_match','duel_nomatch','duel_settled','late_fee','quiz_new','quiz_done','duel_turn'));

-- Where a Final Cut duel stands. Player 1 is the sender, player 2 the friend. Same rules as RDFinalCut.replay.
create or replace function movies.fc_replay(p_id uuid)
returns jsonb language plpgsql stable security definer set search_path = 'movies', 'public' as $$
declare d movies.duels; cur jsonb; surv jsonb; lst jsonb; r int := 1; n int; k int; a1 int; a2 int;
  champ text; a text; b text; w text; splits int := 0; i int; why text;
begin
  select * into d from movies.duels where id = p_id;
  if not found then return null; end if;
  cur := d.deck;
  loop
    n := jsonb_array_length(cur);
    select count(*) into a1 from movies.duel_swipes s where s.duel_id = d.id and s.user_id = d.from_user and s.round = r and cur ? s.film;
    select count(*) into a2 from movies.duel_swipes s where s.duel_id = d.id and s.user_id = d.to_user and s.round = r and cur ? s.film;
    if a1 < n or a2 < n then
      return jsonb_build_object('phase','swipe','round',r,'deck',cur,'done1',a1 >= n,'done2',a2 >= n);
    end if;
    select coalesce(jsonb_agg(e.f order by e.o), '[]'::jsonb) into surv from jsonb_array_elements_text(cur) with ordinality e(f, o)
      where exists (select 1 from movies.duel_swipes s where s.duel_id = d.id and s.user_id = d.from_user and s.round = r and s.film = e.f and s.keep)
        and exists (select 1 from movies.duel_swipes s where s.duel_id = d.id and s.user_id = d.to_user and s.round = r and s.film = e.f and s.keep);
    k := jsonb_array_length(surv);
    if r = 1 and k = 0 then return jsonb_build_object('phase','none','round',1); end if;
    if k = 1 then return jsonb_build_object('phase','win','film',surv ->> 0,'round',r); end if;
    if (r > 1 and (k = 0 or k = n)) or r >= 60 then
      lst := case when k = 0 then cur else surv end; why := case when k = 0 then 'wiped' else 'stuck' end;
      exit;
    end if;
    cur := surv; r := r + 1;
  end loop;
  champ := lst ->> 0;
  for i in 1 .. jsonb_array_length(lst) - 1 loop
    select film into a from movies.duel_swipes s where s.duel_id = d.id and s.user_id = d.from_user and s.round = 100 + i and s.keep and s.film in (champ, lst ->> i) limit 1;
    select film into b from movies.duel_swipes s where s.duel_id = d.id and s.user_id = d.to_user and s.round = 100 + i and s.keep and s.film in (champ, lst ->> i) limit 1;
    if a is null or b is null then
      return jsonb_build_object('phase','h2h','round',r,'why',why,'list',lst,'step',i,'pair',jsonb_build_array(champ, lst ->> i),'done1',a is not null,'done2',b is not null);
    end if;
    if a <> b then w := case when splits % 2 = 0 then a else b end; splits := splits + 1; else w := a; end if;
    champ := w;
  end loop;
  return jsonb_build_object('phase','win','film',champ,'round',r,'why',why);
end $$;

-- A "your turn" line. Only the first one each day (Brisbane) can go out by email; later ones that day are quiet.
create or replace function movies.notify_turn(p_to uuid, p_from uuid, p_duel uuid)
returns void language plpgsql security definer set search_path = 'movies', 'public' as $$
declare q boolean;
begin
  if p_to is null or p_to = p_from then return; end if;
  if p_from is not null and movies.blocked(p_to, p_from) then return; end if;
  if exists (select 1 from movies.inbox where user_id = p_to and kind = 'duel_turn' and duel_id = p_duel and read_at is null) then return; end if;
  q := exists (select 1 from movies.inbox where user_id = p_to and kind = 'duel_turn'
    and (created_at at time zone 'Australia/Brisbane')::date = (now() at time zone 'Australia/Brisbane')::date);
  insert into movies.inbox(user_id, kind, from_user, duel_id, quiet) values (p_to, 'duel_turn', p_from, p_duel, q);
end $$;

-- The whole duel as one person sees it. Their keeps stay hidden for the round (or head to head step) they're on.
create or replace function movies.duel_view(p_id uuid, p_uid uuid)
returns jsonb language plpgsql stable security definer set search_path = 'movies', 'public' as $$
declare d movies.duels; them uuid; mine jsonb; theirs jsonb := null; tn int; both_k jsonb; c text; st jsonb := null; tsw jsonb := null; fc jsonb := null; me int;
begin
  select * into d from movies.duels where id = p_id;
  if not found or (d.from_user <> p_uid and d.to_user is distinct from p_uid) then return jsonb_build_object('status','gone'); end if;
  them := case when d.from_user = p_uid then d.to_user else d.from_user end;
  me := case when d.from_user = p_uid then 1 else 2 end;
  select coalesce(jsonb_agg(jsonb_build_object('f', film, 'k', keep, 'r', round) order by at), '[]'::jsonb) into mine
    from movies.duel_swipes where duel_id = d.id and user_id = p_uid;
  select count(*) into tn from movies.duel_swipes where duel_id = d.id and user_id = them and round = 1;
  if d.final then
    both_k := '[]'::jsonb;
    st := movies.fc_replay(d.id);
    select coalesce(jsonb_agg(jsonb_build_object('f', film, 'k', keep, 'r', round) order by at), '[]'::jsonb) into tsw
      from movies.duel_swipes where duel_id = d.id and user_id = them
        and (st ->> 'phase' in ('win','none')
          or (st ->> 'phase' = 'swipe' and round < (st ->> 'round')::int)
          or (st ->> 'phase' = 'h2h' and (round < 100 or round < 100 + (st ->> 'step')::int)));
    fc := jsonb_build_object('phase', st ->> 'phase', 'round', (st ->> 'round')::int, 'step', (st ->> 'step')::int,
      'their_done', coalesce((st ->> (case when me = 1 then 'done2' else 'done1' end))::boolean, false));
  else
    select coalesce(jsonb_agg(a.film order by greatest(a.at, b.at)), '[]'::jsonb) into both_k
      from movies.duel_swipes a join movies.duel_swipes b on b.duel_id = a.duel_id and b.film = a.film and b.round = a.round and b.user_id = them and b.keep
      where a.duel_id = d.id and a.user_id = p_uid and a.keep;
  end if;
  if d.status in ('nomatch','settled') then
    select coalesce(jsonb_agg(film order by at), '[]'::jsonb) into theirs from movies.duel_swipes where duel_id = d.id and user_id = them and keep and round = 1;
  end if;
  select code into c from movies.invites where duel_id = d.id and expires_at > now() limit 1;
  return jsonb_build_object('status','ok','id',d.id,'state',d.status,'me',me,
    'friend',movies.who(them),'vibe',d.vibe,'deck',d.deck,'mine',mine,'their_n',tn,'both',both_k,'theirs',theirs,
    'match',d.match,'code',c,'created_at',d.created_at,'final',d.final,'tsw',tsw,'fc',fc);
end $$;

drop function if exists public.duel_create(uuid, text, jsonb);
create or replace function public.duel_create(p_friend uuid, p_vibe text, p_deck jsonb, p_final boolean default false)
returns jsonb language plpgsql security definer set search_path = 'movies', 'public' as $$
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
  insert into movies.duels(from_user, to_user, vibe, deck, final) values (uid, p_friend, left(coalesce(nullif(p_vibe,''),'any'), 40), p_deck, coalesce(p_final, false)) returning id into nid;
  if p_friend is null then
    c := movies.new_code();
    insert into movies.invites(code, from_user, duel_id) values (c, uid, nid);
  end if;
  return movies.duel_view(nid, uid);
end $$;

drop function if exists public.duel_swipe(uuid, text, boolean);
create or replace function public.duel_swipe(p_id uuid, p_film text, p_keep boolean, p_round integer default 1)
returns jsonb language plpgsql security definer set search_path = 'movies', 'public' as $$
declare uid uuid := auth.uid(); d movies.duels; them uuid; n int; done_now boolean; rd int := coalesce(p_round, 1);
  st0 jsonb; st1 jsonb; r1_before int; r1_after int;
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  select * into d from movies.duels where id = p_id for update;
  if not found or (d.from_user <> uid and d.to_user is distinct from uid) then return jsonb_build_object('status','gone'); end if;
  if p_film is null or not (d.deck ? p_film) then return jsonb_build_object('status','bad'); end if;
  them := case when d.from_user = uid then d.to_user else d.from_user end;

  if d.final then
    if d.status <> 'open' then return movies.duel_view(p_id, uid); end if;
    st0 := movies.fc_replay(d.id);
    select count(*) into r1_before from movies.duel_swipes where duel_id = d.id and user_id = uid and round = 1;
    -- only the round (or head to head step) the duel is on, and only films in it
    if st0 ->> 'phase' = 'swipe' and rd = (st0 ->> 'round')::int and (st0 -> 'deck') ? p_film then
      insert into movies.duel_swipes(duel_id, user_id, round, film, keep) values (d.id, uid, rd, p_film, coalesce(p_keep, false))
        on conflict (duel_id, user_id, round, film) do update set keep = excluded.keep, at = now();
    elsif st0 ->> 'phase' = 'h2h' and rd = 100 + (st0 ->> 'step')::int and (st0 -> 'pair') ? p_film
      and not exists (select 1 from movies.duel_swipes where duel_id = d.id and user_id = uid and round = rd) then
      insert into movies.duel_swipes(duel_id, user_id, round, film, keep) values (d.id, uid, rd, p_film, true);
    else
      return movies.duel_view(p_id, uid);
    end if;
    st1 := movies.fc_replay(d.id);
    select count(*) into r1_after from movies.duel_swipes where duel_id = d.id and user_id = uid and round = 1;
    -- done flags mean "nothing to do right now": the board, the bell and late fees read them
    update movies.duels set
      from_done = case when st1 ->> 'phase' in ('swipe','h2h') then (st1 ->> 'done1')::boolean else true end,
      to_done = case when st1 ->> 'phase' in ('swipe','h2h') then (st1 ->> 'done2')::boolean else true end,
      last_move_at = now(),
      -- a new round is a fresh turn: it can earn its own late fee
      nudged_at = case when (st1 ->> 'phase', st1 ->> 'round', st1 ->> 'step') is distinct from (st0 ->> 'phase', st0 ->> 'round', st0 ->> 'step') then null else nudged_at end
      where id = d.id;
    -- the sender finishing round one is what lands the duel in the friend's inbox
    if d.from_user = uid and r1_before < jsonb_array_length(d.deck) and r1_after >= jsonb_array_length(d.deck) and st1 ->> 'phase' = 'swipe' and (st1 ->> 'round')::int = 1 then
      perform movies.notify(d.to_user, 'duel_new', uid, d.id, d.deck ->> 0);
    end if;
    if (st1 ->> 'phase', st1 ->> 'round', st1 ->> 'step') is distinct from (st0 ->> 'phase', st0 ->> 'round', st0 ->> 'step') then
      if st1 ->> 'phase' = 'win' then
        update movies.duels set status = 'matched', match = st1 ->> 'film' where id = d.id;
        perform movies.notify(them, 'duel_match', uid, d.id, st1 ->> 'film');
      elsif st1 ->> 'phase' = 'none' then
        update movies.duels set status = 'nomatch' where id = d.id;
        perform movies.notify(them, 'duel_nomatch', uid, d.id, null);
      else
        -- a new round or the next head to head pair: the one who just played sees it on screen, the other gets "your turn"
        update movies.inbox set read_at = now() where user_id = uid and kind in ('duel_turn','duel_new','late_fee') and duel_id = d.id and read_at is null;
        perform movies.notify_turn(them, uid, d.id);
      end if;
    end if;
    return movies.duel_view(p_id, uid);
  end if;

  if d.status not in ('open','matched') then return movies.duel_view(p_id, uid); end if;
  insert into movies.duel_swipes(duel_id, user_id, round, film, keep) values (d.id, uid, 1, p_film, coalesce(p_keep, false))
    on conflict (duel_id, user_id, round, film) do update set keep = excluded.keep, at = now();
  select count(*) into n from movies.duel_swipes where duel_id = d.id and user_id = uid and round = 1;
  done_now := n >= jsonb_array_length(d.deck);
  if d.from_user = uid then
    if done_now and not d.from_done then perform movies.notify(d.to_user, 'duel_new', uid, d.id, d.deck ->> 0); end if;
    update movies.duels set from_done = done_now, last_move_at = now() where id = d.id;
  else
    update movies.duels set to_done = done_now, last_move_at = now() where id = d.id;
  end if;
  if p_keep and d.match is null and them is not null
     and exists (select 1 from movies.duel_swipes where duel_id = d.id and user_id = them and round = 1 and film = p_film and keep) then
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

drop function if exists public.duel_unswipe(uuid, text);
create or replace function public.duel_unswipe(p_id uuid, p_film text, p_round integer default 1)
returns jsonb language plpgsql security definer set search_path = 'movies', 'public' as $$
declare uid uuid := auth.uid(); d movies.duels; st jsonb;
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  select * into d from movies.duels where id = p_id for update;
  if not found or (d.from_user <> uid and d.to_user is distinct from uid) then return jsonb_build_object('status','gone'); end if;
  if d.status = 'open' and d.final then
    -- only inside the round you're on: once you've both finished a round it's locked in
    st := movies.fc_replay(d.id);
    if st ->> 'phase' = 'swipe' and coalesce(p_round, 1) = (st ->> 'round')::int then
      delete from movies.duel_swipes where duel_id = d.id and user_id = uid and film = p_film and round = coalesce(p_round, 1);
      st := movies.fc_replay(d.id);
      update movies.duels set from_done = (st ->> 'done1')::boolean, to_done = (st ->> 'done2')::boolean, last_move_at = now() where id = d.id;
    end if;
  elsif d.status = 'open' then
    delete from movies.duel_swipes where duel_id = d.id and user_id = uid and film = p_film and round = 1;
    if d.from_user = uid then update movies.duels set from_done = false, last_move_at = now() where id = d.id;
    else update movies.duels set to_done = false, last_move_at = now() where id = d.id; end if;
  end if;
  return movies.duel_view(p_id, uid);
end $$;

-- No match in round one: the tie-breaker spin uses round one keeps.
create or replace function public.duel_settle(p_id uuid)
returns jsonb language plpgsql security definer set search_path = 'movies', 'public' as $$
declare uid uuid := auth.uid(); d movies.duels; w text; them uuid;
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  select * into d from movies.duels where id = p_id for update;
  if not found or (d.from_user <> uid and d.to_user is distinct from uid) then return jsonb_build_object('status','gone'); end if;
  if d.status = 'nomatch' then
    select film into w from (select distinct film from movies.duel_swipes where duel_id = d.id and keep and round = 1) k order by random() limit 1;
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

-- The Now Showing board. Final Cut duels go by the done flags and carry their round.
create or replace function public.duels_list()
returns jsonb language plpgsql stable security definer set search_path = 'movies', 'public' as $$
declare uid uuid := auth.uid(); r jsonb;
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  select coalesce(jsonb_agg(x.j order by x.at desc), '[]'::jsonb) into r from (
    select d.last_move_at as at, jsonb_build_object(
      'id', d.id, 'state', d.status, 'me', case when d.from_user = uid then 1 else 2 end,
      'friend', movies.who(case when d.from_user = uid then d.to_user else d.from_user end),
      'vibe', d.vibe, 'n', jsonb_array_length(d.deck), 'mine', m.n, 'their_n', t.n, 'match', d.match,
      'code', (select code from movies.invites i where i.duel_id = d.id and i.expires_at > now() limit 1),
      'final', d.final,
      'fc', case when d.final and d.status = 'open' then (select jsonb_build_object('phase', s ->> 'phase', 'round', (s ->> 'round')::int, 'step', (s ->> 'step')::int) from movies.fc_replay(d.id) s) end,
      'turn', case when d.status in ('matched','settled') then 'done' when d.status = 'nomatch' then 'decide'
                   when d.final then case when (case when d.from_user = uid then d.from_done else d.to_done end) then 'them' else 'you' end
                   when m.n < jsonb_array_length(d.deck) then 'you' else 'them' end,
      'at', d.last_move_at) as j
    from movies.duels d
    cross join lateral (select count(*)::int as n from movies.duel_swipes s where s.duel_id = d.id and s.user_id = uid and s.round = 1) m
    cross join lateral (select count(*)::int as n from movies.duel_swipes s where s.duel_id = d.id and s.user_id <> uid and s.round = 1) t
    where (d.from_user = uid or d.to_user = uid) and d.status <> 'closed' and d.last_move_at > now() - interval '30 days'
    order by d.last_move_at desc limit 40
  ) x;
  return jsonb_build_object('status','ok','duels',r);
end $$;

-- The bell: unread lines, and duels (and quizzes) waiting on you.
create or replace function public.inbox_unread()
returns jsonb language plpgsql stable security definer set search_path = 'movies', 'public' as $$
declare uid uuid := auth.uid();
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  return jsonb_build_object('status','ok',
    'unread', (select count(*) from movies.inbox where user_id = uid and read_at is null),
    'turns', (select count(*) from movies.duels d where (d.from_user = uid or d.to_user = uid) and d.to_user is not null
      and (d.status = 'nomatch' or (d.status = 'open' and (case
        when d.final then not (case when d.from_user = uid then d.from_done else d.to_done end)
        else (select count(*) from movies.duel_swipes s where s.duel_id = d.id and s.user_id = uid and s.round = 1) < jsonb_array_length(d.deck) end))))
      + (select count(*) from movies.quiz_challenges q where q.to_user = uid and q.status = 'open' and q.created_at > now() - interval '30 days'),
    'quiz', (select count(*) from movies.quiz_challenges q where q.to_user = uid and q.status = 'open' and q.created_at > now() - interval '30 days'));
end $$;

-- Emails: "your turn" joins the list; quiet lines (a second "your turn" the same day) never go by email.
create or replace function public.alerts_due(p_limit integer)
returns jsonb language sql stable security definer set search_path = 'movies', 'public' as $$
  select coalesce(jsonb_agg(s), '[]'::jsonb) from (
    select u.id, u.email, movies.who(u.id) ->> 'name' as name, max(i.id) as maxid,
      jsonb_agg(jsonb_build_object('kind', i.kind, 'from', movies.who(i.from_user) ->> 'name', 'film', i.film, 'duel', i.duel_id) order by i.id) as items
    from movies.inbox i
    join auth.users u on u.id = i.user_id
    left join movies.alert_prefs p on p.user_id = i.user_id
    where i.emailed_at is null and i.read_at is null and not i.quiet
      and i.kind in ('duel_new','late_fee','friend_request','duel_match','quiz_new','duel_turn')
      and i.created_at between now() - interval '3 days' and now() - interval '10 minutes'
      and coalesce(p.email_on, true)
      and (p.last_email_at is null or p.last_email_at < now() - interval '20 hours')
      and extract(hour from now() at time zone 'Australia/Brisbane') between 8 and 20
      and u.email is not null and u.email <> ''
    group by u.id, u.email
    limit greatest(1, least(coalesce(p_limit, 50), 200))
  ) s
$$;

-- Monday catch-up: Final Cut duels count when it's your move.
create or replace function public.alerts_digest_due(p_limit integer)
returns jsonb language sql stable security definer set search_path = 'movies', 'public' as $$
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
        and (case when d.final then not (case when d.from_user = u.id then d.from_done else d.to_done end)
             else (select count(*) from movies.duel_swipes s where s.duel_id = d.id and s.user_id = u.id and s.round = 1) < jsonb_array_length(d.deck) end)))
    group by u.id, u.email
    limit greatest(1, least(coalesce(p_limit, 50), 200))
  ) s
$$;

-- ---------- who can call what ----------
revoke all on function public.duel_create(uuid, text, jsonb, boolean), public.duel_swipe(uuid, text, boolean, integer), public.duel_unswipe(uuid, text, integer) from public, anon;
grant execute on function public.duel_create(uuid, text, jsonb, boolean), public.duel_swipe(uuid, text, boolean, integer), public.duel_unswipe(uuid, text, integer) to authenticated;
revoke all on function movies.fc_replay(uuid), movies.notify_turn(uuid, uuid, uuid) from public, anon, authenticated;
