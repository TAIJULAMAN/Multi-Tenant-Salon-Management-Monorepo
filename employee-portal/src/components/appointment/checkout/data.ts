import { PaymentMethodId, GiftCardItem } from "./types";

export const METHOD_LABELS: Record<PaymentMethodId, string> = {
  cash: "Cash",
  card: "Card Terminal",
  gift: "Gift Card",
  online: "Online Payment",
};

export const MOCK_GIFT_CARDS: GiftCardItem[] = [
  {
    id: "gc1",
    name: "Name",
    code: "#code",
    bg: "linear-gradient(135deg,#6C5CE7 0%,#a29bfe 100%)",
    type: "colored",
  },
  {
    id: "gc2",
    name: "Name",
    code: "#code",
    bg: "linear-gradient(135deg,#d4a96a 0%,#f0ddb0 50%,#c8a04a 100%)",
    type: "vip",
  },
];
