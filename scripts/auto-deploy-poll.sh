#!/usr/bin/env bash
# Server-side auto-deploy, run by cron every couple of minutes.
#
# Why polling instead of GitHub Actions: this VPS drops inbound SSH from cloud
# / CI IP ranges, so GitHub-hosted runners can't reach it. Outbound works fine
# (the box clones/pulls from GitHub), so we pull here instead of being pushed
# to. A new commit on main is picked up within the poll interval and deployed.
set -uo pipefail
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
export HOME=/root
cd /var/www/sfs_gallery || exit 0

LOG=/var/www/sfs_gallery/auto-deploy.log

# Only one poll/deploy at a time.
exec 8>/tmp/sfs_poll.lock
flock -n 8 || exit 0

# Fetch with retries. This box periodically loses outbound network; a single
# failed fetch used to `exit 0` silently, so a push made during a blip was
# skipped with no trace. Retry a few times, and if it still fails leave a
# breadcrumb in the log — the next tick picks the commit up once the network
# is back (HEAD will still differ from origin/main).
fetched=0
for attempt in 1 2 3; do
  if git fetch -q origin main 2>/dev/null; then fetched=1; break; fi
  sleep 5
done
if [ "$fetched" = 0 ]; then
  echo "[auto-deploy] $(date -u) WARN: git fetch failed (network?) — retrying next tick" >> "$LOG"
  exit 0
fi

if [ "$(git rev-parse HEAD)" = "$(git rev-parse origin/main)" ]; then
  exit 0   # already up to date, nothing to do
fi

echo "[auto-deploy] $(date -u) deploying $(git rev-parse --short origin/main)"
git reset --hard -q origin/main
bash scripts/deploy.sh
