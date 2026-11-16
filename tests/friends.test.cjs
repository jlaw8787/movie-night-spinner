// Phase 2 wiring (friends, Dinner Duel, inbox, alerts). The full two-phone run is scripts/check-friends.cjs and the
// database test is supabase/tests/friends-test.sql (run inside a transaction that always rolls back).
const assert = require('assert'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), rd = p => fs.readFileSync(path.join(root, p), 'utf8');
const html = rd('index.html');
const at = f => html.indexOf(`src="${f}`);
assert.ok(at('friends.js') > at('match.js') && at('match.js') > at('app.js') && at('app.js') > at('account.js'), 'scripts load account, app, match, friends');
for (const id of ['acctBtn', 'acctDot']) assert.ok(html.includes(`id="${id}"`), `#${id} missing`);
const files = ['friends.js', 'match.js', 'account.js', 'supabase/friends.sql', 'supabase/alerts-cron.sql', 'supabase/functions/rd-alerts/index.ts', 'privacy.html'];
for (const f of files) assert.ok(!rd(f).includes(String.fromCharCode(8212)), `em dash in ${f}`);
for (const f of ['friends.js', 'match.js', 'account.js', 'index.html']) assert.ok(!/service_role|SERVICE_ROLE/.test(rd(f)), `no secret keys in ${f}`);
const sql = rd('supabase/friends.sql') + rd('supabase/quiz-challenges.sql');
assert.ok(sql.includes('alter table movies.quiz_challenges enable row level security'), 'RLS on movies.quiz_challenges');
for (const t of ['friends', 'friend_requests', 'blocks', 'duels', 'duel_swipes', 'invites', 'inbox', 'alert_prefs']) assert.ok(sql.includes(`alter table movies.${t} enable row level security`), `RLS on movies.${t}`);
for (const f of ['alerts_due', 'alerts_mark', 'alerts_digest_due', 'alerts_digest_mark', 'alerts_unsub']) assert.ok(sql.includes(`'public.${f}(`) && /grant execute on function %s to service_role/.test(sql), `${f} is service role only`);
assert.ok(/to anon, authenticated/.test(sql) && (sql.match(/to anon/g) || []).length === 1, 'only invite_peek is open to guests');
// every function the page calls exists in the SQL
const called = new Set([...rd('friends.js').matchAll(/rpc\('(\w+)'/g), ...rd('match.js').matchAll(/arpc\('(\w+)'/g), ...rd('quiz.js').matchAll(/arpc\('(\w+)'/g)].map(m => m[1]).concat(['invite_peek']));
for (const f of called) assert.ok(sql.includes(`function public.${f}(`), `${f} missing from the SQL`);
assert.ok(/Dinner Duel/.test(rd('privacy.html')), 'privacy page covers friends and duels');
assert.ok(rd('app.js').includes('rd-signed-in'), 'sign-in tells friends.js');
console.log(`PASS friends wiring: ${called.size} database calls all defined, RLS on 8 tables, no secrets in the page.`);
