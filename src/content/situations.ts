/**
 * FLOW DEMO SCRIPTS
 * ------------------------------------------------------------------
 * The "How apt works" flow plays one of these scripted exchanges:
 * you give the assistant a situation, it answers with three picks and
 * reasons, and the picks land on a board. Picks reference products
 * from `products.ts` by id.
 */

import { getProduct, type Product } from "./products";

export type Pick = {
  productId: string;
  /** One line of the assistant's reasoning, shown under the product. */
  reason: string;
};

export type Situation = {
  id: string;
  /** Chip label the visitor taps. */
  label: string;
  /** Name of the board the picks land on. */
  board: string;
  /** The visitor's message, verbatim. */
  userLine: string;
  /** The assistant's one-line read of the situation. */
  aptLine: string;
  picks: [Pick, Pick, Pick];
};

export const situations: Situation[] = [
  {
    id: "snowboard",
    label: "First snowboarding trip",
    board: "Snow trip",
    userLine: "First snowboarding trip next month. I own nothing.",
    aptLine:
      "Rent the board and boots on the mountain. Own the layers — that's where beginners get cold.",
    picks: [
      {
        productId: "beanie-mustard",
        reason: "Wool, low profile — fits under a rental helmet.",
      },
      {
        productId: "socks-wool",
        reason: "Wool, never cotton. Cotton is why toes go numb.",
      },
      {
        productId: "bottles-insulated",
        reason: "Water bottles freeze on the lift. Insulated ones don't.",
      },
    ],
  },
  {
    id: "gift",
    label: "Gift for my brother",
    board: "Dan's birthday",
    userLine: "Dan's birthday is Friday and I have no ideas.",
    aptLine:
      "You don't need ideas — Dan has them. He switched to pour-over in March and keeps sending you film photos.",
    picks: [
      {
        productId: "grinder-copper",
        reason: "The upgrade from the blade grinder he complains about.",
      },
      {
        productId: "camera-35mm",
        reason: "His current body jams. He's mentioned it twice.",
      },
      {
        productId: "longboard-blue",
        reason: "He walks twenty minutes to work and hates every one.",
      },
    ],
  },
  {
    id: "apartment",
    label: "Moving into a new place",
    board: "New place",
    userLine: "Just moved. Empty apartment, small budget.",
    aptLine: "Week one is kettle and light. Everything else can wait for the couch.",
    picks: [
      {
        productId: "kettle-cream",
        reason: "Covers coffee, tea, and instant everything on day one.",
      },
      {
        productId: "lamp-orange",
        reason: "Overhead light makes empty rooms feel emptier. This doesn't.",
      },
      {
        productId: "blankets-knit",
        reason: "The couch is weeks away. The floor picnic is tonight.",
      },
    ],
  },
];

/** Resolve a pick to its product. Throws at build time if an id drifts. */
export function pickProduct(pick: Pick): Product {
  return getProduct(pick.productId);
}
