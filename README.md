# SFS Gallery

San Francisco Street Gallery — a Next.js 16 (App Router) rebuild of the WordPress site, with a self-hosted admin CMS backed by MongoDB.

## Stack

- **Next.js 16** (App Router, React 19) + **Tailwind v4**
- **MongoDB** via Mongoose
- **Auth**: JWT session in an httpOnly cookie (`jose` + `bcryptjs`)
- **Media**: uploaded to disk under `public/uploads/` (served by Next in dev, NGINX in production)

## Prerequisites

- Node.js **20.9+** (22 recommended)
- A running **MongoDB** instance

## Setup

```bash
npm install
cp .env.example .env.local     # then edit values (see below)
npm run seed-admin             # creates the first admin from .env.local
npm run dev                    # http://localhost:3000
```

### Environment (`.env.local`)

| Var | Purpose |
|-----|---------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string for signing admin sessions |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | First admin account (used by `npm run seed-admin`) |
| `UPLOAD_DIR` | Where uploads are written (default `public/uploads`) |
| `NEXT_PUBLIC_UPLOAD_BASE` | Public URL base for uploads (default `/uploads`) |

## Admin

- Sign in at **`/admin/login`**.
- Sections: Analytics, Artists, Art, Events, Blog, Sliders, Messages, User Data, Settings.
- Everything on the public site is managed here. **Settings** controls the logo, SEO meta, Meta Pixel / Google Analytics snippets, contact details and social links.

## Import existing WordPress content

Scrapes the live public site (artists, art galleries, events, blog, hero sliders, logo) into MongoDB and downloads all images to disk:

```bash
npm run migrate --dry     # preview what will be imported (no writes)
npm run migrate           # perform the import
```

Re-running is idempotent (upserts by slug). Spam blog posts are filtered out.

## Production (VPS + NGINX)

```bash
npm run build
npm start
```

Point NGINX at `public/uploads` to serve media directly, e.g.:

```nginx
location /uploads/ {
    alias /var/www/sfs_gallery/public/uploads/;
    expires 30d;
}
```

## Project structure

```
src/
  app/
    (site)/        public site (home, artists, events, about, blog, contact)
    admin/         admin portal (login + (panel) with sidebar)
    api/           auth, upload, contact, subscribe route handlers
  lib/             db, auth/session, settings, upload, slug helpers
  models/          Mongoose models
  proxy.js         admin route gate (Next 16 "proxy" = middleware)
scripts/
  seed-admin.mjs   create the first admin user
  migrate.mjs      import content from the old WordPress site
```
