export type PaymentMethodId = "cash" | "card" | "online" | "gift";

export interface IconProps {
  white?: boolean;
}

export interface GiftCardItem {
  id: string;
  name: string;
  code: string;
  bg: string;
  type: "colored" | "vip";
}

export interface PrintReceiptModalProps {
  open: boolean;
  onClose: () => void;
  twoOptions?: boolean;
  onComplete?: () => void;
}

export interface CardTerminalModalProps {
  open: boolean;
  onClose: () => void;
  total: number;
  onComplete?: () => void;
}

export interface OnlinePaymentModalProps {
  open: boolean;
  onClose: () => void;
  client?: { name: string; avatar?: string; phone?: string; email?: string } | null;
  onComplete?: () => void;
}

export interface GiftCardVisualProps {
  card: GiftCardItem;
  selected: boolean;
}

export interface GiftCardModalProps {
  open: boolean;
  onClose: () => void;
  total: number;
  onComplete?: () => void;
}

export interface DividePaymentModalProps {
  open: boolean;
  onClose: () => void;
  methodA: PaymentMethodId;
  methodB: PaymentMethodId;
  total: number;
  onComplete?: () => void;
}
