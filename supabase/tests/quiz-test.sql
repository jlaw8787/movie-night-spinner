-- Test for supabase/quiz-challenges.sql. Run AFTER the migration in the same transaction: it always ends by
-- raising an exception, so nothing it does is kept. A pass reads "QUIZ TEST PASS".
do $t$
declare
  a uuid := gen_random_uuid(); b uuid := gen_random_uuid(); c uuid := gen_random_uuid();
  r jsonb; q uuid; n int; log text := '';
begin
  insert into auth.users(instance_id, id, aud, role, email) values
    ('00000000-0000-0000-0000-000000000000', a, 'authenticated', 'authenticated', 'qa@test.invalid'),
    ('00000000-0000-0000-0000-000000000000', b, 'authenticated', 'authenticated', 'qb@test.invalid'),
    ('00000000-0000-0000-0000-000000000000', c, 'authenticated', 'authenticated', 'qc@test.invalid');
  insert into movies.members(no, data, user_id) values
    ('900101', '{"member":{"name":"Josh"}}', a), ('900102', '{"member":{"name":"Sam"}}', b), ('900103', '{}', c);
  perform movies.make_friends(a, b);

  -- 1. A sends B the 10 they played; C (not a friend) can't get one
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  r := public.quiz_send(b, 123456, 0, 8, 74);
  if r->>'status' <> 'ok' then raise exception 'send %', r; end if;
  q := (r->'challenge'->>'id')::uuid;
  if r->'challenge'->>'turn' <> 'them' then raise exception 'sender turn %', r; end if;
  if public.quiz_send(b, 123456, 0, 8, 74)->>'status' <> 'already' then raise exception 'same seed twice'; end if;
  if public.quiz_send(c, 99, 0, 5, 10)->>'status' <> 'notfriends' then raise exception 'not friends'; end if;
  if public.quiz_send(b, 0, 0, 5, 10)->>'status' <> 'bad' or public.quiz_send(b, 5, 0, 11, 10)->>'status' <> 'bad' or public.quiz_send(b, 5, 4, 5, 10)->>'status' <> 'bad' then raise exception 'bad input let through'; end if;
  log := log || '1 ok; ';

  -- 2. B sees it in the inbox, on the bell and in the list
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  r := public.inbox_list();
  if r->'items'->0->>'kind' <> 'quiz_new' or r->'items'->0->'quiz'->>'seed' <> '123456' or r->'items'->0->'quiz'->>'from_score' <> '8' or r->'items'->0->'from'->>'name' <> 'Josh' then raise exception 'inbox %', r; end if;
  r := public.inbox_unread();
  if (r->>'quiz')::int <> 1 or (r->>'turns')::int < 1 then raise exception 'bell %', r; end if;
  r := public.quiz_list();
  if jsonb_array_length(r->'quizzes') <> 1 or r->'quizzes'->0->>'turn' <> 'you' then raise exception 'list %', r; end if;
  log := log || '2 ok; ';

  -- 3. B plays: score goes back to A once only, B's line is marked read, the bell clears
  r := public.quiz_answer(q, 9, 60);
  if r->>'status' <> 'ok' or r->'challenge'->>'turn' <> 'done' or r->'challenge'->>'to_score' <> '9' then raise exception 'answer %', r; end if;
  if public.quiz_answer(q, 10, 1)->>'status' <> 'done' then raise exception 'second answer'; end if;
  if (select to_score from movies.quiz_challenges where id = q) <> 9 then raise exception 'score changed'; end if;
  if exists (select 1 from movies.inbox where user_id = b and quiz_id = q and read_at is null) then raise exception 'B line not read'; end if;
  if (public.inbox_unread()->>'quiz')::int <> 0 then raise exception 'bell not cleared'; end if;
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  if public.quiz_answer(q, 1, 1)->>'status' <> 'gone' then raise exception 'sender answered own'; end if;
  r := public.inbox_list();
  if r->'items'->0->>'kind' <> 'quiz_done' or r->'items'->0->'quiz'->>'to_score' <> '9' or r->'items'->0->'from'->>'name' <> 'Sam' then raise exception 'result line %', r; end if;
  log := log || '3 ok; ';

  -- 4. emails: a quiz_new is due once it's 10 minutes old (inside 8am to 9pm Brisbane only)
  update movies.inbox set created_at = now() - interval '20 minutes' where kind = 'quiz_new' and quiz_id = q;
  update movies.inbox set read_at = null where kind = 'quiz_new' and quiz_id = q;
  if extract(hour from now() at time zone 'Australia/Brisbane') between 8 and 20 then
    r := public.alerts_due(200);
    if not exists (select 1 from jsonb_array_elements(r) e where (e->>'id')::uuid = b and e->'items' @> '[{"kind":"quiz_new"}]') then raise exception 'quiz email not due %', r; end if;
  end if;
  log := log || '4 ok; ';

  -- 5. block: no new challenges either way; close takes it off both boards
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  r := public.quiz_send(b, 777, 2, 6, 50); q := (r->'challenge'->>'id')::uuid;
  perform set_config('request.jwt.claims', json_build_object('sub', b, 'role', 'authenticated')::text, true);
  perform public.quiz_close(q);
  if (select status from movies.quiz_challenges where id = q) <> 'closed' then raise exception 'close'; end if;
  if jsonb_array_length(public.quiz_list()->'quizzes') <> 1 then raise exception 'closed still listed'; end if;
  if public.quiz_answer(q, 5, 5)->>'status' <> 'gone' then raise exception 'answered a closed one'; end if;
  perform public.friend_block(a);
  perform set_config('request.jwt.claims', json_build_object('sub', a, 'role', 'authenticated')::text, true);
  if public.quiz_send(b, 888, 0, 5, 10)->>'status' <> 'notfriends' then raise exception 'blocked send'; end if;
  log := log || '5 ok; ';

  -- 6. inbox delete: one line, then all, only your own
  insert into movies.inbox(user_id, kind) values (a, 'friend_accepted'), (a, 'friend_accepted'), (b, 'friend_accepted');
  select min(id) into n from movies.inbox where user_id = a;
  perform public.inbox_delete(array[n::bigint]);
  if exists (select 1 from movies.inbox where id = n) then raise exception 'delete one'; end if;
  perform public.inbox_delete(null);
  if exists (select 1 from movies.inbox where user_id = a) or not exists (select 1 from movies.inbox where user_id = b) then raise exception 'delete all'; end if;
  log := log || '6 ok; ';

  -- 7. signed out, and account delete wipes it all
  perform set_config('request.jwt.claims', '', true);
  if public.quiz_list()->>'status' <> 'signedout' or public.quiz_send(b, 5, 0, 5, 5)->>'status' <> 'signedout' then raise exception 'signed out'; end if;
  delete from auth.users where id in (a, b, c);
  select count(*) into n from movies.quiz_challenges where from_user in (a, b, c) or to_user in (a, b, c);
  if n <> 0 then raise exception 'delete left % rows', n; end if;
  log := log || '7 ok';

  raise exception 'QUIZ TEST PASS: %', log;
end $t$;
