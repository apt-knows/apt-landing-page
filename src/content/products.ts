/**
 * PRODUCT DATA
 * ------------------------------------------------------------------
 * A small, tagged product universe used by the hero fan and the
 * end-to-end flow demo. Everything here is demo content — swap freely
 * without touching components.
 */

import { assets } from "./assets";

const p = assets.products;

/** Loose taste metadata; kept for future demos. */
export type TasteTag = "minimal" | "streetwear" | "outdoorsy" | "cozy" | "classic";

export type Product = {
  id: string;
  name: string;
  store: string;
  /** Whole dollars. Formatted at render time, tabular-nums. */
  price: number;
  tags: TasteTag[];
  image: string;
  alt: string;
};

export const products: Product[] = [
  {
    id: "runner-teal",
    name: "Trail runners, teal",
    store: "Salomon",
    price: 140,
    tags: ["outdoorsy", "streetwear"],
    image: p.runnerTeal,
    alt: "Teal and cream trail running shoe held against a blue sky",
  },
  {
    id: "knit-cream",
    name: "Ribbed knit crewneck",
    store: "Everlane",
    price: 128,
    tags: ["minimal", "cozy"],
    image: p.knitCream,
    alt: "Cream ribbed knit crewneck laid flat on a grey background",
  },
  {
    id: "lamp-orange",
    name: "Task lamp, tangerine",
    store: "HAY",
    price: 195,
    tags: ["minimal"],
    image: p.lampOrange,
    alt: "Orange articulated desk lamp on a dark block",
  },
  {
    id: "socks-wool",
    name: "Wool socks, 3-pack",
    store: "Darn Tough",
    price: 48,
    tags: ["outdoorsy", "cozy"],
    image: p.socksWool,
    alt: "Stack of red, blue, and navy wool socks on a wooden shelf",
  },
  {
    id: "headphones-black",
    name: "Over-ear headphones",
    store: "Sony",
    price: 348,
    tags: ["minimal", "streetwear"],
    image: p.headphonesBlack,
    alt: "Black over-ear headphones on a white background",
  },
  {
    id: "beanie-mustard",
    name: "Wool beanie, mustard",
    store: "Carhartt",
    price: 30,
    tags: ["streetwear", "outdoorsy"],
    image: p.beanieMustard,
    alt: "Mustard yellow knit beanie on an amber background",
  },
  {
    id: "bag-shoulder",
    name: "Leather shoulder bag",
    store: "Madewell",
    price: 168,
    tags: ["classic", "minimal"],
    image: p.bagShoulder,
    alt: "Tan pebbled leather shoulder bag on a white background",
  },
  {
    id: "kettle-cream",
    name: "Pour-over kettle",
    store: "Fellow",
    price: 165,
    tags: ["minimal", "cozy"],
    image: p.kettleCream,
    alt: "Cream gooseneck pour-over kettle on a cream background",
  },
  {
    id: "longboard-blue",
    name: "Cruiser longboard",
    store: "Globe",
    price: 120,
    tags: ["streetwear"],
    image: p.longboardBlue,
    alt: "Light blue cruiser longboard with red wheels on a blue background",
  },
  {
    id: "sneaker-court",
    name: "Leather court sneakers",
    store: "Adidas",
    price: 100,
    tags: ["minimal", "streetwear"],
    image: p.sneakerCourt,
    alt: "White leather court sneakers on a white background",
  },
  {
    id: "blankets-knit",
    name: "Merino wool throw",
    store: "Brooklinen",
    price: 145,
    tags: ["cozy", "classic"],
    image: p.blanketsKnit,
    alt: "Folded stack of brown and taupe knit throws",
  },
  {
    id: "camera-35mm",
    name: "35mm film camera",
    store: "Kodak",
    price: 65,
    tags: ["classic"],
    image: p.camera35mm,
    alt: "Vintage Kodak 35mm film camera on a white background",
  },
  {
    id: "bottles-insulated",
    name: "Insulated bottle",
    store: "Hydro Flask",
    price: 45,
    tags: ["outdoorsy"],
    image: p.bottlesInsulated,
    alt: "Orange, teal, and pink insulated bottles floating on a green background",
  },
  {
    id: "jacket-denim",
    name: "Denim trucker jacket",
    store: "Levi's",
    price: 98,
    tags: ["streetwear", "classic"],
    image: p.jacketDenim,
    alt: "Denim trucker jacket laid flat with accessories",
  },
  {
    id: "planter-terracotta",
    name: "Terracotta planter",
    store: "The Sill",
    price: 38,
    tags: ["minimal", "cozy"],
    image: p.planterTerracotta,
    alt: "Succulent in a terracotta planter on a white tray",
  },
  {
    id: "watch-steel",
    name: "Steel field watch",
    store: "Timex",
    price: 129,
    tags: ["classic", "minimal"],
    image: p.watchSteel,
    alt: "Stainless steel field watch with a white dial",
  },
  {
    id: "pillow-linen",
    name: "Linen throw pillow",
    store: "Parachute",
    price: 70,
    tags: ["cozy", "minimal"],
    image: p.pillowLinen,
    alt: "White linen throw pillow on a grey knit blanket",
  },
  {
    id: "sneaker-grey",
    name: "Everyday running shoe",
    store: "Nike",
    price: 90,
    tags: ["streetwear", "minimal"],
    image: p.sneakerGrey,
    alt: "Grey Nike running shoe photographed on a white background",
  },
  {
    id: "grinder-copper",
    name: "Hand grinder, copper",
    store: "Hario",
    price: 75,
    tags: ["classic", "cozy"],
    image: p.grinderCopper,
    alt: "Copper hand coffee grinder with scattered coffee beans",
  },
  {
    id: "sunglasses-round",
    name: "Round sunglasses",
    store: "Ray-Ban",
    price: 161,
    tags: ["classic", "minimal"],
    image: p.sunglassesRound,
    alt: "Round gold-frame sunglasses on a white surface",
  },
  {
    id: "boots-hiking",
    name: "Leather hiking boots",
    store: "Danner",
    price: 240,
    tags: ["outdoorsy", "classic"],
    image: p.bootsHiking,
    alt: "Brown leather hiking boots on a wooden deck",
  },
  {
    id: "candles-amber",
    name: "Amber candle set",
    store: "P.F. Candle Co.",
    price: 58,
    tags: ["cozy"],
    image: p.candlesAmber,
    alt: "Set of amber glass candles and a diffuser on white pedestals",
  },
  {
    id: "backpack-grey",
    name: "Commuter backpack",
    store: "Herschel",
    price: 110,
    tags: ["minimal", "outdoorsy", "streetwear"],
    image: p.backpackGrey,
    alt: "Grey commuter backpack propped on a black chair",
  },
  {
    id: "mug-speckled",
    name: "Speckled stoneware mug",
    store: "East Fork",
    price: 42,
    tags: ["cozy", "minimal"],
    image: p.mugSpeckled,
    alt: "Speckled stoneware mug styled with art books",
  },
  {
    id: "cap-white",
    name: "Six-panel cap",
    store: "Uniqlo",
    price: 25,
    tags: ["minimal", "streetwear"],
    image: p.capWhite,
    alt: "Plain white six-panel cap on a grey background",
  },
  {
    id: "bag-leather",
    name: "Structured leather bag",
    store: "Fossil",
    price: 178,
    tags: ["classic"],
    image: p.bagLeather,
    alt: "Brown structured leather handbag on a white background",
  },
];

const byId = new Map(products.map((product) => [product.id, product]));

/** Resolve a product id. Throws in dev if demo content drifts. */
export function getProduct(id: string): Product {
  const product = byId.get(id);
  if (!product) throw new Error(`Unknown product id: ${id}`);
  return product;
}

export type HeroMoment = {
  /** Tail of the hero headline. Must fit one line on a 375px screen. */
  phrase: string;
  /** The three products fanned under the headline for this phrase. */
  productIds: [string, string, string];
};

/**
 * The hero rotates through these: the headline phrase and the image fan
 * change together, so "for you" is shown, not claimed. The first moment
 * is the resting one for screen readers and reduced motion.
 */
export const heroMoments: HeroMoment[] = [
  { phrase: "you.", productIds: ["knit-cream", "sneaker-court", "bag-shoulder"] },
  { phrase: "snow trips.", productIds: ["beanie-mustard", "socks-wool", "bottles-insulated"] },
  { phrase: "your brother.", productIds: ["grinder-copper", "camera-35mm", "longboard-blue"] },
  { phrase: "rainy days.", productIds: ["boots-hiking", "blankets-knit", "mug-speckled"] },
  { phrase: "new places.", productIds: ["kettle-cream", "lamp-orange", "planter-terracotta"] },
];
