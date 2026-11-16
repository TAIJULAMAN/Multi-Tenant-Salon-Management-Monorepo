import { useState, useRef, useEffect } from "react";
import type {
  FolderItem,
  FileItem,
  PermissionMember,
} from "./types";
import {
  initialFolders,
  initialSubfolderFiles,
  initialMariaRodriguezFolders,
  initialEmployeeSubfolders,
  initialFiles,
  initialPermissionMembers,
} from "./data";
import { useDocumentHandlers } from "./useDocumentHandlers";

export function useDocumentsPage() {
  const [folders, setFolders] = useState<FolderItem[]>(initialFolders);
  const [currentPath, setCurrentPath] = useState<FolderItem[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [subfolderFiles, setSubfolderFiles] = useState<FileItem[]>(
    initialSubfolderFiles,
  );
  const [mariaRodriguezFolders, setMariaRodriguezFolders] = useState<
    FolderItem[]
  >(initialMariaRodriguezFolders);
  const [employeeSubfolders, setEmployeeSubfolders] = useState<FolderItem[]>(
    initialEmployeeSubfolders,
  );

  const [files, setFiles] = useState<FileItem[]>(initialFiles);
  const [isGridView, setIsGridView] = useState(true);
  const [isFolderGridView, setIsFolderGridView] = useState(true);
  const [activeMenu, setActiveMenu] = useState<{
    id: string;
    type: "folder" | "file";
  } | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [successTitle, setSuccessTitle] = useState("Success!");
  const [successMessage, setSuccessMessage] = useState("");

  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<{
    id: string;
    type: "folder" | "file";
    currentName: string;
  } | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [permissionTarget, setPermissionTarget] = useState<{
    id: string;
    type: "folder" | "file";
    name: string;
  } | null>(null);
  const [, setActiveRoleSelect] = useState<string | null>(null);

  // Move Modal State
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [moveTarget, setMoveTarget] = useState<{
    id: string;
    type: "folder" | "file";
    name: string;
  } | null>(null);
  const [permissionMembers, setPermissionMembers] = useState<
    PermissionMember[]
  >(initialPermissionMembers);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Outside click listener for dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setActiveMenu(null);
      }
      setActiveRoleSelect(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Upload Handlers
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handlers = useDocumentHandlers({
    currentPath,
    subfolderFiles,
    selectedFileIds,
    renameTarget,
    renameValue,
    newFolderName,
    setSubfolderFiles,
    setFiles,
    setIsUploadModalOpen,
    setSuccessTitle,
    setSuccessMessage,
    setIsSuccessOpen,
    setSelectedFileIds,
    setMoveTarget,
    setIsMoveModalOpen,
    setEmployeeSubfolders,
    setMariaRodriguezFolders,
    setFolders,
    setNewFolderName,
    setIsCreateFolderOpen,
    setRenameTarget,
    setRenameValue,
    setIsRenameOpen,
    setActiveMenu,
    setPermissionTarget,
    setIsPermissionModalOpen,
  });

  return {
    state: {
      folders,
      currentPath,
      selectedFileIds,
      subfolderFiles,
      mariaRodriguezFolders,
      employeeSubfolders,
      files,
      isGridView,
      isFolderGridView,
      activeMenu,
      isSuccessOpen,
      successTitle,
      successMessage,
      isCreateFolderOpen,
      newFolderName,
      isRenameOpen,
      renameTarget,
      renameValue,
      isUploadModalOpen,
      isPermissionModalOpen,
      permissionTarget,
      isMoveModalOpen,
      moveTarget,
      permissionMembers,
      dropdownRef,
      fileInputRef,
    },
    setters: {
      setFolders,
      setCurrentPath,
      setSelectedFileIds,
      setSubfolderFiles,
      setMariaRodriguezFolders,
      setEmployeeSubfolders,
      setFiles,
      setIsGridView,
      setIsFolderGridView,
      setActiveMenu,
      setIsSuccessOpen,
      setSuccessTitle,
      setSuccessMessage,
      setIsCreateFolderOpen,
      setNewFolderName,
      setIsRenameOpen,
      setRenameTarget,
      setRenameValue,
      setIsUploadModalOpen,
      setIsPermissionModalOpen,
      setPermissionTarget,
      setIsMoveModalOpen,
      setMoveTarget,
      setPermissionMembers,
    },
    handlers: {
      handleUploadClick,
      ...handlers,
    },
  };
}
