/**
 * Documents new-upload domain type definitions.
 */

export interface FolderItem {
  id: string;
  name: string;
  createdBy: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  createdBy: string;
}

export interface PermissionMember {
  id: string;
  name: string;
  email: string;
  role: "View Only" | "Edit Content" | "Add Folder" | "Add Files";
  avatarEmoji: string;
  avatarBg: string;
}
