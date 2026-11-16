// Reel Dinner email alerts (Phase 2). NOT deployed until Josh says go.
// Two jobs:
//  1. POST from the pg_cron job every 15 minutes (header x-rd-key must match RD_ALERTS_KEY):
//     sends the alert emails that are due (public.alerts_due: one a day each at most, never 9pm to 8am Brisbane
//     time) and, on Mondays, the catch-up email to people a friend is waiting on (public.alerts_digest_due).
//  2. GET ?u=<user id>&w=all|digest&t=<signature>: the unsubscribe link in every email.
// Secrets: RESEND_API_KEY (Resend, same account as the sign-in emails), RD_ALERTS_KEY (any long random string,
// also stored in the database vault as rd_alerts_key for the cron job). SUPABASE_URL and
// SUPABASE_SERVICE_ROLE_KEY are there by default. No secret is ever sent to the page.

const SB = Deno.env.get('SUPABASE_URL')!;
const SERVICE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RESEND = Deno.env.get('RESEND_API_KEY') || '';
const KEY = Deno.env.get('RD_ALERTS_KEY') || '';
const FROM = 'Reel Dinner <noreply@reeldinner.com>';
const SITE = 'https://reeldinner.com/';
const FN = `${SB}/functions/v1/rd-alerts`;

async function rpc(fn: string, args: Record<string, unknown>) {
  const r = await fetch(`${SB}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: SERVICE, Authorization: `Bearer ${SERVICE}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  if (!r.ok) throw new Error(`${fn} ${r.status} ${await r.text()}`);
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}

async function sign(s: string) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(KEY), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const b = new Uint8Array(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(s)));
  return btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '').slice(0, 32);
}
const unsubURL = async (u: string, w: string) => `${FN}?u=${u}&w=${w}&t=${await sign(u + ':' + w)}`;

const esc = (s: string) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));
const title = (id: string) => String(id || '').replace(/ \(\d{4}\)$/, '');

type Item = { kind: string; from: string; film: string | null; duel: string | null };
function line(i: Item) {
  const f = esc(i.from || 'A friend'), t = esc(title(i.film || ''));
  switch (i.kind) {
    case 'duel_new': return `<b>${f}</b> sent you a Dinner Duel. Swipe your 20 and see if you match.`;
    case 'duel_match': return `You and <b>${f}</b> both kept <b>${t}</b>. Dinner's sorted, the menu's waiting.`;
    case 'duel_turn': return `Your turn in your Final Cut with <b>${f}</b>. The shortlist got shorter. Your move.`;
    case 'quiz_new': return `<b>${f}</b> challenged you to Quiz night on Reel Dinner. Same 10 film questions, can you beat their score?`;
    case 'friend_request': return `<b>${f}</b> wants to add you as a friend on Reel Dinner.`;
    case 'late_fee': return `<b>Galaxy Video late fee:</b> your copy of <b>${t}</b> is overdue. Please be kind, rewind and swipe. ${f} is waiting.`;
    default: return '';
  }
}
function subject(items: Item[]) {
  const first = items[items.length - 1];
  if (items.length > 1) return `${items.length} things waiting on Reel Dinner`;
  if (first.kind === 'duel_new') return `${first.from} sent you a Dinner Duel`;
  if (first.kind === 'duel_match') return `It's a match: ${title(first.film || '')}`;
  if (first.kind === 'duel_turn') return `Your turn: Final Cut with ${first.from}`;
  if (first.kind === 'quiz_new') return `${first.from} challenged you to Quiz night`;
  if (first.kind === 'friend_request') return `${first.from} wants to be friends on Reel Dinner`;
  return `Overdue: ${title(first.film || '')}`;
}
function page(name: string, lines: string[], button: string, unsub: string, unsubLabel: string) {
  return `<!doctype html><html><body style="margin:0;background:#1b0f30;font-family:Helvetica,Arial,sans-serif;color:#fff4dc">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#1b0f30"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#2a1250;border:2px solid #ffc42e;border-radius:14px">
<tr><td style="padding:22px 22px 6px"><p style="margin:0;font-size:12px;letter-spacing:2px;color:#1fb5ad;text-transform:uppercase">Galaxy Video at Reel Dinner</p>
<h1 style="margin:6px 0 0;font-size:24px;color:#ffc42e">Hi ${esc(name || 'there')}</h1></td></tr>
${lines.map(l => `<tr><td style="padding:10px 22px 0;font-size:16px;line-height:1.45">${l}</td></tr>`).join('')}
<tr><td style="padding:20px 22px 22px"><a href="${SITE}" style="display:inline-block;background:#ffc42e;color:#1b0f30;text-decoration:none;font-weight:bold;padding:12px 22px;border-radius:999px">${esc(button)}</a></td></tr>
</table>
<p style="max-width:480px;margin:14px auto 0;font-size:12px;line-height:1.5;color:#d9c9f2">You get these because you're a Reel Dinner member and a friend did something. Change them any time in My account, Settings.<br><a href="${unsub}" style="color:#d9c9f2">${esc(unsubLabel)}</a></p>
</td></tr></table></body></html>`;
}
async function send(to: string, subj: string, html: string, unsub: string) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${RESEND}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject: subj, html, headers: { 'List-Unsubscribe': `<${unsub}>`, 'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click' } }),
  });
  if (!r.ok) throw new Error(`resend ${r.status} ${await r.text()}`);
}

async function run() {
  let sent = 0, failed = 0;
  for (const u of (await rpc('alerts_due', { p_limit: 50 })) || []) {
    try {
      const items: Item[] = u.items || [], lines = items.map(line).filter(Boolean);
      if (lines.length) {
        const unsub = await unsubURL(u.id, 'all');
        await send(u.email, subject(items), page(u.name, lines, 'Open Reel Dinner', unsub, 'Stop these emails'), unsub);
        sent++;
      }
      await rpc('alerts_mark', { p_user: u.id, p_maxid: u.maxid });
    } catch (e) { failed++; console.error('alert', u.id, String(e)) }
  }
  for (const u of (await rpc('alerts_digest_due', { p_limit: 50 })) || []) {
    try {
      const w: { from: string; state: string; film: string }[] = u.waiting || [];
      const lines = w.map(x => x.state === 'nomatch'
        ? `No match with <b>${esc(x.from)}</b> yet. One spin on the tie-breaker wheel settles it.`
        : `<b>${esc(x.from)}</b> is waiting on you to swipe your Dinner Duel.`);
      if (lines.length) {
        const unsub = await unsubURL(u.id, 'digest');
        await send(u.email, w.length > 1 ? `${w.length} friends are waiting on you` : `${w[0].from} is waiting on you`, page(u.name, lines, 'Take your turn', unsub, 'Stop the Monday catch-up'), unsub);
        sent++;
      }
      await rpc('alerts_digest_mark', { p_user: u.id });
    } catch (e) { failed++; console.error('digest', u.id, String(e)) }
  }
  return { sent, failed };
}

const html = (h: string, k: string) => new Response(`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Reel Dinner</title><body style="margin:0;background:#1b0f30;color:#fff4dc;font-family:Helvetica,Arial,sans-serif;display:grid;place-items:center;min-height:100vh;text-align:center;padding:20px;box-sizing:border-box"><div><h1 style="color:#ffc42e">${esc(h)}</h1><p>${esc(k)}</p><p><a href="${SITE}" style="color:#ffc42e">Back to Reel Dinner</a></p></div>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });

Deno.serve(async req => {
  const url = new URL(req.url);
  const u = url.searchParams.get('u'), w = url.searchParams.get('w'), t = url.searchParams.get('t');
  if (u && w && t) {
    if (!/^[0-9a-f-]{36}$/.test(u) || !['all', 'digest'].includes(w) || !KEY || t !== await sign(u + ':' + w)) return html("That link didn't work", 'Change your emails in My account, Settings, on reeldinner.com.');
    await rpc('alerts_unsub', { p_user: u, p_what: w });
    return html(w === 'all' ? 'Emails off' : 'Monday catch-up off', 'Done. You can switch them back on in My account, Settings, any time.');
  }
  if (req.method !== 'POST' || !KEY || req.headers.get('x-rd-key') !== KEY) return new Response('Not here', { status: 404 });
  if (!RESEND) return Response.json({ error: 'RESEND_API_KEY not set' }, { status: 500 });
  try { return Response.json(await run()) } catch (e) { console.error(String(e)); return Response.json({ error: 'failed' }, { status: 500 }) }
});
