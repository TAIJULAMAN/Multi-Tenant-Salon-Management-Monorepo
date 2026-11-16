"use client";

import React, { useState, useEffect } from "react";
import CustomSubPageHeader from "@/components/customComponent/CustomSubPageHeader";
import TopActionButtons from "@/components/files/TopActionButtons";
import FolderCard from "@/components/files/FolderCard";
import ManagePermissionsModal from "@/components/files/ManagePermissionsModal";
import UploadFilesModal from "@/components/files/UploadFilesModal";
import CreateFolderModal from "@/components/files/CreateFolderModal";
import RenameModal from "@/components/files/RenameModal";
import DownloadModal from "@/components/files/DownloadModal";
import DeleteModal from "@/components/files/DeleteModal";
import MoveModal from "@/components/files/MoveModal";

import { mockFolders, mockMembers } from "@/components/files/data";

export default function FoldersPage() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
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
      if (
        e.target instanceof Element &&
        !e.target.closest(".action-dropdown-container")
      ) {
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
      <CustomSubPageHeader
        title="Employees"
        backUrl="/dashboard/files"
        breadcrumbText="Files"
      />
      <TopActionButtons
        setIsUploadOpen={setIsUploadOpen}
        setIsCreateFolderOpen={setIsCreateFolderOpen}
      />
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {mockFolders.map((folder, i) => (
            <FolderCard
              key={folder.id + i}
              folder={folder}
              activeDropdown={activeDropdown}
              toggleDropdown={(id, e) => toggleDropdown(id, e)}
              openRename={openRename}
              openDownload={openDownload}
              openMove={openMove}
              openManagePermission={openManagePermission}
              openDelete={openDelete}
            />
          ))}
        </div>
      </div>

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
