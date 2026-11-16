export type AllergyColor = "red" | "green" | "blue" | "yellow" | "purple" | "pink" | "orange";

export interface ClientData {
  id: string;
  name: string;
  email: string;
  telephone: string;
  lastAppointment: string;
  allergy: {
    name: string;
    color: AllergyColor;
  };
  createdAt: string;
  avatarUrl: string;
  avatarBg: string;
}

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
  onConfirm?: (clientId: string) => void;
}

export interface MassDeleteClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCount: number;
  onConfirm: () => void;
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
  paginatedData: ClientData[];
  selectedClients: string[];
  openDropdownId: string | null;
  toggleSelectAll: () => void;
  toggleSelectClient: (id: string) => void;
  setOpenDropdownId: (id: string | null) => void;
  onEditClient: (client: ClientData) => void;
  onDeleteClient: (client: ClientData) => void;
  onAddAllergy: (client: ClientData) => void;
  onMassDelete?: () => void;
}

export type Client = ClientData;

export interface ClientNote {
  id: string;
  title: string;
  description: string;
  attachmentsCount?: number;
  attachmentName?: string;
  date?: string;
}

export interface ClientMedia {
  id: string;
  fileName: string;
  date: string;
  type: "Photo" | "Video";
  url: string;
  thumbnail?: string;
}

export interface ClientAllergy {
  id: string;
  title: string;
  description: string;
  severity: "High" | "Medium" | "Low";
}

export interface ClientCommLog {
  id: string;
  channel: "WhatsApp" | "Email" | "SMS";
  title: string;
  employee: string;
  date: string;
  time: string;
  status: "Delivered" | "Sent" | "Read" | "Failed";
  source: string;
}

