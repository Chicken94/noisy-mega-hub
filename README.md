# Noisy Studio Mega Hub

Portfolio + private work dashboard for **noisystudio.com.au**.
Built with Next.js. Hosted on Replit. Code changes are made with Claude and pushed here.

## Edit the site
The home page is `app/page.tsx` (countdown to 1 Jan 2027) with styles in `app/globals.css`.
Portfolio content for later lives in `content/site.ts` (not published yet).

## Run on Replit
1. Replit → **Create App → Import from GitHub** → `Chicken94/noisy-mega-hub`.
2. **Tools → Secrets**: add `DASHBOARD_USER` and `DASHBOARD_PASSWORD` (they protect `/dashboard`).
3. Press **Run** to preview.
4. **Deploy → Autoscale** (build and run commands come from `.replit`).
5. Deployment → **Settings → Link a domain** → `noisystudio.com.au`, then add the DNS records Replit shows at your registrar.

## Release routine
Ask Claude for a change → Claude pushes to `main` → in Replit, pull the latest code (Git pane) and click **Redeploy**.

## Structure
- `app/page.tsx` — home page (coming soon + countdown)
- `app/dashboard/` — private Mega Hub (password-protected by `proxy.ts`)
- `app/api/health` — health check for monitoring

## Client hub (noisystudio.com.au/clients)
- Login: single-use invite links (no passwords). Admin creates people in **/admin** and copies their link.
- Roles: **admin** (everything), **team** (ticks tasks for assigned clients), **client** (sees only their brand, read only).
- Data: Postgres (`DATABASE_URL`). Tables are created automatically (`db/schema.sql`).
- First start: `scripts/bootstrap.mjs` imports `seed/*.enc` (needs `SEED_KEY`) and prints an admin sign-in link for `ADMIN_EMAIL` in the deployment logs until that admin signs in once.
- Manual: `npm run invite -- email "Name" admin` prints a new sign-in link.

## Email room (noisystudio.com.au/email)
- Admin only. After the site's admin sign-in it forwards to Daniel's private Claude page (which also needs his Claude sign-in).
- Set the address in **Replit → Secrets** as `EMAIL_HUB_URL`. Never put it or any email content in this repo (it's public).
