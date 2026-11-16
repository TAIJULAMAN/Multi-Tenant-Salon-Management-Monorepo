import { colors } from "@/constants/figmaTheme";

export interface FolderData {
  id: string;
  name: string;
  createdBy: string;
  /** null = top level ("Files" root) */
  parentId: string | null;
}

export interface FileData {
  id: string;
  name: string;
  type: "PDF" | "DOC" | "MP4" | "MP3" | "IMG" | "PPT" | "ZIP" | "CSV" | string;
  size: string;
  createdBy: string;
  /** null = top level ("Suggested Files") */
  folderId: string | null;
}

export type PermissionRole = "View Only" | "Add Files" | "Edit Content" | "Add Folder";

export interface FileMember {
  id: number;
  name: string;
  email: string;
  role: PermissionRole;
  avatar: string;
}

/** Options shown in the role dropdown (Figma 1:8299). */
export const PERMISSION_OPTIONS: PermissionRole[] = ["View Only", "Add Files", "Edit Content"];

/** Logged-in employee (matches the drawer profile) */
export const CURRENT_EMPLOYEE = "Maria Rodriguez";

const EMPLOYEE_FOLDER_NAMES = [
  "Maria Rodriguez",
  "Sarah Jenkins",
  "Michael Torres",
  "Jessica Alba",
  "David Kim",
  "Emma Wilson",
  "Lucas Martin",
  "Olivia Brown",
  "Noah Garcia",
  "Sophia Lee",
  "Liam Davis",
  "Ava Clark",
  "Ethan Lewis",
  "Mia Walker",
  "James Hall",
  "Isabella Young",
];

export const INITIAL_FOLDERS: FolderData[] = [
  { id: "employees", name: "Employees", createdBy: CURRENT_EMPLOYEE, parentId: null },
  { id: "accountant", name: "Accountant", createdBy: CURRENT_EMPLOYEE, parentId: null },
  { id: "salaries", name: "Salaries", createdBy: CURRENT_EMPLOYEE, parentId: null },
  { id: "contracts", name: "Contracts", createdBy: CURRENT_EMPLOYEE, parentId: null },
  { id: "invoices", name: "Invoices", createdBy: CURRENT_EMPLOYEE, parentId: null },
  { id: "licenses", name: "Licenses", createdBy: CURRENT_EMPLOYEE, parentId: null },
  ...EMPLOYEE_FOLDER_NAMES.map((name, i) => ({
    id: `employee_${i + 1}`,
    name,
    createdBy: CURRENT_EMPLOYEE,
    parentId: "employees",
  })),
];

const MONTHS = [
  "August",
  "July",
  "June",
  "May",
  "April",
  "March",
  "February",
  "January",
  "December",
];

export const INITIAL_FILES: FileData[] = [
  // Suggested files (Figma 1:6093 / 1:6308)
  { id: "s1", name: "August Salary", type: "PDF", size: "20 MB", createdBy: CURRENT_EMPLOYEE, folderId: null },
  { id: "s2", name: "Sanction", type: "DOC", size: "20 MB", createdBy: CURRENT_EMPLOYEE, folderId: null },
  { id: "s3", name: "Sanction", type: "MP4", size: "20 MB", createdBy: CURRENT_EMPLOYEE, folderId: null },
  { id: "s4", name: "March Salary", type: "MP3", size: "20 MB", createdBy: CURRENT_EMPLOYEE, folderId: null },
  { id: "s5", name: "May Salary", type: "IMG", size: "20 MB", createdBy: CURRENT_EMPLOYEE, folderId: null },
  { id: "s6", name: "Sanction", type: "PPT", size: "20 MB", createdBy: CURRENT_EMPLOYEE, folderId: null },
  { id: "s7", name: "Sanction", type: "ZIP", size: "20 MB", createdBy: CURRENT_EMPLOYEE, folderId: null },
  { id: "s8", name: "Sanction", type: "CSV", size: "20 MB", createdBy: CURRENT_EMPLOYEE, folderId: null },
  // Salaries folder (Figma 1:6519 / 1:6782 / 1:7066)
  ...MONTHS.map((month, i) => ({
    id: `sal_${i + 1}`,
    name: `${month} Salary`,
    type: "PDF",
    size: "20 MB",
    createdBy: CURRENT_EMPLOYEE,
    folderId: "salaries",
  })),
  { id: "acc_1", name: "Tax Report", type: "PDF", size: "20 MB", createdBy: CURRENT_EMPLOYEE, folderId: "accountant" },
  { id: "acc_2", name: "Expenses", type: "CSV", size: "20 MB", createdBy: CURRENT_EMPLOYEE, folderId: "accountant" },
  { id: "con_1", name: "Employment Contract", type: "DOC", size: "20 MB", createdBy: CURRENT_EMPLOYEE, folderId: "contracts" },
];

export const INITIAL_MEMBERS: FileMember[] = [
  { id: 1, name: "Maria Rodriguez", email: "maria@beautywellness.com", role: "View Only", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" },
  { id: 2, name: "Maria Rodriguez", email: "maria@beautywellness.com", role: "Edit Content", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" },
  { id: 3, name: "Maria Rodriguez", email: "maria@beautywellness.com", role: "Add Folder", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" },
  { id: 4, name: "Maria Rodriguez", email: "maria@beautywellness.com", role: "Add Folder", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80" },
];

/** Team members that can be found through "Search a member". */
export const TEAM_DIRECTORY: Omit<FileMember, "role">[] = [
  { id: 11, name: "Sarah Jenkins", email: "sarah@beautywellness.com", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80" },
  { id: 12, name: "Michael Torres", email: "michael@beautywellness.com", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80" },
  { id: 13, name: "Jessica Alba", email: "jessica@beautywellness.com", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80" },
  { id: 14, name: "David Kim", email: "david@beautywellness.com", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80" },
];

/** Colour of the label badge on the "File type icon" (Figma 1:6308). */
export function getFileTypeColor(type: string): string {
  switch (type.toUpperCase()) {
    case "PDF":
      return colors.pink;
    case "PPT":
    case "PPTX":
      return colors.pink;
    case "DOC":
    case "DOCX":
      return colors.primary;
    case "MP4":
    case "MOV":
    case "MP3":
    case "WAV":
      return colors.yellow;
    case "IMG":
    case "PNG":
    case "JPG":
    case "JPEG":
      return colors.teal;
    case "ZIP":
    case "RAR":
      return colors.text;
    case "CSV":
    case "XLS":
    case "XLSX":
      return colors.green;
    default:
      return colors.textMuted;
  }
}

/** Maps a picked file name / mime type to one of the Figma type labels. */
export function fileTypeFromName(name: string, mimeType?: string): string {
  const ext = name.split(".").pop()?.toUpperCase() ?? "";
  if (["PNG", "JPG", "JPEG", "GIF", "HEIC", "WEBP"].includes(ext) || mimeType?.startsWith("image/")) return "IMG";
  if (["DOC", "DOCX", "TXT", "RTF"].includes(ext)) return "DOC";
  if (["PPT", "PPTX", "KEY"].includes(ext)) return "PPT";
  if (["MP4", "MOV", "AVI"].includes(ext) || mimeType?.startsWith("video/")) return "MP4";
  if (["MP3", "WAV", "M4A"].includes(ext) || mimeType?.startsWith("audio/")) return "MP3";
  if (["ZIP", "RAR", "7Z"].includes(ext)) return "ZIP";
  if (["CSV", "XLS", "XLSX"].includes(ext)) return "CSV";
  if (ext === "PDF") return "PDF";
  return ext.slice(0, 4) || "FILE";
}

export function formatFileSize(bytes?: number): string {
  if (!bytes) return "0 MB";
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${Math.round(mb * 10) / 10} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function stripExtension(name: string): string {
  const idx = name.lastIndexOf(".");
  return idx > 0 ? name.slice(0, idx) : name;
}
