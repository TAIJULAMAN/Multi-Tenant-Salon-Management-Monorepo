// Design tokens extracted from the employee Figma file (AUEHQ5PU7FddBMQMXfitlD).
// Values are the most frequently used fills, text styles, radii, borders and shadows.

export const colors = {
  primary: "#635BFF",
  primarySoft: "#DDDBFF",
  primaryTint: "#F3F3FF",
  primaryText: "#635BFF",

  text: "#29343D",
  textMuted: "#98A4AE",
  textSecondary: "#526B7A",
  textDark: "#0A2540",
  white: "#FFFFFF",

  // Surfaces
  page: "#FFFFFF",
  canvas: "#F4F7FB", // main content background behind cards
  card: "#FFFFFF",
  subtle: "#FAFAFA",
  subtleAlt: "#F6F7F9",
  sidebarDark: "#1D2738",

  border: "#E0E6EB",
  borderLight: "#EFF4FA",

  // Accents
  teal: "#16CDC7",
  tealSoft: "#ECFDFD",
  yellow: "#FFD648",
  yellowSoft: "#FFF9E5",
  amber: "#FFDE75",
  pink: "#FF6692",
  pinkSoft: "#FFE5ED",
  red: "#FF3E6C",
  blue: "#2F8FFF",
  blueDark: "#3E6DC1",
  green: "#36C76C",
} as const;

export const fonts = {
  regular: "Manrope_400Regular",
  medium: "Manrope_500Medium",
  semibold: "Manrope_600SemiBold",
  bold: "Manrope_700Bold",
} as const;

export const typography = {
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20, color: colors.text },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 19, color: colors.text },
  bodyLarge: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 20, color: colors.text },
  caption: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16, color: colors.textMuted },
  captionStrong: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16, color: colors.text },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 16, lineHeight: 22, color: colors.text },
  cardTitle: { fontFamily: fonts.semibold, fontSize: 18, lineHeight: 25, color: colors.text },
  metric: { fontFamily: fonts.semibold, fontSize: 22, lineHeight: 26, color: colors.text },
  button: { fontFamily: fonts.medium, fontSize: 14, lineHeight: 24 },
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 10,
  card: 12,
  xl: 20,
  pill: 999,
} as const;

export const shadows = {
  // 0 2 4 rgba(175,182,201,0.2) — every card and title bar
  card: {
    shadowColor: "#AFB6C9",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  // 0 8 20 rgba(77,91,236,0.23) — primary buttons / active sidebar item
  primary: {
    shadowColor: "#4D5BEC",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.23,
    shadowRadius: 20,
    elevation: 6,
  },
  // 0 16 32 rgba(12,12,13,0.4) — modals / dropdown menus
  overlay: {
    shadowColor: "#0C0C0D",
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 32,
    elevation: 12,
  },
} as const;
