export interface OnboardingData {
  businessName?: string;
  salonType?: string;
  location?: string;
  address?: string;
  phone?: string;
  teamSize?: string;
  servicesOffered?: string[];
  softwareCurrentlyUsed?: string;
}

export interface OnboardingStepProps {
  onNext: () => void;
  onBack: () => void;
  updateData: (data: Partial<OnboardingData>) => void;
  data: OnboardingData;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

