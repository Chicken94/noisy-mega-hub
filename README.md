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
