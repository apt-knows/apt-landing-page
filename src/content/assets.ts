/**
 * ASSET REGISTRY
 * ------------------------------------------------------------------
 * Every image used on the landing page is imported exactly once, here.
 * Components never import from `@/assets` directly — they read from this
 * registry. To swap a placeholder for a real photo:
 *
 *   1. Drop the file into `src/assets/` (or `src/assets/products/`).
 *   2. Change the import path below. Nothing else has to move.
 *
 * Product photos are 3:4 (800x1066). Credits: src/assets/products/CREDITS.md.
 */

// Brand — the assistant mark, vector so it stays crisp at every size.
// Overwrite the file (keep the name) to change the icon site-wide.
import assistantIcon from "@/assets/assistant-icon.svg";

// Team portraits — square (1:1), ideally 768x768 or larger.
import teamCeo from "@/assets/team-ceo.jpg";
import teamCto from "@/assets/team-cto.jpg";

// Board thumbnails — portrait (3:4).
import boardTrip from "@/assets/board-puerto-rico.jpg";

// Product wall + situation picks — portrait (3:4).
import knitCream from "@/assets/feed/a-product.jpg";
import sneakerCourt from "@/assets/feed/b-product.jpg";
import bagShoulder from "@/assets/feed/c-product.jpg";
import backpackGrey from "@/assets/products/backpack-hike.jpg";
import beanieMustard from "@/assets/products/beanie-yellow.jpg";
import blanketsKnit from "@/assets/products/blanket-wool.jpg";
import bottlesInsulated from "@/assets/products/bottle-green.jpg";
import camera35mm from "@/assets/products/camera-film.jpg";
import candlesAmber from "@/assets/products/candle.jpg";
import capWhite from "@/assets/products/cap-cord.jpg";
import grinderCopper from "@/assets/products/grinder-coffee.jpg";
import headphonesBlack from "@/assets/products/headphones.jpg";
import jacketDenim from "@/assets/products/jacket-denim.jpg";
import kettleCream from "@/assets/products/kettle.jpg";
import lampOrange from "@/assets/products/lamp-desk.jpg";
import mugSpeckled from "@/assets/products/mug-ceramic.jpg";
import pillowLinen from "@/assets/products/pillow-throw.jpg";
import planterTerracotta from "@/assets/products/planter.jpg";
import runnerTeal from "@/assets/products/runner-red.jpg";
import bootsHiking from "@/assets/products/shoe-trail.jpg";
import longboardBlue from "@/assets/products/skateboard.jpg";
import sneakerGrey from "@/assets/products/sneaker-white.jpg";
import socksWool from "@/assets/products/socks-wool.jpg";
import sunglassesRound from "@/assets/products/sunglasses.jpg";
import bagLeather from "@/assets/products/tote-canvas.jpg";
import watchSteel from "@/assets/products/watch-field.jpg";

export const assets = {
  brand: {
    assistantIcon,
  },
  team: {
    ceo: teamCeo,
    cto: teamCto,
  },
  boards: {
    trip: boardTrip,
  },
  /** Product-only studio shots used by the wall and the situation demo. */
  products: {
    knitCream,
    sneakerCourt,
    bagShoulder,
    backpackGrey,
    beanieMustard,
    blanketsKnit,
    bottlesInsulated,
    camera35mm,
    candlesAmber,
    capWhite,
    grinderCopper,
    headphonesBlack,
    jacketDenim,
    kettleCream,
    lampOrange,
    mugSpeckled,
    pillowLinen,
    planterTerracotta,
    runnerTeal,
    bootsHiking,
    longboardBlue,
    sneakerGrey,
    socksWool,
    sunglassesRound,
    bagLeather,
    watchSteel,
  },
} as const;
