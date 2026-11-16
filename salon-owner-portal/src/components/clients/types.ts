export interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClient: any;
}

export interface ExportClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface DeleteClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClient: any;
}

export interface DownloadDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClient: any;
}

export interface AddAllergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedClient: any;
}

export interface ClientsTableProps {
  paginatedData: any[];
  selectedClients: string[];
  openDropdownId: string | null;
  toggleSelectAll: () => void;
  toggleSelectClient: (id: string) => void;
  setOpenDropdownId: (id: string | null) => void;
  onEditClient: (client: any) => void;
  onDeleteClient: (client: any) => void;
  onAddAllergy: (client: any) => void;
}

export interface ImportedClient {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  consent: "yes" | "no";
  birthDate: string;
  status: "pending" | "approved" | "rejected";
}

export interface ClientAppointmentItem {
  id: string;
  service: string;
  category: string;
  date: string;
  time: string;
  staff: string;
  staffAvatar: string;
  price: string;
  status: "Completed" | "Pending" | "Cancelled";
}

export interface ClientReceiptItem {
  id: string;
  receiptNumber: string;
  date: string;
  operator: string;
  total: string;
  paymentMethod: "Cash" | "Credit Card" | "Gift Card" | "On Card";
  status: "Paid" | "Refunded";
}

export interface ClientGiftCardItem {
  id: string;
  code: string;
  amount: string;
  remainingAmount: string;
  expirationDate: string;
  status: "Active" | "Expired" | "Exhausted";
}

export interface ClientNoteItem {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface ClientMediaItem {
  id: string;
  fileName: string;
  date: string;
  size: string;
  url: string;
}

export interface ClientCommunicationLogItem {
  id: string;
  channel: "WhatsApp" | "Email" | "Phone" | "SMS";
  direction: "Inbound" | "Outbound";
  title: string;
  preview: string;
  date: string;
  staff: string;
}
