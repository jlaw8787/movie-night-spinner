-- Applied 13 Nov 2026 to the Reel Dinner Supabase project (zpcgxupmclkxbzikdnfb), migration movie_requests_spam_filter.
-- Spam guard for the Request a movie form. Spam is dropped silently: the sender still gets a normal "sent" reply.
create or replace function public.movie_requests_guard() returns trigger
language plpgsql security definer set search_path = public, pg_temp as $$
declare all_text text := coalesce(new.title,'')||' '||coalesce(new.name,'')||' '||coalesce(new.note,'');
begin
  new.title := btrim(new.title); new.name := nullif(btrim(new.name),''); new.note := nullif(btrim(new.note),'');
  if all_text ~* '(https?://|www\.|\m[a-z0-9-]+\.(com|net|org|io|live|info|biz|xyz|co|au)\M|\mseo\M|search engine|rank(ing)? (higher|on google)|google (ranking|search index)|backlinks?|website (report|traffic|analysis|visibility)|online visibility|price list|free of cost|crypto|casino|viagra)' then
    return null;
  end if;
  if exists (select 1 from public.movie_requests r where lower(r.title)=lower(new.title) and r.year=new.year and r.created_at > now() - interval '10 minutes') then
    return null;
  end if;
  if (select count(*) from public.movie_requests r where r.created_at > now() - interval '1 hour') >= 20 then
    return null;
  end if;
  return new;
end $$;
revoke all on function public.movie_requests_guard() from public, anon, authenticated;
drop trigger if exists movie_requests_guard on public.movie_requests;
create trigger movie_requests_guard before insert on public.movie_requests for each row execute function public.movie_requests_guard();
