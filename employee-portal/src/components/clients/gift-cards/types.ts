export interface GiftCardTemplate {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface GiftCardLogoOption {
  id: number;
  label: string;
  type: "none" | "main" | "alt" | "minimal";
}

export interface GiftCardFormData {
  numCards: string;
  amount: string;
  currency: string;
  hideAmount: boolean;
  selectedTemplate: number;
  selectedLogo: number;
  salonName: string;
  website: string;
  address: string;
  dateOfIssue: string;
  dateOfExpiration: string;
  usageLimit: string;
  eligibleServices: string[];
  receiverName: string;
  gifterName: string;
  personalMessage: string;
}

export interface ViewGiftCardData {
  numCards: string;
  amount: string;
  isAmountHidden: boolean;
  salonName: string;
  website: string;
  address: string;
  dateOfIssue: string;
  dateOfExpiration: string;
  usageLimit: string;
  eligibleServices: string[];
  receiverName: string;
  gifterName: string;
  message: string;
}
