import { GiftCardTemplate, GiftCardLogoOption, ViewGiftCardData } from "./types";

export const giftCardTemplates: GiftCardTemplate[] = [
  {
    id: 1,
    name: "Classic Elegance",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "/cards/c1.png",
  },
  {
    id: 2,
    name: "Modern Minimal",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "/cards/c3.png",
  },
];

export const giftCardLogoOptions: GiftCardLogoOption[] = [
  { id: 1, label: "No logo", type: "none" },
  { id: 2, label: "Main Logo", type: "main" },
  { id: 3, label: "Alternative Logo", type: "alt" },
  { id: 4, label: "Minimal Logo", type: "minimal" },
];

export const defaultViewGiftCardData: ViewGiftCardData = {
  numCards: "1",
  amount: "€ 200",
  isAmountHidden: true,
  salonName: "CEU HAREM ACCONCIATURE",
  website: "www.degradepartenassafra.it",
  address: "Via Rodipuglia 44/A - MASSAFRA (TA)",
  dateOfIssue: "02/09/2025",
  dateOfExpiration: "02/20/2025",
  usageLimit: "1",
  eligibleServices: ["Haircut", "Styling", "Coloring", "Treatment"],
  receiverName: "Amelia Rodriguez",
  gifterName: "Marco Rossi",
  message:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
};
