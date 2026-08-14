/**
 * IN-APP DEMO DATA
 * ------------------------------------------------------------------
 * Everything shown inside the phone mockups (Fitting Room feed, the apt
 * agent conversation, the profile tab) is mock content and lives here.
 * Change copy, prices, boards or the demo user without opening a component.
 */

import { assets } from "./assets";

/** The person all try-on imagery is generated for. */
export const demoUser = {
  name: "Maya R.",
  meta: "New York · Fit model ready",
  avatar: assets.uploads.three,
  stats: [
    { value: "6", label: "photos" },
    { value: "3", label: "boards" },
    { value: "128", label: "saved" },
  ],
  sizes: "Sizes · M / 9",
  budget: "Budget · $80–$300",
} as const;

export type Frame = {
  src: string;
  label: string;
  alt: string;
  /** True when the frame is an AI "how it looks on you" render. */
  generated?: boolean;
};

export type FeedItem = {
  name: string;
  price: string;
  store: string;
  frames: Frame[];
};

export const feed: FeedItem[] = [
  {
    name: "Ribbed knit crewneck",
    price: "$128",
    store: "Everlane",
    frames: [
      {
        src: assets.product.knit,
        label: "Product",
        alt: "A cream ribbed knit crewneck photographed on its own",
      },
      {
        src: assets.onYou.knit1,
        label: "How it looks on you",
        alt: "The crewneck rendered on Maya, facing forward",
        generated: true,
      },
      {
        src: assets.onYou.knit2,
        label: "How it looks on you",
        alt: "The crewneck rendered on Maya, side angle",
        generated: true,
      },
    ],
  },
  {
    name: "Leather low-top sneaker",
    price: "$210",
    store: "COS",
    frames: [
      {
        src: assets.product.sneaker,
        label: "Product",
        alt: "White leather low-top sneakers",
      },
      {
        src: assets.onYou.sneaker1,
        label: "How it looks on you",
        alt: "The sneakers rendered on Maya, full length",
        generated: true,
      },
      {
        src: assets.onYou.sneaker2,
        label: "How it looks on you",
        alt: "The sneakers rendered on Maya, low angle",
        generated: true,
      },
    ],
  },
  {
    name: "Structured shoulder bag",
    price: "$340",
    store: "Arket",
    frames: [
      {
        src: assets.product.bag,
        label: "Product",
        alt: "A tan leather structured shoulder bag",
      },
      {
        src: assets.onYou.bag1,
        label: "How it looks on you",
        alt: "The bag rendered on Maya over a black coat",
        generated: true,
      },
      {
        src: assets.onYou.bag2,
        label: "How it looks on you",
        alt: "The bag rendered on Maya, back angle",
        generated: true,
      },
    ],
  },
];

/** The apt agent conversation shown in the first tab. */
export const agentDemo = {
  prompt: "something for a rainy commute",
  hero: {
    src: assets.rain.trench,
    alt: "A water-resistant trench and rain boots shown on Maya",
    caption: "Water-resistant trench · on you",
  },
  results: [
    {
      src: assets.rain.boots,
      alt: "Black waterproof rain boots shown on Maya",
      caption: "Rain boots",
      objectPosition: "center" as const,
    },
    {
      src: assets.rain.shell,
      alt: "An olive hooded rain shell shown on Maya",
      caption: "Rain shell",
      objectPosition: "top" as const,
    },
  ],
  chips: ["Under $250", "More like this"],
  learned: {
    label: "I learned",
    text: "You keep water-resistant over wool. Showing those first.",
  },
  followUp: "save the boots to my commute board",
  saved: {
    src: assets.rain.boots,
    alt: "Rain boots saved to a board",
    board: "Rainy commute",
  },
  placeholder: "Ask apt anything",
} as const;

/** Profile tab mock content. */
export const profileDemo = {
  photos: [
    { src: assets.uploads.one, alt: "A photo Maya uploaded of herself, facing forward" },
    { src: assets.uploads.two, alt: "A second photo Maya uploaded, side angle" },
    { src: assets.uploads.three, alt: "A third photo Maya uploaded, close up" },
  ],
  styles: [
    { label: "Quiet luxury", on: true },
    { label: "Workwear", on: true },
    { label: "Neutrals", on: true },
    { label: "Streetwear", on: false },
    { label: "Tailored", on: false },
  ],
  boards: [
    { src: assets.boards.trip, name: "Puerto Rico trip", count: "14 saved" },
    { src: assets.onYou.sneaker1, name: "Everyday rotation", count: "26 saved" },
  ],
  settings: [
    { label: "Try-on generation", value: "On", accent: true },
    { label: "Orders & returns", value: "2 active", accent: false },
    { label: "Notifications", value: "Drops only", accent: false },
  ],
} as const;

