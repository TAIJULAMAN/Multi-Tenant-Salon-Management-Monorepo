import { ServiceRow } from "@/@types/salon-owner/service.type";

export type PaymentMethodId = "cash" | "card" | "online" | "gift";

export type ActiveModal =
  | null
  | "cash"
  | "card"
  | "online"
  | "gift"
  | "divide"
  | "online-combo";

export interface IconProps {
  white?: boolean;
}

export interface CheckoutClient {
  id?: number | string;
  name: string;
  avatar: string;
  phone?: string;
  email?: string;
}

export interface CheckoutContentProps {
  onBack?: () => void;
  onSave?: () => void;
  breadcrumb?: { label: string; active: boolean }[];
  showClientCard?: boolean;
  initialClient?: CheckoutClient | null;
  initialServices?: ServiceRow[];
  allowAddService?: boolean;
  allowDeleteService?: boolean;
}

export type CheckoutPageProps = CheckoutContentProps;

export interface GiftCardItem {
  id: string;
  name: string;
  code: string;
  bg: string;
  type: "colored" | "vip";
}

export interface OnlineFormState {
  firstName: string;
  lastName: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
}

