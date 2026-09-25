# Argiropoulos Law sprints

Status values: `planned`, `active`, `implemented`, `verified`, `blocked`.

| Sprint | Scope | Status | Verification |
| --- | --- | --- | --- |
| 00 | Repository rules, scripts, architecture, baseline checks | verified | Lint, typecheck, tests, and production build passed 2026-09-25 |
| 01 | Read-only WordPress WXR inspection and quarantine report | verified | 117 records and 85 media reconciled; 8 review flags |
| 02 | Reviewed media manifest, bounded downloader, local image reconciliation | implemented | Download intentionally gated pending manifest review |
| 03 | Local fonts, solid-color design tokens, bounded heading scale, motion/accessibility foundation | verified | Lint, typecheck, tests, and production build passed 2026-09-25 |
| 04 | Greek header, mobile navigation, footer | verified | Desktop/mobile browser check, navy custom scrollbar, zero horizontal overflow, lint, typecheck, and build passed 2026-09-25 |
| 05 | Accessible homepage hero slider with centered copy and mid-left/mid-right controls | verified | Images local; keyboard/swipe/pause/reduced-motion contracts implemented; browser check passed 2026-09-25 |
| 06 | Homepage editorial sections, legal-services index, testimonials, office story, process and contact CTA | verified | Reference-aligned desktop/browser review; zero horizontal overflow; valid fill-image geometry; lint, tests, TypeScript build passed 2026-09-25 |
| 07 | Inner Greek pages, content reconciliation and homepage spacing refinement | verified | Six static Greek routes, centered shared heroes, reconciled content, responsive browser checks, lint, tests and build passed 2026-09-25 |
| 08 | Structured practice-area content and disclaimers | verified | Nine XML-reconciled service routes, four-or-more topic cards, LegalService data, enriched metadata and disclaimers; lint and production build passed 2026-09-25 |
| 09 | Approved testimonials or intentionally hidden section | verified | Merged into Sprint 06 using three published testimonials reconciled from the WordPress export |
| 10 | Contact workflow and privacy controls | implemented | Server-side SMTP delivery, validation, consent, honeypot, rate limiting and privacy disclosure pass local checks; live Papaki SMTP send pending rotated secret and owner-run environment configuration |
| 11 | Metadata, structured data, legacy redirects | verified | Canonicals, social metadata, LegalService schema, nine-service sitemap, robots and WXR-backed 308 redirects; lint, TypeScript, tests, build and live HTTP checks passed 2026-09-25 |
| 12 | Accessibility, performance, responsive/browser acceptance | verified | Owner-run browser acceptance passed 16 public routes at desktop and mobile widths, including reduced motion, skip navigation, menu focus/Escape behavior, form relationships, images, headings and overflow on 2026-09-25 |
| 13 | Greek release candidate and rollback-safe launch package | verified | Standalone build/start, production preflight, local liveness and four-route smoke checks passed; 128-entry release archive contained all required deployment files and no secrets, builds, dependencies, SQL/XML exports or nested artifacts; SHA-256 verified 2026-09-25 |
| 14 | Complete reviewed English locale | planned | Deferred |

## Current gate

Review the generated WordPress and media reports before allowing any media download. No WordPress record has been published or downloaded by these scripts.
