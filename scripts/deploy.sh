#!/usr/bin/env bash
# Memory-safe production deploy for sfs_gallery on the shared 3.8GB VPS.
# Invoked by scripts/auto-deploy-poll.sh (the server-side git-poll cron).
set -uo pipefail
cd /var/www/sfs_gallery

# Prevent overlapping deploys if commits land close together.
exec 9>/tmp/sfs_deploy.lock
if ! flock -n 9; then
  echo "[deploy] another deploy is already running — skipping"
  exit 0
fi

echo "[deploy] $(date -u) HEAD=$(git rev-parse --short HEAD)"

# Install dependencies only when package-lock.json actually changed.
LOCK_HASH="$(md5sum package-lock.json | cut -d' ' -f1)"
if [ "$LOCK_HASH" != "$(cat .deploy-lockhash 2>/dev/null || true)" ]; then
  echo "[deploy] dependencies changed — running npm ci"
  npm ci --no-audit --no-fund
  echo "$LOCK_HASH" > .deploy-lockhash
fi

# Free RAM for the build by pausing the non-critical demo app.
DEMO_WAS_UP=0
if pm2 describe safarearabia-demo >/dev/null 2>&1; then
  pm2 stop safarearabia-demo >/dev/null 2>&1 && DEMO_WAS_UP=1
fi

# Back up the current build so a failed build can never break the live app.
rm -rf .next.bak
[ -d .next ] && cp -a .next .next.bak

echo "[deploy] building…"
if NODE_OPTIONS="--max-old-space-size=2048" npm run build; then
  rm -rf .next.bak
  pm2 restart sfs_gallery
  echo "[deploy] build OK — sfs_gallery restarted"
  STATUS=0
else
  echo "[deploy] BUILD FAILED — restoring previous build"
  rm -rf .next
  [ -d .next.bak ] && mv .next.bak .next
  pm2 restart sfs_gallery || true
  STATUS=1
fi

# Resume the demo app if we paused it.
if [ "$DEMO_WAS_UP" = "1" ]; then
  pm2 start safarearabia-demo >/dev/null 2>&1 || true
fi
pm2 save >/dev/null 2>&1

sleep 8
# Hit the Next app directly, bypassing NGINX — so the HTTP→HTTPS redirect that
# certbot adds can never make a healthy app look like a 301 failure.
CODE="$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3007/ || echo 000)"
echo "[deploy] app HTTP $CODE"
echo "[deploy] finished $(date -u)"
exit $STATUS
