export interface BasicInformationSectionProps {
  selectedClient: any;
  onOpenClientModal: () => void;
}

export interface PaymentMethodsSectionProps {
  activePaymentMethods: string[];
  onPaymentToggle: (id: string) => void;
}

export interface ServicesSectionProps {
  services: any[];
  total: number;
  onOpenServiceModal: () => void;
  onBack: () => void;
  onCheckout: () => void;
  isCheckoutDisabled: boolean;
}

export interface SearchClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectClient: (client: any) => void;
}

export interface SearchServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (service: any) => void;
}

export interface DividePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  selectedMethods: string[];
}
