/* GENERATED FROM tokens.json -- DO NOT EDIT. Run scripts/build-tokens.mjs. */
// Portable design tokens (colors as hex). Web consumes the theme via
// src/index.css; mobile (Expo) and any other platform import this object so the
// whole product shares one source of truth.
export const tokens = {
  "color": {
    "light": {
      "background": "#fff8f2",
      "foreground": "#2a171b",
      "border": "#ead7d6",
      "card": "#ffffff",
      "cardForeground": "#2a171b",
      "popover": "#ffffff",
      "popoverForeground": "#2a171b",
      "primary": "#d62849",
      "primaryForeground": "#ffffff",
      "secondary": "#f4b942",
      "secondaryForeground": "#2a171b",
      "muted": "#f7e9e7",
      "mutedForeground": "#785c62",
      "accent": "#fde4ea",
      "accentForeground": "#8f1d3b",
      "destructive": "#b42318",
      "destructiveForeground": "#ffffff",
      "input": "#e4cbcd",
      "ring": "#d62849",
      "chart1": "#d62849",
      "chart2": "#0f8b8d",
      "chart3": "#6c4ab6",
      "chart4": "#f4b942",
      "chart5": "#e76f51",
      "sidebar": "#fff1ef",
      "sidebarForeground": "#4d2a31",
      "sidebarBorder": "#ead7d6",
      "sidebarPrimary": "#d62849",
      "sidebarPrimaryForeground": "#ffffff",
      "sidebarAccent": "#f8dfe3",
      "sidebarAccentForeground": "#8f1d3b",
      "sidebarRing": "#d62849"
    },
    "dark": {
      "background": "#1c0a10",
      "foreground": "#fff8f2",
      "border": "#52202c",
      "card": "#260e16",
      "cardForeground": "#fff8f2",
      "popover": "#260e16",
      "popoverForeground": "#fff8f2",
      "primary": "#f04d6b",
      "primaryForeground": "#2a0b12",
      "secondary": "#f4b942",
      "secondaryForeground": "#2a171b",
      "muted": "#3b1823",
      "mutedForeground": "#d9aeb5",
      "accent": "#4a1b2a",
      "accentForeground": "#ffe8ed",
      "destructive": "#8f1d2c",
      "destructiveForeground": "#fff8f2",
      "input": "#5a2430",
      "ring": "#ff7a92",
      "chart1": "#f04d6b",
      "chart2": "#36b7a8",
      "chart3": "#a88ae8",
      "chart4": "#f4b942",
      "chart5": "#f28b6a",
      "sidebar": "#260e16",
      "sidebarForeground": "#ffe8ed",
      "sidebarBorder": "#52202c",
      "sidebarPrimary": "#f04d6b",
      "sidebarPrimaryForeground": "#ffffff",
      "sidebarAccent": "#4a1b2a",
      "sidebarAccentForeground": "#ffe8ed",
      "sidebarRing": "#ff7a92"
    }
  },
  "fontFamily": {
    "sans": [
      "Space Grotesk",
      "sans-serif"
    ],
    "serif": [
      "Lora",
      "serif"
    ],
    "mono": [
      "Geist Mono",
      "monospace"
    ]
  },
  "radius": "0.75rem",
  "spacing": "0.25rem"
} as const;

export type Tokens = typeof tokens;
export default tokens;
