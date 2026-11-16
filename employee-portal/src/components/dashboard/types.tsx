import { ReactNode } from "react";

export interface StatCardData {
  id: number;
  title: string;
  value: string;
  change: string;
  icon: ReactNode;
  iconBgColor: string;
  iconShadowColor: string;
  cardStyle: string;
}

export interface ClientData {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  service: string;
  date: string;
  price: string;
  status: string;
  statusColor: string;
}

export interface Appointment {
  id: string;
  clientId?: string;
  photo?: string;
  name: string;
  phone: string;
  time: string;
  status: "Booked" | "Completed" | "Cancelled";
}

export interface ReceiptAppointment {
  id: number;
  name: string;
  time: string;
  service: string;
  teamMember: string;
  estimatedPrice: string;
  avatar: string;
}

export interface AgendaAppointmentsProps {
  appointments: Appointment[];
}

export interface CashRegisterCheckingProps {
  loadingProgress: number;
  onTestNotFound: () => void;
}

export interface CashRegisterConfigErrorProps {
  onRetry: () => void;
}

export interface CashRegisterConfigSuccessProps {
  onTestPrint: () => void;
}

export interface CashRegisterConnectedProps {
  onClose: () => void;
  onDisconnect: () => void;
}

export interface CashRegisterDisconnectedProps {
  onConnect: () => void;
}

export interface CashRegisterNotFoundProps {
  onRetry: () => void;
}

export interface CashRegisterProgressStepsProps {
  activeStep: number;
}

export interface CashRegisterSearchingProps {
  loadingProgress: number;
}

export interface CashRegisterSelectDeviceProps {
  ipAddress: string;
  setIpAddress: (val: string) => void;
  onRescan: () => void;
  onConfigure: () => void;
}

export interface CashRegisterSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDisconnect?: () => void;
}

export type ViewState =
  | "DISCONNECTED"
  | "CHECKING"
  | "NOT_FOUND"
  | "SEARCHING"
  | "SELECT_DEVICE"
  | "CONFIG_SUCCESS"
  | "CONFIG_ERROR"
  | "CONNECTED";

export interface CloseCashRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export interface CloseRegisterSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: () => void;
  onViewDashboard: () => void;
}

export interface DailySummaryActionsProps {
  isRegisterOpen: boolean;
  onNewReceipt: () => void;
  onCloseRegister: () => void;
  onOpenRegister: () => void;
}

export interface DailySummaryHeaderProps {
  isRegisterOpen: boolean;
  onOpenSettings: () => void;
  onOpenExport: () => void;
}

export interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface NewReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface OpenCashRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export interface OpenRegisterSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateReceipt: () => void;
  onViewDashboard: () => void;
}

export interface ReceiptSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface PaymentBarItem {
  label: string;
  amount: number;
  displayAmount: string;
  total: string;
  monthlyMean: string;
  percentHeight: number;
}

export type PaymentPeriodType = "Yearly" | "Quarterly" | "Monthly";

export interface PaymentPeriodConfig {
  title: string;
  yLabels: string[];
  pages: PaymentBarItem[][];
}
