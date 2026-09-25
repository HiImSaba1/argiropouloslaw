# Papaki/Plesk release handoff

This document prepares a release; it does not authorize replacing or deleting the existing WordPress installation.

## Safety boundaries

- Keep the existing WordPress document root and database unchanged as rollback until the Next.js preview passes acceptance.
- Deploy the Next.js application into a separate application directory first.
- Configure production variables in Plesk or an untracked `.env.production.local`; never upload a real environment file inside the release archive.
- Use Node.js 22 consistently for install, build, and runtime.
- Do not upload local `node_modules` or `.next`; generate them on the Linux host.
- The current application does not read or write MySQL. `DATABASE_URL` is prepared for a future reviewed database sprint only.

## Owner-run gates

Run one phase at a time and inspect its output before continuing.

1. Create and verify a recoverable backup of the current site and database.
2. Upload and extract the release into a separate Papaki/Plesk application directory.
3. Configure the domain, Node.js 22, startup file `start.js`, production mode, and the reviewed environment variables.
4. Run `npm ci` on the host.
5. Run `npm run production:preflight`. It prints statuses but never secret values.
6. Run `npm run build` on the host.
7. Restart the Node application once.
8. Verify `/api/health/live`, the homepage, services, contact page, static assets, redirects, and one controlled contact submission.
9. Only after preview acceptance, schedule a separately approved cutover with the WordPress rollback retained.

## Health and smoke checks

The liveness endpoint is `GET /api/health/live`. It proves that the Next.js process can answer requests; it does not prove SMTP delivery or database readiness.

After DNS or cutover, run `npm run production:smoke`. For a preview hostname, set `PRODUCTION_SITE_URL` for that command.

SMTP acceptance is not inbox delivery. Confirm receipt in the intended mailbox and verify the Reply-To address with a controlled test submission.
