#!/usr/bin/env bash
# Bring a round of writer worktrees into this checkout: copy their src, packs and notes, rebuild each pack from
# its source (so the pack matches the source here), check it, put it into the data, then rebuild.
# Their own data files are never merged (each worktree changed films.json and friends; put redoes it here).
#   bash wip/next100/merge-round.sh /home/claude/wt-r1a /home/claude/wt-r1b /home/claude/wt-r1c
set -euo pipefail
cd "$(dirname "$0")/../.."
for wt in "$@"; do
  mkdir -p wip/next100/src wip/next100/packs wip/next100/notes
  # only the files this worktree added or changed since it branched (never older copies of films fixed here since)
  base=$(git -C "$wt" merge-base HEAD feature/match-night)
  changed=$( { git -C "$wt" diff --name-only "$base" -- wip/next100/src wip/next100/notes; git -C "$wt" ls-files --others --exclude-standard -- wip/next100/src wip/next100/notes; } | sort -u)
  for f in $changed; do case $f in wip/next100/notes/*) [ -f "$wt/$f" ] && cp "$wt/$f" "$f";; esac; done
  for f in $changed; do case $f in wip/next100/src/*.py) ;; *) continue;; esac; s="$wt/$f"; [ -f "$s" ] || continue
    b=$(basename "$s" .py); [ "$b" = good-will-hunting-1997 ] && continue
    cp "$s" wip/next100/src/
    [ -f "$wt/wip/next100/notes/$b.md" ] && cp "$wt/wip/next100/notes/$b.md" wip/next100/notes/
    python3 wip/next100/mk.py "wip/next100/src/$b.py" >/dev/null
    python3 wip/newfilms/checkpack.py "wip/next100/packs/$b.json" --allow-existing | grep -v "^  warn" || { echo "FIX $b"; exit 1; }
    python3 wip/next100/pack.py put "wip/next100/packs/$b.json"
  done
done
python3 scripts/build-aisles.py >/dev/null
node scripts/build-data.cjs | tail -3
