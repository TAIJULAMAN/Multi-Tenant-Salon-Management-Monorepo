/**
 * Salons domain type definitions.
 */

export interface Invitation {
  id: string;
  salonName: string;
  senderName: string;
  message: string;
  sentDate: string;
}

export interface SentInvitation {
  id: number;
  salonName: string;
  email: string;
  date: string;
  status: "Accepted" | "Pending" | "Rejected" | "Expired" | string;
  plan: string;
  planDetails: string;
  share: string;
  lastShare: string;
  avatarGradient: string;
  avatarImage?: string;
}

export type InvitationData = SentInvitation;

export interface SalonInfo {
  id: string;
  name: string;
  badge: string;
  ownerName: string;
  city: string;
  email: string;
  plan: "Premium" | "Enterprise" | "Basic";
  planPrice: string;
  paymentStatus: "In order" | "Late";
  nextRenewal: string;
  referral: string;
  avatarGradient: string;
  avatarImage?: string;
}

export interface PayoutData {
  id: number;
  requestDate: string;
  amount: string;
  invoiceNo: string;
  status: "Paid" | "Pending";
  paymentDate: string;
  note: string;
}

export interface RevenueCardData {
  title: string;
  amount: number;
  description: string;
  type: "success" | "primary" | "danger" | "warning";
}

export interface BreakdownData {
  id: number;
  salonName: string;
  email: string;
  avatarImage: string;
  plan: string;
  planDetails: string;
  share: string;
  lastPayment: string;
  lastPaymentDate: string;
  nextRenewal: string;
  nextRenewalDate: string;
  lifetime: string;
}
