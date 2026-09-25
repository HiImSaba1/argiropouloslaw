# Argiropoulos Law architecture

This Next.js application is the Greek-first public website for the law office of Fotios Argiropoulos. Greek is the only public locale in the initial release; English routing and a language switcher remain out of scope until complete, reviewed translations exist.

## Product boundaries

- App Router and strict TypeScript.
- Server Components by default. Client Components are limited to navigation, sliders, route transitions, and other genuine browser interactions.
- WordPress is an immutable migration source, not a runtime dependency.
- Imported content and media remain review-only until explicitly approved.
- Public media lives below `public/images`, grouped by purpose. Runtime URLs must never contain `wp-content`.
- Inter is the display face. Comfortaa is the content and interface face. Both load from the licensed local files in `public/fonts`.
- Visual surfaces use solid colors only. Gradients are not part of the design system. Navy, ink, paper, and white form the core palette.
- Heading sizes use bounded responsive clamps; page titles must remain editorial without overwhelming smaller screens.
- GSAP owns orchestrated editorial animation, Motion owns isolated component/layout interaction, and CSS owns simple state changes. Two systems must not animate the same property on one element.
- Every animation must preserve content access and honor `prefers-reduced-motion`.

## Reference projects

The Sabaweb, Alana FC Academy, and Rusee Kimono projects are visual and engineering references only. Their identity, copy, data, credentials, routes, and deployment settings must not be copied.

- Sabaweb: public header/footer language and inner-page hero/about composition.
- Alana FC Academy: accessible homepage carousel and logo/metadata workflow.
- Rusee Kimono: services-section rhythm and route-transition behavior.

## Homepage slider contract

- Adapt the Alana carousel behavior, not its left-aligned composition.
- Center the eyebrow, title, supporting copy, and primary action within every slide.
- Place previous and next controls at the vertical center of the left and right edges.
- Preserve keyboard arrows, swipe gestures, visible focus, pause on hover/focus, document-visibility handling, and reduced-motion behavior.

## Content and privacy

- The WordPress WXR is inspected without database or public-content writes.
- Builder markup, scripts, encoded embeds, demo navigation, and third-party canonicals require quarantine or manual review.
- Testimonials require explicit publication approval; absence of approval means absence from the site.
- Contact forms collect the minimum useful data and must not invite confidential evidence uploads.
- No message body, credential, secret, or personal data may be printed in routine logs or verification artifacts.

## Verification contract

Each sprint is complete only after its focused tests plus lint, typecheck, and production build pass. Browser-facing work additionally requires keyboard, mobile, reduced-motion, and missing/error-state checks.
