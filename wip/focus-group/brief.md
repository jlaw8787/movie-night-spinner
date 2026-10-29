# Focus group tester brief

You are one of six testers running a simulated focus group on a web app called Movie Night Spinner. The owner wants honest feedback before launch. Flattery is useless to him. Find the friction, the gaps and the things that delight.

## The app
- Running locally at http://localhost:8795/ (repo root: /home/claude/movie-night-spinner). If it doesn't respond, start it in the background from the repo root: `python3 -m http.server 8795`. Do NOT edit, commit or push anything in the repo. Read-only.
- It's a single-page vanilla JS app. You spin a wheel of 850 films and each film gets a themed dinner menu (starters, mains, dessert, drinks), with recipes, a prep sheet, a shopping list and a printable menu. There's also a Video store (browse tapes, rent them for fun, member card), a Candy bar (snack counter you add to the film's shopping list), double features, marathons for film series, settings (vegetarian, no alcohol, usual guests, kids mode, sound), saved menus, lock in for the week, mark as watched, streaming info, and a "Goes well with" snack strip under each menu.
- Discover it the way a newcomer would. Don't read the source to figure out how to use it. You may read the source only to confirm whether something you couldn't find really exists.

## How to test
- Use Playwright from Python (`from playwright.async_api import async_playwright`; Chromium is pre-installed, never run `playwright install`). One fresh browser context per persona so storage starts clean (the welcome card will show).
- Phone personas: viewport 390x844, is_mobile=True, has_touch=True, device_scale_factor=2. Desktop: 1440x900. Low-vision personas: also try 200% zoom or a 320px-wide phone. Slow-phone personas: throttle CPU 4x and network to slow 3G via a CDP session and time the first useful paint. Screen-reader persona: inspect the accessibility tree (page.accessibility.snapshot or aria attributes), check labels, focus order, headings, keyboard only.
- Take screenshots at key moments and LOOK at them (Read tool on the PNG). Save them to /tmp/claude-0/-home-claude/6a0d96ab-f9fb-5c75-b6b0-4681bb3c85ff/scratchpad/fg/shots/<personaId>-<step>.png.
- For each persona, run the journey they would actually take toward their goal: arrive, understand what it is, set up (diet, guests), pick or spin a film, read the menu, open recipes and prep, get the shopping list, try the features that fit their goal (video store, candy bar, double feature, marathon, save, print or PDF, share, lock in). Judge recipes and menus against their diet for real: open the dishes and check ingredients (e.g. does a halal family get pork or alcohol in desserts or sauces; does a coeliac get gluten; does a vegan get anything; are cups or grams used).
- Stay in the persona's shoes: their tech confidence, patience, English level, budget, household size, time. A low-tech 76-year-old gives up where a designer wouldn't.
- Keep it lean: roughly 15 to 25 tool calls per persona. Reuse one helper script and vary it per persona rather than writing from scratch each time.

## Scoring (1 to 10; 5 = it's okay, 7 = good, 9 = excellent, 10 = nothing better exists)
first_impression, clarity (do I get what it is and what to do), find_film, menu_appeal, recipe_usefulness, diet_fit (does it meet their needs), shopping_list, video_store, candy_bar, speed, accessibility (for them), trust_privacy, delight, would_use_again, nps (0 to 10, would recommend to a friend). Use null for anything they genuinely wouldn't touch.

## Output
Write a JSON file to /tmp/claude-0/-home-claude/6a0d96ab-f9fb-5c75-b6b0-4681bb3c85ff/scratchpad/fg/<your group letter>.json: a list, one object per persona:
{"id","journey":[short steps they actually did],"completed_goal":true/false,"gave_up_at":null or step,"scores":{...},"frictions":[{"what","where","severity":"blocker|major|minor","evidence":"screenshot path or what happened"}],"wishes":[things they'd want added],"loved":[things they liked],"quote":"one or two sentences in their own voice","would_pay":"no|maybe|yes, and what they'd pay for"}

Then reply with a short summary: the top 5 issues across your personas (with severity and evidence) and anything that broke. Plain Australian English. Never use em or en dashes anywhere in your output or files. Be specific and honest; if something is good, say so plainly, if it's bad, say so.
