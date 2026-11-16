-- Quiz night challenges between friends (members only). Applied as migration quiz_challenges.
-- A challenge is a seed (the same 10 questions on any phone, quiz.js), the sender's score and time, and the
-- friend's score and time once they play. Questions never touch the database: the seed deals them on the phone.
-- Same rules as Dinner Duel (friends.sql): RLS on, no policies, everything through functions that act only for
-- auth.uid(), friends only, blocks respected, account delete cascades.

create table if not exists movies.quiz_challenges (
  id uuid primary key default gen_random_uuid(),
  from_user uuid not null references auth.users(id) on delete cascade,
  to_user uuid not null references auth.users(id) on delete cascade,
  seed bigint not null check (seed between 1 and 2147483647),
  flags smallint not null default 0 check (flags between 0 and 3),          -- 1 kid-safe films, 2 no picture rounds (app)
  from_score smallint not null check (from_score between 0 and 10),
  from_secs int not null check (from_secs between 0 and 99999),
  to_score smallint check (to_score between 0 and 10),
  to_secs int check (to_secs between 0 and 99999),
  status text not null default 'open' check (status in ('open','done','closed')),
  created_at timestamptz not null default now(),
  done_at timestamptz,
  check (from_user <> to_user)
);
create index if not exists quiz_from_idx on movies.quiz_challenges(from_user, created_at desc);
create index if not exists quiz_to_idx on movies.quiz_challenges(to_user, created_at desc);
alter table movies.quiz_challenges enable row level security;

alter table movies.inbox add column if not exists quiz_id uuid references movies.quiz_challenges(id) on delete cascade;
alter table movies.inbox drop constraint if exists inbox_kind_check;
alter table movies.inbox add constraint inbox_kind_check check (kind in ('friend_joined','friend_request','friend_accepted','duel_new','duel_match','duel_nomatch','duel_settled','late_fee','quiz_new','quiz_done'));

-- One challenge as one person sees it.
create or replace function movies.quiz_view(c movies.quiz_challenges, p_uid uuid)
returns jsonb language sql stable security definer
set search_path to 'movies', 'public'
as $$
  select jsonb_build_object('id', c.id, 'me', case when c.from_user = p_uid then 1 else 2 end,
    'friend', movies.who(case when c.from_user = p_uid then c.to_user else c.from_user end),
    'seed', c.seed, 'flags', c.flags, 'state', c.status,
    'from_score', c.from_score, 'from_secs', c.from_secs, 'to_score', c.to_score, 'to_secs', c.to_secs,
    'turn', case when c.status = 'done' then 'done' when c.to_user = p_uid then 'you' else 'them' end,
    'at', coalesce(c.done_at, c.created_at))
$$;

-- Send the 10 you just played to a friend.
create or replace function public.quiz_send(p_friend uuid, p_seed bigint, p_flags int, p_score int, p_secs int)
returns jsonb language plpgsql security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid(); c movies.quiz_challenges;
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  if p_friend is null or p_seed is null or p_seed not between 1 and 2147483647 or coalesce(p_flags, -1) not between 0 and 3
     or coalesce(p_score, -1) not between 0 and 10 or coalesce(p_secs, -1) not between 0 and 99999 then return jsonb_build_object('status','bad'); end if;
  if not movies.are_friends(uid, p_friend) or movies.blocked(uid, p_friend) then return jsonb_build_object('status','notfriends'); end if;
  if (select count(*) from movies.quiz_challenges where from_user = uid and created_at > now() - interval '1 day') >= 30 then return jsonb_build_object('status','slow'); end if;
  if exists (select 1 from movies.quiz_challenges where from_user = uid and to_user = p_friend and seed = p_seed) then return jsonb_build_object('status','already'); end if;
  if (select count(*) from movies.quiz_challenges where from_user = uid and to_user = p_friend and status = 'open') >= 5 then return jsonb_build_object('status','toomany'); end if;
  insert into movies.quiz_challenges(from_user, to_user, seed, flags, from_score, from_secs)
    values (uid, p_friend, p_seed, p_flags, p_score, p_secs) returning * into c;
  if not movies.blocked(p_friend, uid) then
    insert into movies.inbox(user_id, kind, from_user, quiz_id) values (p_friend, 'quiz_new', uid, c.id);
  end if;
  return jsonb_build_object('status','ok','challenge', movies.quiz_view(c, uid));
end $$;

-- Every challenge you sent or got in the last 30 days, newest first.
create or replace function public.quiz_list()
returns jsonb language plpgsql stable security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid(); r jsonb;
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  select coalesce(jsonb_agg(movies.quiz_view(c, uid) order by coalesce(c.done_at, c.created_at) desc), '[]'::jsonb) into r
  from (select * from movies.quiz_challenges
        where (from_user = uid or to_user = uid) and status <> 'closed' and created_at > now() - interval '30 days'
        order by coalesce(done_at, created_at) desc limit 40) c;
  return jsonb_build_object('status','ok','quizzes',r);
end $$;

-- The friend's score comes in. Once only.
create or replace function public.quiz_answer(p_id uuid, p_score int, p_secs int)
returns jsonb language plpgsql security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid(); c movies.quiz_challenges;
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  if coalesce(p_score, -1) not between 0 and 10 or coalesce(p_secs, -1) not between 0 and 99999 then return jsonb_build_object('status','bad'); end if;
  select * into c from movies.quiz_challenges where id = p_id and to_user = uid for update;
  if not found or c.status = 'closed' then return jsonb_build_object('status','gone'); end if;
  if c.status = 'done' then return jsonb_build_object('status','done','challenge', movies.quiz_view(c, uid)); end if;
  update movies.quiz_challenges set to_score = p_score, to_secs = p_secs, status = 'done', done_at = now() where id = c.id returning * into c;
  update movies.inbox set read_at = now() where user_id = uid and quiz_id = c.id and read_at is null;
  if not movies.blocked(c.from_user, uid) then
    insert into movies.inbox(user_id, kind, from_user, quiz_id) values (c.from_user, 'quiz_done', uid, c.id);
  end if;
  return jsonb_build_object('status','ok','challenge', movies.quiz_view(c, uid));
end $$;

-- Take one off the board, for both people (a challenge never played can be turned down this way).
create or replace function public.quiz_close(p_id uuid)
returns jsonb language plpgsql security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  update movies.quiz_challenges set status = 'closed' where id = p_id and (from_user = uid or to_user = uid) and status <> 'closed';
  delete from movies.inbox where user_id = uid and quiz_id = p_id;
  return jsonb_build_object('status','ok');
end $$;

-- The inbox now carries the challenge with each quiz line.
create or replace function public.inbox_list()
returns jsonb language plpgsql stable security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid(); r jsonb;
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  select coalesce(jsonb_agg(jsonb_build_object('id', i.id, 'kind', i.kind, 'from', movies.who(i.from_user), 'duel', i.duel_id, 'film', i.film,
    'quiz', case when q.id is null then null else movies.quiz_view(q, uid) end,
    'at', i.created_at, 'read', i.read_at is not null) order by i.id desc), '[]'::jsonb) into r
  from (select * from movies.inbox where user_id = uid order by id desc limit 50) i
  left join movies.quiz_challenges q on q.id = i.quiz_id;
  return jsonb_build_object('status','ok','items',r);
end $$;

-- The bell: unread lines, duels waiting on you, and quiz challenges waiting on you.
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
      and (d.status = 'nomatch' or (d.status = 'open' and (select count(*) from movies.duel_swipes s where s.duel_id = d.id and s.user_id = uid) < jsonb_array_length(d.deck))))
      + (select count(*) from movies.quiz_challenges q where q.to_user = uid and q.status = 'open' and q.created_at > now() - interval '30 days'),
    'quiz', (select count(*) from movies.quiz_challenges q where q.to_user = uid and q.status = 'open' and q.created_at > now() - interval '30 days'));
end $$;

-- Emails: a new quiz challenge goes out like a new duel, under the same Settings switch (on unless switched off).
create or replace function public.alerts_due(p_limit integer)
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
      and i.kind in ('duel_new','late_fee','friend_request','duel_match','quiz_new')
      and i.created_at between now() - interval '3 days' and now() - interval '10 minutes'
      and coalesce(p.email_on, true)
      and (p.last_email_at is null or p.last_email_at < now() - interval '20 hours')
      and extract(hour from now() at time zone 'Australia/Brisbane') between 8 and 20
      and u.email is not null and u.email <> ''
    group by u.id, u.email
    limit greatest(1, least(coalesce(p_limit, 50), 200))
  ) s
$$;

-- Clear lines from your own inbox: the ones given, or all of them (null). The other person's copy is untouched.
create or replace function public.inbox_delete(p_ids bigint[])
returns jsonb language plpgsql security definer
set search_path to 'movies', 'public'
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then return jsonb_build_object('status','signedout'); end if;
  delete from movies.inbox where user_id = uid and (p_ids is null or id = any(p_ids));
  return jsonb_build_object('status','ok');
end $$;

-- Daily tidy: challenges older than 60 days go (their inbox lines go with them).
create or replace function movies.quiz_tidy()
returns void language sql security definer
set search_path to 'movies', 'public'
as $$ delete from movies.quiz_challenges where created_at < now() - interval '60 days' $$;

do $$
declare f text;
begin
  foreach f in array array['public.quiz_send(uuid, bigint, int, int, int)', 'public.quiz_list()', 'public.quiz_answer(uuid, int, int)', 'public.quiz_close(uuid)',
    'public.inbox_list()', 'public.inbox_unread()', 'public.inbox_delete(bigint[])']
  loop
    execute format('revoke all on function %s from public, anon', f);
    execute format('grant execute on function %s to authenticated', f);
  end loop;
  execute 'revoke all on function public.alerts_due(int) from public, anon, authenticated';
  execute 'grant execute on function public.alerts_due(int) to service_role';
  foreach f in array array['movies.quiz_view(movies.quiz_challenges, uuid)', 'movies.quiz_tidy()']
  loop
    execute format('revoke all on function %s from public, anon, authenticated', f);
  end loop;
end $$;

select cron.schedule('rd-quiz-tidy', '23 3 * * *', $$select movies.quiz_tidy()$$);
