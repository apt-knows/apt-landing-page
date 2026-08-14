/**
 * ASSET REGISTRY
 * ------------------------------------------------------------------
 * Every image used on the landing page is imported exactly once, here.
 * Components never import from `@/assets` directly — they read from this
 * registry. To swap a placeholder for a real photo:
 *
 *   1. Drop the file into `src/assets/` (or `src/assets/feed/`).
 *   2. Change the import path below. Nothing else has to move.
 *
 * Keep the aspect ratios noted next to each group so layouts stay stable.
 */

// Team portraits — square (1:1), ideally 768x768 or larger.
import teamCeo from "@/assets/team-ceo.jpg";
import teamCto from "@/assets/team-cto.jpg";

// Fitting Room feed — portrait (3:4), 768x1152.
import knitProduct from "@/assets/feed/a-product.jpg";
import knitOnYou1 from "@/assets/feed/a-model-1.jpg";
import knitOnYou2 from "@/assets/feed/a-model-2.jpg";
import sneakerProduct from "@/assets/feed/b-product.jpg";
import sneakerOnYou1 from "@/assets/feed/b-model-1.jpg";
import sneakerOnYou2 from "@/assets/feed/b-model-2.jpg";
import bagProduct from "@/assets/feed/c-product.jpg";
import bagOnYou1 from "@/assets/feed/c-model-1.jpg";
import bagOnYou2 from "@/assets/feed/c-model-2.jpg";

// apt agent answer — portrait (3:4).
import rainTrench from "@/assets/feed/rain-look-1.jpg";
import rainBoots from "@/assets/feed/rain-look-2.jpg";
import rainShell from "@/assets/feed/rain-look-3.jpg";

// Profile boards — portrait (3:4).
import boardTrip from "@/assets/board-look.jpg";

export const assets = {
  team: {
    ceo: teamCeo,
    cto: teamCto,
  },
  /** Product-only shots (what the store photographs). */
  product: {
    knit: knitProduct,
    sneaker: sneakerProduct,
    bag: bagProduct,
  },
  /** "How it looks on you" renders — AI generated on the demo user. */
  onYou: {
    knit1: knitOnYou1,
    knit2: knitOnYou2,
    sneaker1: sneakerOnYou1,
    sneaker2: sneakerOnYou2,
    bag1: bagOnYou1,
    bag2: bagOnYou2,
  },
  /** The agent's answer to "something for a rainy commute". */
  rain: {
    trench: rainTrench,
    boots: rainBoots,
    shell: rainShell,
  },
  boards: {
    trip: boardTrip,
  },
} as const;
