"use client";

import React, { useState, useEffect } from "react";
import PageHeader from "@/components/customComponent/CustomPageHeader";

import TopActionButtons from "@/components/files/TopActionButtons";
import SuggestedFolders from "@/components/files/SuggestedFolders";
import SuggestedFiles from "@/components/files/SuggestedFiles";

import ManagePermissionsModal from "@/components/files/ManagePermissionsModal";
import UploadFilesModal from "@/components/files/UploadFilesModal";
import CreateFolderModal from "@/components/files/CreateFolderModal";
import RenameModal from "@/components/files/RenameModal";
import DownloadModal from "@/components/files/DownloadModal";
import DeleteModal from "@/components/files/DeleteModal";
import MoveModal from "@/components/files/MoveModal";

import { mockFolders, mockFiles, mockMembers } from "@/components/files/data";
import { FolderData, FileData, MemberData } from "@/components/files/types";



export default function FilesPage() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [isManagePermissionOpen, setIsManagePermissionOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState("");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (e.target instanceof Element && !e.target.closest('.action-dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const toggleDropdown = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const openManagePermission = () => {
    setActiveDropdown(null);
    setIsManagePermissionOpen(true);
  };

  const openRename = (name: string) => {
    setSelectedItemName(name);
    setActiveDropdown(null);
    setIsRenameOpen(true);
  };

  const openDownload = (name: string) => {
    setSelectedItemName(name);
    setActiveDropdown(null);
    setIsDownloadOpen(true);
  };

  const openDelete = (name: string) => {
    setSelectedItemName(name);
    setActiveDropdown(null);
    setIsDeleteOpen(true);
  };

  const openMove = (name: string) => {
    setSelectedItemName(name);
    setActiveDropdown(null);
    setIsMoveOpen(true);
  };

  return (
    <div className="w-full flex flex-col gap-6 pb-10">
      <PageHeader title="Files" />
      <TopActionButtons
        setIsUploadOpen={setIsUploadOpen}
        setIsCreateFolderOpen={setIsCreateFolderOpen}
      />
      <SuggestedFolders
        folders={mockFolders}
        activeDropdown={activeDropdown}
        toggleDropdown={toggleDropdown}
        openRename={openRename}
        openDownload={openDownload}
        openMove={openMove}
        openManagePermission={openManagePermission}
        openDelete={openDelete}
      />
      <SuggestedFiles
        files={mockFiles}
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeDropdown={activeDropdown}
        toggleDropdown={toggleDropdown}
        openRename={openRename}
        openDownload={openDownload}
        openMove={openMove}
        openManagePermission={openManagePermission}
        openDelete={openDelete}
      />
      <ManagePermissionsModal
        isOpen={isManagePermissionOpen}
        onClose={() => setIsManagePermissionOpen(false)}
        mockMembers={mockMembers}
      />
      <UploadFilesModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
      <CreateFolderModal
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
      />
      <RenameModal
        isOpen={isRenameOpen}
        onClose={() => setIsRenameOpen(false)}
        selectedItemName={selectedItemName}
      />
      <DownloadModal
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
        selectedItemName={selectedItemName}
      />
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        selectedItemName={selectedItemName}
      />
      <MoveModal
        isOpen={isMoveOpen}
        onClose={() => setIsMoveOpen(false)}
        folders={mockFolders}
      />
    </div>
  );
}
