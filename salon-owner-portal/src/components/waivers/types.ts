export interface Waiver {
  id: string;
  name: string;
  signers: number;
  signedCount: string;
  lastUpdate: string;
  type: "template" | "signed";
  signedBy?: string;
  dateSigned?: string;
  targetRole?: "Client" | "Employee" | "All";
  personName?: string;
  createdDate?: string;
}

export type WaiverItem = Waiver;

export interface AddWaiverModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (waiverData: any) => void;
}
export interface WaiverField {
    id: string;
    fieldName: string;
    label: string;
    type: string;
    placeholder: string;
    description: string;
    required: boolean;
}

export interface Signer {
    id: string;
    type: "Pre-signed" | "Recipient";
    category: string;
    name: string;
    isDrawing: boolean;
    signature: string | null;
}

export interface ContractAttachment {
    id: string;
    name: string;
    type: string;
    size: string;
    updatedAt: string;
    file?: File;
}

export interface AttachmentRequirement {
    id: string;
    name: string;
    types: string[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface AssignWaiverModalProps {
  isOpen: boolean;
  onClose: () => void;
  waiver: any;
  assignType?: "clients" | "employees";
}

export interface DeleteWaiverModalProps {
  isOpen: boolean;
  onClose: () => void;
  waiver: any;
  onConfirm: () => void;
}

export interface EditWaiverModalProps {
  isOpen: boolean;
  onClose: () => void;
  waiver: any;
  onSave: (waiverData: any) => void;
}

export interface SignNowSendToModalProps {
  isOpen: boolean;
  onClose: () => void;
  waiver: any;
}
