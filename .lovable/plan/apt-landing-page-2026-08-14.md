# apt — Landing Page

A single, fast landing page for apt: an AI shopping agent that shows you how things look on you before you buy. Design pulled directly from the apt design system on Replit: near-greyscale chrome, one cyan "signal" accent, Schibsted Grotesk.

The name is always lowercase — `apt`, never "Apt" — everywhere in copy, metadata, and UI. The app wordmark renders as `apt.` with the period.

## Design foundation (taken from the design system)

- Type: Schibsted Grotesk via Google Fonts link in the root route head. Tight display tracking (-0.035em), large scale up to 88px.
- Color: near-greyscale chrome (grey-0 to grey-10) with the single cyan signal ramp (wash / soft / signal / press / ink / deep) as the only accent. Page sits on grey-1, cards are white (grey-0) with subtle borders and the card shadow. Product imagery is the only other saturated thing on the page.
- Buttons are pill-shaped (radius-pill) across all four variants: solid ink, agent cyan, outline, ghost. Chips and tags likewise.
- Agent notes keep their tonal treatment: cyan-wash background with a cyan-soft border and a small cyan label ("I NOTICED", "MY REASONING", "I LEARNED"), plus the neutral grey variant for "NOT SURE".
- Surfaces, borders, radii (4/8/12/16/28/pill), shadows (card / raise / sheet), motion easing and durations, and the focus ring all get ported as tokens into `src/styles.css`.


## Page structure (one route, `/`)

1. **Header** — `apt.` wordmark, anchor links, pill "Get early access" button that scrolls to the form.
2. **Hero** — H1 reads **apt, where shopping is about you**, with `apt` set in the wordmark treatment. Short subline on the try-it-on idea, inline email capture, and a phone mockup showing the feed carousel.
3. **The problem / principle** — a short editorial band: don't centralize the marketplace, centralize the shopper.
4. **How it works** — the real-life shopping loop as four beats: walk in (open the feed) → see it → try it on you → keep it or scroll away.
5. **Three tabs** — one card per tab with a phone mockup:
   - **Fitting Room** — a scrollable feed of product carousels where image one is the product and the rest are you wearing it, ranked by a For You algorithm.
   - **apt** — your personal shopping agent, shown with her own agent mark (see Marks below). Feminine, visual-first: she answers with pictures of products on you, not paragraphs.
   - **Profile** — interests, your photos to sharpen try-on, and situational boards (e.g. a Puerto Rico trip board) you fill and buy from later.
6. **How it looks on you** — a dedicated band on the try-on system with a before/after style pair of images.
7. **Team** — image cards: portrait photo, name, role. Robel Bruk (CEO), Robel Kebede (CTO). Placeholder portraits ship now, sourced from a single `team` data array with an image path per member so real photos are a one-file swap.
8. **Signup** — email capture with client-side validation and a success state. Nothing is stored yet; the submit handler is isolated in one place so Resend can be wired in later without touching the UI.
9. **Footer** — `apt.` wordmark, anchors, privacy and terms links, copyright.

Plus `/privacy` and `/terms` as plain, short legal stubs.

## Marks

- **App wordmark**: `apt.` — typeset, lowercase, tight tracking, the period in cyan signal. No image file needed; also drives the favicon.
- **Agent mark**: a distinct symbol for apt-the-agent — a soft, feminine cyan glyph (a rounded four-point spark/petal form in the signal ramp) used wherever she speaks: the agent tab card, the agent notes, and the AI section. Generated as a transparent PNG so it can sit on any surface.

## Imagery

AI-generated editorial imagery: a hero try-on frame, three mockup images (one per tab), a product/on-you pair for the try-on band, and two neutral team portraits. Muted, editorial, natural light — the imagery carries all the color.


## Technical notes

- TanStack Start, one route file per page under `src/routes`. Sections live as small components under `src/components/landing/`, one file each, no giant page file.
- All design-system tokens go into `src/styles.css` (oklch, mapped through `@theme inline`). No hardcoded colors in components.
- Buttons/chips/tags/AgentNote get built as small local variant components (cva) so the design system's four variants are exact rather than approximated.
- Motion is CSS-only: token-driven easing, scroll-reveal via IntersectionObserver, press-scale on buttons. No animation library, no heavy dependencies.
- Signup form: React 19 `useActionState` with a single `submitWaitlist` function that currently resolves locally — the Resend/Cloud swap happens inside that one function.
- SEO: unique title, description, og/twitter tags on the landing route; semantic sections, single H1, alt text, lazy-loaded imagery below the fold.
