import { ServiceRow } from "@/@types/salon-owner/service.type";
import { GiftCardItem, PaymentMethodId } from "./types";

export const INITIAL_SERVICES: ServiceRow[] = [
  {
    name: "Haircut",
    date: "2025-08-02",
    price: 170,
    startTime: "11:00",
    duration: "15 min",
    employee: "Maria Rodriguez",
  },
];

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

export const METHOD_LABELS: Record<PaymentMethodId, string> = {
  cash: "Cash",
  card: "Card Terminal",
  gift: "Gift Card",
  online: "Online Payment",
};

