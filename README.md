# Argiropoulos Law

Greek-first Next.js website for the law office of Fotios Argiropoulos. WordPress is an immutable migration source, not a runtime dependency.

## Local development

```bash
npm install
npm run dev
```

The site uses licensed local Inter and Comfortaa font files, local imagery, server-side SMTP delivery, and standalone output for Papaki/Plesk.

## Verification

```bash
npm run lint
npm run typecheck
npm run test
npm run verify:sprint-12
npm run build
```

See `DEPLOYMENT.md` for the rollback-safe Papaki/Plesk owner handoff.
