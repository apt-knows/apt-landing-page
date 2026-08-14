# Apt — Landing Page

A single, fast landing page for Apt: an AI shopping agent that shows you how things look on you before you buy. Design pulled directly from the Apt design system on Replit: near-greyscale chrome, one cyan "signal" accent, Schibsted Grotesk.

## Design foundation (taken from the design system)

- Type: Schibsted Grotesk via Google Fonts link in the root route head. Tight display tracking (-0.035em), large scale up to 88px.
- Color: full neutral ramp (grey-0 to grey-10) plus the single cyan signal ramp (wash / soft / signal / press / ink / deep). Product imagery is the only saturated thing on the page — every other surface stays near-greyscale.
- Surfaces, borders, radii (4/8/12/16/28/pill), shadows (card / raise / sheet), motion easing and durations, and the focus ring all get ported as tokens into `src/styles.css`.
- Reused component language: the four button variants (solid ink, agent cyan, outline, ghost), chips with counts, tags, and the AgentNote block ("I NOTICED", "MY REASONING", "I LEARNED") — the AgentNote is used as Apt's own voice on the page.

## Page structure (one route, `/`)

1. **Header** — wordmark, anchor links, "Get early access" button that scrolls to the form.
2. **Hero** — "Products should find you, not the other way around." Short subline on the try-it-on idea, inline email capture, and a phone mockup showing the feed carousel.
3. **The problem / principle** — a short editorial band: don't centralize the marketplace, centralize the shopper.
4. **How it works** — the real-life shopping loop as four beats: walk in (open the feed) → see it → try it on you → keep it or scroll away.
5. **Three tabs** — one card per tab with a phone mockup:
   - **Fitting Room** — a scrollable feed of product carousels where image one is the product and the rest are you wearing it, ranked by a For You algorithm.
   - **Apt** — your personal shopping agent. Feminine, visual-first: she answers with pictures of products on you, not paragraphs.
   - **Profile** — interests, your photos to sharpen try-on, and situational boards (e.g. a Puerto Rico trip board) you fill and buy from later.
6. **How it looks on you** — a dedicated band on the try-on system with a before/after style pair of images.
7. **Team** — Robel Bruk (CEO), Robel Kebede (CTO).
8. **Signup** — email capture with client-side validation and a success state. Nothing is stored yet; the submit handler is isolated in one place so Resend can be wired in later without touching the UI.
9. **Footer** — wordmark, anchors, privacy and terms links, copyright.

Plus `/privacy` and `/terms` as plain, short legal stubs.

## Imagery

AI-generated editorial imagery: a hero try-on frame, three mockup images (one per tab), and a product/on-you pair for the try-on band. Muted, editorial, natural light — the imagery carries all the color.

## Technical notes

- TanStack Start, one route file per page under `src/routes`. Sections live as small components under `src/components/landing/`, one file each, no giant page file.
- All design-system tokens go into `src/styles.css` (oklch, mapped through `@theme inline`). No hardcoded colors in components.
- Buttons/chips/tags/AgentNote get built as small local variant components (cva) so the design system's four variants are exact rather than approximated.
- Motion is CSS-only: token-driven easing, scroll-reveal via IntersectionObserver, press-scale on buttons. No animation library, no heavy dependencies.
- Signup form: React 19 `useActionState` with a single `submitWaitlist` function that currently resolves locally — the Resend/Cloud swap happens inside that one function.
- SEO: unique title, description, og/twitter tags on the landing route; semantic sections, single H1, alt text, lazy-loaded imagery below the fold.
