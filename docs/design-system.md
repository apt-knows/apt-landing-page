# Apt design system

Apt is an AI shopping agent. Products are the only colorful things on screen.
Chrome is near-greyscale. The single accent (cyan) means exactly two things:
Apt is speaking/thinking, or this is the one primary action.

All tokens are implemented in `src/theme/index.ts`. Pilot components live in
`src/components/ui/`. This document is the source spec.

## Color

Neutrals — cool-axis, near-zero chroma. Never warm grey (it tints product photos).

| token  | hex     |     | token   | hex     |
| ------ | ------- | --- | ------- | ------- |
| grey-0 | #FAFAFA |     | grey-5  | #C0C0C2 |
| grey-1 | #F7F7F8 |     | grey-6  | #9E9EA1 |
| grey-2 | #F2F2F3 |     | grey-7  | #727275 |
| grey-3 | #EBEBEC |     | grey-8  | #444447 |
| grey-4 | #E7E7E8 |     | grey-10 | #202022 |

Signal (the one accent): wash #EAF8F8 · soft #B8ECEC · signal #00C4C4 ·
press #00AEAE · ink #007A7A · deep #004444

Alert pair — genuine errors only: alert #D44C2A · alert-wash #FBF0ED.
No success green. Money is always ink, never colored.

Semantic roles:

- Surfaces: page=grey-1, card=grey-0, sunken=grey-2, inverse=grey-10, agent=signal-wash
- Text: primary=grey-10, secondary=grey-7, muted=grey-6, disabled=grey-5, inverse=grey-0, agent=signal-ink, alert=alert
- Borders: subtle=grey-4, strong=grey-3, focus=signal, agent=signal-soft

## Typography

One family only: Schibsted Grotesk 400/500/600/700. No second family, no mono, no italic.

- Scale: 11 · 12 · 13 · 15 · 17 · 20 · 24 · 30 · 38 · 48 · 64 · 88px
- Tracking: display −0.035em · heading −0.022em · tight −0.012em · label (uppercase only) +0.13em
- Sentence case everywhere except 11px eyebrow labels (uppercase)
- All prices/counts use `font-variant-numeric: tabular-nums`
- Hierarchy comes from weight and size — never a second family

## Space

4px base: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 56 · 72. Gutters: 20 mobile,
40 web. Minimum tap target: 44px.

## Shape

Soft rectangles for containers, pills for controls. Nothing between 16px and 28px.
xs=4 · sm=8 · md=12 · lg=16 · xl=28 · pill=999.

## Elevation

- card — 0 1px 2px black/4%
- raise — 0 4px 16px −6px black/12%
- sheet — 0 24px 60px −30px black/28%

## Motion

Short and flat. Nothing bounces, nothing overshoots.
instant=90ms · fast=160ms · base=240ms · slow=420ms ·
easing cubic-bezier(0.22, 0.61, 0.36, 1) out. Press scale 0.98.

## Components (pilot)

- **Button** — variants: primary (ink bg → signal on hover/press), agent (signal
  bg, always cyan), quiet (border only), ghost (no border). Sizes sm 36 / md 44 /
  lg 52. Pill radius. Sentence case always.
- **Chip** — 36px filter toggle. Selected: semibold weight + cyan 1.5px hairline
  ring. Optional tabular count.
- **Tag** — 24px static label. Tones: neutral (grey), agent (signal-wash bg,
  signal-ink text), alert (alert-wash bg, alert text).
- **Icon** — Lucide at 20px default, text-secondary color. Signal color only when
  the icon represents Apt itself (Sparkles, Send, MessageCircle).
- **AgentNote** — tinted surface, 11px uppercase eyebrow, one line of reasoning.
  Tones: noticed / reason / learned (signal-wash) and unsure (neutral grey).

## Rules

- The accent covers under 2% of any surface at any time
- No green, no success states, no urgency/sale colors
- No decorative illustration, no rounded avatars for the brand mark
- The wordmark is the word "Apt" in Schibsted Grotesk Bold — do not draw a logo mark
- Products are the hero. Chrome recedes.
