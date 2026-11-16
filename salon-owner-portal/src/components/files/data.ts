import { FileData, FolderData, MemberData } from "./types";

export const mockFolders: FolderData[] = [
  { id: "1", name: "Marketing Assets", createdBy: "Maria Rodriguez" },
  { id: "2", name: "Financial Reports", createdBy: "John Smith" },
  { id: "3", name: "Employee Records", createdBy: "Sarah Connor" },
  { id: "4", name: "Legal Documents", createdBy: "David Chen" },
  { id: "5", name: "Project Alpha", createdBy: "Maria Rodriguez" },
  { id: "6", name: "Client Presentations", createdBy: "Jessica Lee" },
  { id: "7", name: "Design Templates", createdBy: "Alex Johnson" },
  { id: "8", name: "Meeting Minutes", createdBy: "John Smith" },
  { id: "9", name: "Vendor Contracts", createdBy: "David Chen" },
  { id: "10", name: "Onboarding Materials", createdBy: "Sarah Connor" },
  { id: "11", name: "Product roadmaps", createdBy: "Maria Rodriguez" },
  { id: "12", name: "Training Videos", createdBy: "Alex Johnson" },
  { id: "13", name: "Social Media Posts", createdBy: "Jessica Lee" },
  { id: "14", name: "Tax Returns 2023", createdBy: "John Smith" },
  { id: "15", name: "Brand Guidelines", createdBy: "Maria Rodriguez" },
  { id: "16", name: "Archived Projects", createdBy: "System Admin" }
];

export const mockFiles: FileData[] = [
  { id: "1", name: "August Salary", type: "PDF", size: "20 MB", createdBy: "Maria Rodriguez" },
  { id: "2", name: "Sanction", type: "DOC", size: "20 MB", createdBy: "Maria Rodriguez" },
  { id: "3", name: "Sanction", type: "MP4", size: "20 MB", createdBy: "Maria Rodriguez" },
  { id: "4", name: "March Salary", type: "MP3", size: "20 MB", createdBy: "Maria Rodriguez" },
  { id: "5", name: "May Salary", type: "IMG", size: "20 MB", createdBy: "Maria Rodriguez" },
  { id: "6", name: "Sanction", type: "PPT", size: "20 MB", createdBy: "Maria Rodriguez" },
  { id: "7", name: "Sanction", type: "ZIP", size: "20 MB", createdBy: "Maria Rodriguez" },
  { id: "8", name: "Sanction", type: "CSV", size: "20 MB", createdBy: "Maria Rodriguez" },
];

export const mockMembers: MemberData[] = [
  { id: 1, name: "Shah Aman", email: "maria@beautywellness.com", role: "View Only", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria1&backgroundColor=ffdfbf" },
  { id: 2, name: "Shovon Roy", email: "maria@beautywellness.com", role: "Edit Content", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria2&backgroundColor=c0aede" },
  { id: 3, name: "Martin Rodri", email: "maria@beautywellness.com", role: "Add Folder", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria3&backgroundColor=b6e3f4" },
  { id: 4, name: "Maria Rodriguez", email: "maria@beautywellness.com", role: "Add Folder", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria4&backgroundColor=ffdfbf" },
];
