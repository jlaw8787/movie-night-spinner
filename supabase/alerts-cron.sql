-- Reel Dinner email alerts schedule (Phase 2). Run ONCE at deploy, after:
--   1. supabase/friends.sql is applied,
--   2. the rd-alerts function is deployed (verify_jwt off: the cron job signs in with x-rd-key instead),
--   3. its secrets are set: RESEND_API_KEY and RD_ALERTS_KEY.
-- Replace PUT-THE-SAME-RD_ALERTS_KEY-HERE with the RD_ALERTS_KEY value. It lives in the vault, never in a page.
create extension if not exists pg_net with schema extensions;
select vault.create_secret('PUT-THE-SAME-RD_ALERTS_KEY-HERE', 'rd_alerts_key', 'Shared key for the rd-alerts email function');
-- every 15 minutes; the function itself only sends between 8am and 9pm Brisbane time and once a day per person
select cron.schedule('rd-alerts', '*/15 * * * *', $$
  select net.http_post(
    url := 'https://zpcgxupmclkxbzikdnfb.supabase.co/functions/v1/rd-alerts',
    headers := jsonb_build_object('Content-Type', 'application/json',
      'x-rd-key', (select decrypted_secret from vault.decrypted_secrets where name = 'rd_alerts_key')),
    body := '{}'::jsonb,
    timeout_milliseconds := 30000)
$$);
