export interface ImportedAppointment {
  id: string;
  startAt: string;
  endAt: string;
  clientRef: string;
  serviceRef: string;
  staffRef: string;
  status: string;
  note: string;
}

export interface TemplateItem {
  id: string;
  name: string;
  meta: string;
}

export interface ServiceReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ImportedAppointment | null;
}

export interface BookingOrderStepperProps {
  status: string;
  onPrintReceipt: () => void;
}

export interface DropzoneSectionProps {
  selectedFile: File | null;
  onFileSelect: (file: File | null) => void;
}

export interface ImportedTableProps {
  data: ImportedAppointment[];
  selectedRows: string[];
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  expandedRowId: string | null;
  onToggleExpandRow: (id: string) => void;
  onOpenReceipt: (row: ImportedAppointment) => void;
  currentPage: number;
  onPageChange: (page: number) => void;
}
