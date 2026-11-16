import React from 'react';

export interface FileData {
  id: string;
  name: string;
  type: string;
  size: string;
  createdBy: string;
}

export interface FolderData {
  id: string;
  name: string;
  createdBy: string;
}

export interface MemberData {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface Member {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

export interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItemName: string;
}

export interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItemName: string;
}

export interface FileGridCardProps {
  file: FileData;
  index: number;
  activeDropdown: string | null;
  toggleDropdown: (id: string, e: React.MouseEvent) => void;
  openRename: (name: string) => void;
  openDownload: (name: string) => void;
  openMove: (name: string) => void;
  openManagePermission: () => void;
  openDelete: (name: string) => void;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export interface FileListCardProps {
  file: FileData;
  index: number;
  activeDropdown: string | null;
  toggleDropdown: (id: string, e: React.MouseEvent) => void;
  openRename: (name: string) => void;
  openDownload: (name: string) => void;
  openMove: (name: string) => void;
  openManagePermission: () => void;
  openDelete: (name: string) => void;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

export interface FolderCardProps {
  folder: FolderData;
  activeDropdown: string | null;
  toggleDropdown: (id: string, e: React.MouseEvent) => void;
  openRename: (name: string) => void;
  openDownload: (name: string) => void;
  openMove: (name: string) => void;
  openManagePermission: () => void;
  openDelete: (name: string) => void;
}

export interface ManagePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  mockMembers: Member[];
}

export interface MoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: FolderData[];
}

export interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItemName: string;
}

export interface SuggestedFilesProps {
  files: FileData[];
  viewMode: 'list' | 'grid';
  setViewMode: (mode: 'list' | 'grid') => void;
  activeDropdown: string | null;
  toggleDropdown: (id: string, e: React.MouseEvent) => void;
  openRename: (name: string) => void;
  openDownload: (name: string) => void;
  openMove: (name: string) => void;
  openManagePermission: () => void;
  openDelete: (name: string) => void;
}

export interface SuggestedFoldersProps {
  folders: FolderData[];
  activeDropdown: string | null;
  toggleDropdown: (id: string, e: React.MouseEvent) => void;
  openRename: (name: string) => void;
  openDownload: (name: string) => void;
  openMove: (name: string) => void;
  openManagePermission: () => void;
  openDelete: (name: string) => void;
}

export interface TopActionButtonsProps {
  setIsUploadOpen: (value: boolean) => void;
  setIsCreateFolderOpen: (value: boolean) => void;
}

export interface UploadFilesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (files: File[]) => void;
}
