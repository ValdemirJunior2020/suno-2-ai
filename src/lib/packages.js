// src/lib/packages.js

export const DEFAULT_PACKAGE_ID = "standard";

/**
 * Available packages for checkout
 * NOTE:
 * - We REMOVED "premium"
 * - Only Standard Song + Lyric Video remain
 */
export const PACKAGES = [
  {
    id: "standard",
    label: "Standard Song",
    description: "1 personalized AI song (audio only)",
    priceUSD: 10,
    type: "song",
  },
  {
    id: "video",
    label: "Lyric Video ($20)",
    description: "Personalized lyric video with synced lyrics",
    priceUSD: 20,
    type: "video",
  },
];

/**
 * Helper to get a package by id
 */
export function getPackageById(id) {
  return PACKAGES.find((p) => p.id === id) || PACKAGES[0];
}
