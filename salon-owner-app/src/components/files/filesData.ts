export interface FolderData {
  id: string;
  name: string;
  createdBy: string;
  filesCount?: number;
  updatedAt?: string;
}

export interface FileData {
  id: string;
  name: string;
  type: "PDF" | "DOC" | "MP4" | "MP3" | "IMG" | "PPT" | "ZIP" | "CSV" | string;
  size: string;
  createdBy: string;
  updatedAt?: string;
  folderId?: string;
}

export interface FileMember {
  id: number;
  name: string;
  email: string;
  role: "View Only" | "Edit Content" | "Add Folder";
  avatar: string;
}

export const INITIAL_FOLDERS: FolderData[] = [
  { id: "1", name: "Employees", createdBy: "Maria Rodriguez", filesCount: 8, updatedAt: "2h ago" },
  { id: "2", name: "Accountant", createdBy: "Maria Rodriguez", filesCount: 14, updatedAt: "1d ago" },
  { id: "3", name: "Marketing & Ads", createdBy: "Maria Rodriguez", filesCount: 6, updatedAt: "3d ago" },
  { id: "4", name: "Supplier Invoices", createdBy: "Maria Rodriguez", filesCount: 19, updatedAt: "5d ago" },
  { id: "5", name: "Legal & Licenses", createdBy: "Maria Rodriguez", filesCount: 4, updatedAt: "1w ago" },
  { id: "6", name: "Client Before/After", createdBy: "Maria Rodriguez", filesCount: 32, updatedAt: "2w ago" },
];

export const INITIAL_FILES: FileData[] = [
  { id: "1", name: "August Salary Summary", type: "PDF", size: "20 MB", createdBy: "Maria Rodriguez", updatedAt: "Today, 14:20", folderId: "1" },
  { id: "2", name: "Employee Sanction Report", type: "DOC", size: "2.4 MB", createdBy: "Maria Rodriguez", updatedAt: "Yesterday", folderId: "1" },
  { id: "3", name: "Staff Training Tutorial", type: "MP4", size: "142 MB", createdBy: "Maria Rodriguez", updatedAt: "18 Aug 2025", folderId: "1" },
  { id: "4", name: "Salon Ambiance Playlist", type: "MP3", size: "64 MB", createdBy: "Maria Rodriguez", updatedAt: "17 Aug 2025", folderId: "3" },
  { id: "5", name: "May Balayage Showcase", type: "IMG", size: "12 MB", createdBy: "Maria Rodriguez", updatedAt: "16 Aug 2025", folderId: "6" },
  { id: "6", name: "Q3 Business Presentation", type: "PPT", size: "18 MB", createdBy: "Maria Rodriguez", updatedAt: "15 Aug 2025", folderId: "2" },
  { id: "7", name: "Annual Tax Receipts Archive", type: "ZIP", size: "85 MB", createdBy: "Maria Rodriguez", updatedAt: "14 Aug 2025", folderId: "2" },
  { id: "8", name: "Client Database Export", type: "CSV", size: "4.1 MB", createdBy: "Maria Rodriguez", updatedAt: "12 Aug 2025", folderId: "2" },
];

export const INITIAL_MEMBERS: FileMember[] = [
  { id: 1, name: "Maria Rodriguez", email: "maria@beautywellness.com", role: "Edit Content", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" },
  { id: 2, name: "Sarah Jenkins", email: "sarah.j@salon.com", role: "View Only", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" },
  { id: 3, name: "Michael Torres", email: "michael.t@salon.com", role: "Add Folder", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" },
  { id: 4, name: "Jessica Alba", email: "jessica.a@salon.com", role: "View Only", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" },
];

export function getFileTypeBadgeStyle(type: string): { bg: string; text: string; icon: string } {
  switch (type.toUpperCase()) {
    case "PDF":
      return { bg: "#FCE7F3", text: "#DB2777", icon: "document-text" };
    case "PPT":
      return { bg: "#FCE7F3", text: "#DB2777", icon: "easel" };
    case "DOC":
    case "DOCX":
      return { bg: "#DBEAFE", text: "#2563EB", icon: "document" };
    case "MP4":
    case "MOV":
      return { bg: "#FEF3C7", text: "#D97706", icon: "videocam" };
    case "MP3":
    case "WAV":
      return { bg: "#FEF3C7", text: "#D97706", icon: "musical-notes" };
    case "IMG":
    case "PNG":
    case "JPG":
    case "JPEG":
      return { bg: "#CCFBF1", text: "#0D9488", icon: "image" };
    case "ZIP":
    case "RAR":
      return { bg: "#F1F5F9", text: "#475569", icon: "archive" };
    case "CSV":
    case "XLS":
    case "XLSX":
      return { bg: "#D1FAE5", text: "#059669", icon: "grid" };
    default:
      return { bg: "#F1F5F9", text: "#64748B", icon: "document-outline" };
  }
}
