-- Test for supabase/final-cut.sql. Run AFTER the migration in the same transaction: it always ends by raising an
-- exception, so nothing it does is kept. A pass reads "FINAL CUT TEST PASS".
do $t$
declare
  a uuid := gen_random_uuid(); b uuid := gen_random_uuid();
  r jsonb; rc text; d uuid; f text; log text := ''; deck jsonb := '["F1","F2","F3","F4","F5"]';
begin
  -- 1. rooms: an old-style call still works, a Final Cut room says so on join, rounds and head to head picks keep apart
  rc := public.match_create('any', deck);
  if (select final from public.match_rooms where match_rooms.code = rc) then raise exception 'old create made a final room'; end if;
  perform public.match_swipe(rc, 1, 'F1', true);
  if (public.match_state(rc)->'swipes'->0->>'r') <> '1' then raise exception 'old swipe not round 1'; end if;
  perform public.match_unswipe(rc, 1, 'F1');
  if jsonb_array_length(public.match_state(rc)->'swipes') <> 0 then raise exception 'old unswipe'; end if;
  rc := public.match_create('any', deck, true);
  r := public.match_join(rc, 'dev2');
  if not (r->>'final')::boolean then raise exception 'join final %', r; end if;
  perform public.match_swipe(rc, 1, 'F1', true, 1); perform public.match_swipe(rc, 1, 'F1', false, 2);
  if jsonb_array_length(public.match_state(rc)->'swipes') <> 2 then raise exception 'rounds collided'; end if;
  perform public.match_swipe(rc, 1, 'F1', true, 101); perform public.match_swipe(rc, 1, 'F2', true, 101);
  if (select count(*) from public.match_swipes s where s.code = rc and round = 101) <> 1 then raise exception 'two h2h picks'; end if;
  if public.match_swipe(rc, 1, 'F1', true, 61) then raise exception 'round 61 let through'; end if;
  perform public.match_unswipe(rc, 1, 'F1', 2);
  if exists (select 1 from public.match_swipes s where s.code = rc and round = 2) then raise exception 'unswipe round 2'; end if;
  log := log || '1 rooms ok; ';

  insert into auth.users(instance_id, id, aud, role, email) values
    ('00000000-0000-0000-0000-000000000000', a, 'authenticated', 'authenticated', 'fa@test.invalid'),
    ('00000000-0000-0000-0000-000000000000', b, 'authenticated', 'authenticated', 'fb@test.invalid');
  insert into movies.members(no, data, user_id) values ('900201', '{"member":{"name":"Josh"}}', a), ('900202', '{"member":{"name":"Sam"}}', b);
  perform movies.make_friends(a, b);

  -- 2. a normal duel still matches on the first shared keep
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  r := public.duel_create(b, 'any', deck); d := (r->>'id')::uuid;
  perform public.duel_swipe(d, 'F1', true);
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  r := public.duel_swipe(d, 'F1', true);
  if r->>'state' <> 'matched' or r->>'match' <> 'F1' then raise exception 'normal duel %', r; end if;
  log := log || '2 normal ok; ';

  -- 3. Final Cut duel: round one keeps F1 F2 F3 for both, no early match; Sam gets "duel_new" when Josh finishes
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  r := public.duel_create(b, 'any', deck, true); d := (r->>'id')::uuid;
  if not (r->>'final')::boolean or r->'fc'->>'phase' <> 'swipe' then raise exception 'create %', r; end if;
  foreach f in array array['F1','F2','F3'] loop perform public.duel_swipe(d, f, true, 1); end loop;
  perform public.duel_swipe(d, 'F4', false, 1); r := public.duel_swipe(d, 'F5', false, 1);
  if not exists (select 1 from movies.inbox where user_id = b and kind = 'duel_new' and duel_id = d) then raise exception 'no duel_new'; end if;
  if r->'fc'->>'their_done' <> 'false' then raise exception 'their done early %', r; end if;
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  r := public.duel_swipe(d, 'F1', true, 1);
  if r->>'state' <> 'open' then raise exception 'early match in final %', r; end if;
  if jsonb_array_length(r->'tsw') <> 0 then raise exception 'Josh keeps showing mid round %', r; end if;
  if r->'fc'->>'their_done' <> 'true' then raise exception 'their_done %', r; end if;
  perform public.duel_swipe(d, 'F2', true, 1); perform public.duel_swipe(d, 'F3', true, 1); perform public.duel_swipe(d, 'F4', true, 1);
  -- a swipe for a round that isn't on yet is ignored
  perform public.duel_swipe(d, 'F1', true, 2);
  if exists (select 1 from movies.duel_swipes where duel_id = d and round = 2) then raise exception 'future round let through'; end if;
  r := public.duel_swipe(d, 'F5', false, 1);
  if r->'fc'->>'round' <> '2' or r->'fc'->>'phase' <> 'swipe' then raise exception 'round 2 %', r; end if;
  if jsonb_array_length(r->'tsw') <> 5 then raise exception 'round one keeps not shown after %', r; end if;
  if not exists (select 1 from movies.inbox where user_id = a and kind = 'duel_turn' and duel_id = d and not quiet) then raise exception 'no turn line'; end if;
  if (select from_done or to_done from movies.duels where id = d) then raise exception 'flags after round 1'; end if;
  log := log || '3 round one ok; ';

  -- 4. round two: undo works inside the round; both cut everything, so F1 F2 F3 go head to head
  perform public.duel_swipe(d, 'F4', true, 2);
  if exists (select 1 from movies.duel_swipes where duel_id = d and round = 2) then raise exception 'film not in shortlist let through'; end if;
  perform public.duel_swipe(d, 'F1', true, 2); perform public.duel_unswipe(d, 'F1', 2);
  if exists (select 1 from movies.duel_swipes where duel_id = d and round = 2) then raise exception 'round 2 undo'; end if;
  foreach f in array array['F1','F2','F3'] loop perform public.duel_swipe(d, f, false, 2); end loop;
  if (public.inbox_unread()->>'turns')::int <> 0 then raise exception 'Sam bell counts a turn while done'; end if;
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  if (public.inbox_unread()->>'turns')::int < 1 then raise exception 'Josh bell'; end if;
  if (select x->>'turn' from jsonb_array_elements(public.duels_list()->'duels') x where x->>'id' = d::text) <> 'you' then raise exception 'board turn'; end if;
  foreach f in array array['F1','F2'] loop perform public.duel_swipe(d, f, false, 2); end loop;
  r := public.duel_swipe(d, 'F3', false, 2);
  if r->'fc'->>'phase' <> 'h2h' or r->'fc'->>'step' <> '1' then raise exception 'h2h %', r; end if;
  -- Sam's first turn line today can go by email
  if not exists (select 1 from movies.inbox where user_id = b and kind = 'duel_turn' and duel_id = d and not quiet) then raise exception 'first Sam turn quiet'; end if;
  log := log || '4 round two ok; ';

  -- 5. head to head: split on F1 v F2 (Josh's call, F1), then split on F1 v F3 (Sam's call, F3 wins)
  perform public.duel_swipe(d, 'F3', true, 101);
  if exists (select 1 from movies.duel_swipes where duel_id = d and round = 101) then raise exception 'film not in pair let through'; end if;
  perform public.duel_swipe(d, 'F1', true, 101);
  perform public.duel_swipe(d, 'F2', true, 101);
  if (select count(*) from movies.duel_swipes where duel_id = d and round = 101 and user_id = a) <> 1 then raise exception 'changed h2h pick'; end if;
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  r := public.duel_swipe(d, 'F2', true, 101);
  if r->'fc'->>'step' <> '2' then raise exception 'step 2 %', r; end if;
  -- Josh's second turn line today stays off email
  if not exists (select 1 from movies.inbox where user_id = a and kind = 'duel_turn' and duel_id = d and quiet) then raise exception 'second Josh turn not quiet'; end if;
  perform public.duel_swipe(d, 'F3', true, 102);
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  r := public.duel_swipe(d, 'F1', true, 102);
  if r->>'state' <> 'matched' or r->>'match' <> 'F3' then raise exception 'winner %', r; end if;
  if not exists (select 1 from movies.inbox where user_id = b and kind = 'duel_match' and duel_id = d and film = 'F3') then raise exception 'match line'; end if;
  log := log || '5 head to head ok; ';

  -- 6. Final Cut round one with nothing in common goes to the usual tie-breaker on round one keeps
  r := public.duel_create(b, 'any', '["G1","G2"]', true); d := (r->>'id')::uuid;
  perform public.duel_swipe(d, 'G1', true, 1); perform public.duel_swipe(d, 'G2', false, 1);
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  perform public.duel_swipe(d, 'G1', false, 1); r := public.duel_swipe(d, 'G2', true, 1);
  if r->>'state' <> 'nomatch' or jsonb_array_length(r->'theirs') <> 1 then raise exception 'nomatch %', r; end if;
  r := public.duel_settle(d);
  if r->>'state' <> 'settled' then raise exception 'settle %', r; end if;
  log := log || '6 no overlap ok; ';

  -- 7. emails: a quiet turn line is never due
  delete from movies.inbox where kind = 'duel_turn' and not quiet;
  update movies.inbox set created_at = now() - interval '20 minutes', emailed_at = null, read_at = null where kind = 'duel_turn';
  delete from movies.alert_prefs where user_id in (a, b);
  if exists (select 1 from jsonb_array_elements(public.alerts_due(200)) e, jsonb_array_elements(e->'items') it where it->>'kind' = 'duel_turn') then raise exception 'quiet line due'; end if;
  update movies.inbox set quiet = false where kind = 'duel_turn' and user_id = a;
  if extract(hour from now() at time zone 'Australia/Brisbane') between 8 and 20
     and not exists (select 1 from jsonb_array_elements(public.alerts_due(200)) e, jsonb_array_elements(e->'items') it where (e->>'id')::uuid = a and it->>'kind' = 'duel_turn') then raise exception 'turn email not due'; end if;
  log := log || '7 emails ok';

  raise exception 'FINAL CUT TEST PASS: %', log;
end $t$;
