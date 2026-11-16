-- Test for supabase/friends.sql. Run AFTER the migration in the same transaction: it always ends by raising
-- an exception, so nothing it does (or the migration before it) is ever kept. A pass reads "FRIENDS TEST PASS".
do $t$
declare
  a uuid := gen_random_uuid(); b uuid := gen_random_uuid(); c uuid := gen_random_uuid();
  r jsonb; code text; d1 uuid; d2 uuid; d3 uuid; n int; log text := '';
begin
  insert into auth.users(instance_id, id, aud, role, email) values
    ('00000000-0000-0000-0000-000000000000', a, 'authenticated', 'authenticated', 'a@test.invalid'),
    ('00000000-0000-0000-0000-000000000000', b, 'authenticated', 'authenticated', 'b@test.invalid'),
    ('00000000-0000-0000-0000-000000000000', c, 'authenticated', 'authenticated', 'c@test.invalid');
  insert into movies.members(no, data, user_id) values
    ('900001', '{"member":{"name":"Josh"}}', a), ('900002', '{"member":{"name":""}}', b), ('900003', '{}', c);

  -- 1. friend link
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  r := public.friend_invite(); code := r->>'code';
  if code !~ '^[A-Z2-9]{8}$' then raise exception 'invite code %', r; end if;
  if (public.friend_invite()->>'code') <> code then raise exception 'friend link not reused'; end if;
  perform set_config('request.jwt.claims', '', true);
  r := public.invite_peek(lower(code));
  if r->>'from' <> 'Josh' or (r->>'duel')::boolean then raise exception 'peek %', r; end if;
  log := log || '1 ok; ';

  -- 2. B opens it
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  r := public.invite_accept(code);
  if r->>'status' <> 'ok' or not (r->>'new')::boolean then raise exception 'accept %', r; end if;
  r := public.friends_list();
  if r->'friends'->0->>'name' <> 'Josh' then raise exception 'friends list %', r; end if;
  if (public.invite_accept(code)->>'new')::boolean then raise exception 'second accept counted as new'; end if;
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  if (public.invite_accept(code)->>'status') <> 'self' then raise exception 'own link'; end if;
  r := public.friends_list();
  if r->'friends'->0->>'name' <> 'Member 900 002' then raise exception 'blank name falls back to number %', r; end if;
  if not exists (select 1 from movies.inbox where user_id = a and kind = 'friend_joined' and from_user = b) then raise exception 'friend_joined missing'; end if;
  log := log || '2 ok; ';

  -- 3. request by member number
  perform set_config('request.jwt.claims', json_build_object('sub', c, 'role', 'authenticated')::text, true);
  if public.friend_request_by_no('999999')->>'status' <> 'notfound' then raise exception 'unknown number'; end if;
  if public.friend_request_by_no('900 003')->>'status' <> 'self' then raise exception 'self number'; end if;
  if public.friend_request_by_no('900 001')->>'status' <> 'sent' then raise exception 'request'; end if;
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  if jsonb_array_length(public.friends_list()->'incoming') <> 1 then raise exception 'incoming request missing'; end if;
  if public.friend_respond(c, true)->>'status' <> 'ok' then raise exception 'respond'; end if;
  if jsonb_array_length(public.friends_list()->'friends') <> 2 then raise exception 'A should have 2 friends'; end if;
  if not exists (select 1 from movies.inbox where user_id = c and kind = 'friend_accepted') then raise exception 'friend_accepted missing'; end if;
  log := log || '3 ok; ';

  -- 4. duel A v B, a match
  r := public.duel_create(b, 'comedy', '["F1 (1990)","F2 (1991)","F3 (1992)"]');
  d1 := (r->>'id')::uuid;
  if r->>'state' <> 'open' or (r->>'me')::int <> 1 then raise exception 'create %', r; end if;
  if public.duel_create(b, 'comedy', '["X","X"]')->>'status' <> 'bad' then raise exception 'duplicate deck allowed'; end if;
  if public.duel_create(gen_random_uuid(), 'comedy', '["X"]')->>'status' <> 'notfriends' then raise exception 'non-friend duel allowed'; end if;
  if public.duel_swipe(d1, 'Nope (2000)', true)->>'status' <> 'bad' then raise exception 'film not in deck allowed'; end if;
  perform public.duel_swipe(d1, 'F1 (1990)', true);
  if exists (select 1 from movies.inbox where user_id = b and kind = 'duel_new') then raise exception 'duel_new before sender finished'; end if;
  perform public.duel_swipe(d1, 'F2 (1991)', false);
  r := public.duel_unswipe(d1, 'F2 (1991)');
  if jsonb_array_length(r->'mine') <> 1 then raise exception 'unswipe %', r; end if;
  perform public.duel_swipe(d1, 'F2 (1991)', false);
  r := public.duel_swipe(d1, 'F3 (1992)', true);
  if not exists (select 1 from movies.inbox where user_id = b and kind = 'duel_new' and duel_id = d1) then raise exception 'duel_new missing'; end if;
  perform set_config('request.jwt.claims', json_build_object('sub', c, 'role', 'authenticated')::text, true);
  if public.duel_state(d1)->>'status' <> 'gone' then raise exception 'outsider can see the duel'; end if;
  if public.duel_swipe(d1, 'F1 (1990)', true)->>'status' <> 'gone' then raise exception 'outsider can swipe'; end if;
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  r := public.duel_state(d1);
  if (r->>'their_n')::int <> 3 or r->'theirs' <> 'null'::jsonb or (r->>'me')::int <> 2 then raise exception 'B view %', r; end if;
  if (public.inbox_unread()->>'turns')::int <> 1 then raise exception 'B should have a turn waiting'; end if;
  perform public.duel_swipe(d1, 'F1 (1990)', false);
  perform public.duel_swipe(d1, 'F2 (1991)', true);
  r := public.duel_swipe(d1, 'F3 (1992)', true);
  if r->>'state' <> 'matched' or r->>'match' <> 'F3 (1992)' then raise exception 'match %', r; end if;
  if public.duel_unswipe(d1, 'F3 (1992)')->>'match' <> 'F3 (1992)' then raise exception 'match taken back'; end if;
  if not exists (select 1 from movies.inbox where user_id = a and kind = 'duel_match') then raise exception 'duel_match missing'; end if;
  if movies.streak(a, b) <> 1 then raise exception 'streak'; end if;
  r := public.duels_list();
  if r->'duels'->0->>'turn' <> 'done' then raise exception 'board %', r; end if;
  log := log || '4 ok; ';

  -- 5. duel A v C, no match, tie-breaker
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  d2 := (public.duel_create(c, 'horror', '["G1","G2"]')->>'id')::uuid;
  perform public.duel_swipe(d2, 'G1', true); perform public.duel_swipe(d2, 'G2', false);
  perform set_config('request.jwt.claims', json_build_object('sub', c, 'role', 'authenticated')::text, true);
  perform public.duel_swipe(d2, 'G1', false);
  r := public.duel_swipe(d2, 'G2', true);
  if r->>'state' <> 'nomatch' or r->'theirs' <> '["G1"]'::jsonb then raise exception 'nomatch %', r; end if;
  r := public.duel_settle(d2);
  if r->>'state' <> 'settled' or r->>'match' not in ('G1','G2') then raise exception 'settle %', r; end if;
  if (public.duel_settle(d2)->>'match') <> (r->>'match') then raise exception 'settle not stable'; end if;
  if movies.streak(a, c) <> 0 then raise exception 'settled should break the streak'; end if;
  log := log || '5 ok; ';

  -- 6. duel by link
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  r := public.duel_create(null, 'any', '["H1","H2"]');
  d3 := (r->>'id')::uuid; code := r->>'code';
  if code is null then raise exception 'link duel code %', r; end if;
  perform set_config('request.jwt.claims', '', true);
  if not (public.invite_peek(code)->>'duel')::boolean then raise exception 'peek duel'; end if;
  perform set_config('request.jwt.claims', json_build_object('sub', c, 'role', 'authenticated')::text, true);
  r := public.invite_accept(code);
  if (r->>'duel')::uuid is distinct from d3 then raise exception 'claim %', r; end if;
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  if public.invite_accept(code)->>'status' <> 'gone' then raise exception 'duel link reused'; end if;
  log := log || '6 ok; ';

  -- 7. late fee: B sat on a duel for 3 days
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  d1 := (public.duel_create(b, 'any', '["L1"]')->>'id')::uuid;
  perform public.duel_swipe(d1, 'L1', true);
  update movies.duels set last_move_at = now() - interval '3 days' where id = d1;
  perform movies.late_fee_sweep();
  if not exists (select 1 from movies.inbox where user_id = b and kind = 'late_fee' and duel_id = d1 and film = 'L1') then raise exception 'late fee missing'; end if;
  update movies.duels set last_move_at = now() - interval '3 days' where id = d1;
  perform movies.late_fee_sweep();
  if (select count(*) from movies.inbox where user_id = b and kind = 'late_fee') <> 1 then raise exception 'late fee sent twice'; end if;
  -- switched off: no fee
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  r := public.alert_prefs_set(true, true, false);
  if (r->>'late_fees')::boolean then raise exception 'prefs %', r; end if;
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  d2 := (public.duel_create(b, 'any', '["M1"]')->>'id')::uuid;
  perform public.duel_swipe(d2, 'M1', true);
  update movies.duels set last_move_at = now() - interval '3 days' where id = d2;
  perform movies.late_fee_sweep();
  if exists (select 1 from movies.inbox where user_id = b and kind = 'late_fee' and duel_id = d2) then raise exception 'late fee sent when switched off'; end if;
  log := log || '7 ok; ';

  -- 8. emails due (only meaningful between 8am and 9pm Brisbane time)
  update movies.inbox set created_at = now() - interval '1 hour';
  r := public.alerts_due(50);
  if extract(hour from now() at time zone 'Australia/Brisbane') between 8 and 20 then
    if not exists (select 1 from jsonb_array_elements(r) e where e->>'email' = 'b@test.invalid') then raise exception 'alerts_due %', r; end if;
    perform public.alerts_mark(b, (select max(id) from movies.inbox));
    if exists (select 1 from jsonb_array_elements(public.alerts_due(50)) e where e->>'email' = 'b@test.invalid') then raise exception 'emailed twice in a day'; end if;
    log := log || '8 ok; ';
  else
    if jsonb_array_length(r) <> 0 then raise exception 'emails in quiet hours'; end if;
    log := log || '8 ok (quiet hours); ';
  end if;
  perform public.alerts_unsub(c, 'all');
  if (select email_on from movies.alert_prefs where user_id = c) then raise exception 'unsub'; end if;

  -- 9. inbox read
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  if (public.inbox_unread()->>'unread')::int = 0 then raise exception 'B unread'; end if;
  if jsonb_array_length(public.inbox_list()->'items') = 0 then raise exception 'inbox list'; end if;
  perform public.inbox_read(null);
  if (public.inbox_unread()->>'unread')::int <> 0 then raise exception 'read all'; end if;
  log := log || '9 ok; ';

  -- 10. block
  perform public.friend_block(a);
  if movies.are_friends(a, b) then raise exception 'still friends after block'; end if;
  if exists (select 1 from movies.duels where status = 'open' and ((from_user = a and to_user = b) or (from_user = b and to_user = a))) then raise exception 'duels left open after block'; end if;
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  if public.friend_request_by_no('900002')->>'status' <> 'notfound' then raise exception 'blocked person found by number'; end if;
  code := public.friend_invite()->>'code';
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  if public.invite_accept(code)->>'status' <> 'gone' then raise exception 'blocked person used a link'; end if;
  log := log || '10 ok; ';

  -- 11. signed out gets nothing
  perform set_config('request.jwt.claims', '', true);
  if public.friends_list()->>'status' <> 'signedout' or public.duel_create(null, 'any', '["Z"]')->>'status' <> 'signedout' then raise exception 'signed out'; end if;

  -- 12. delete account wipes every trace
  perform set_config('request.jwt.claims', json_build_object('sub', c, 'role', 'authenticated')::text, true);
  if public.member_delete()->>'status' <> 'deleted' then raise exception 'member_delete'; end if;
  select (select count(*) from movies.friends where user_id = c or friend_id = c) + (select count(*) from movies.duels where from_user = c or to_user = c)
       + (select count(*) from movies.inbox where user_id = c or from_user = c) + (select count(*) from movies.alert_prefs where user_id = c)
       + (select count(*) from movies.duel_swipes where user_id = c) into n;
  if n <> 0 then raise exception 'delete left % rows', n; end if;
  log := log || '11-12 ok';

  raise exception 'FRIENDS TEST PASS: %', log;
end $t$;
