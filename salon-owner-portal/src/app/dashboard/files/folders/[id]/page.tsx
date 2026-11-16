"use client";

import React, { useState, useEffect } from "react";
import {
  Upload,
  Download,
  Move,
  Trash2,
  List,
  LayoutGrid,
  Check,
  Minus,
} from "lucide-react";
import CustomSubPageHeader from "@/components/customComponent/CustomSubPageHeader";
import FileGridCard from "@/components/files/FileGridCard";
import FileListCard from "@/components/files/FileListCard";
import ManagePermissionsModal from "@/components/files/ManagePermissionsModal";
import UploadFilesModal from "@/components/files/UploadFilesModal";
import RenameModal from "@/components/files/RenameModal";
import DownloadModal from "@/components/files/DownloadModal";
import DeleteModal from "@/components/files/DeleteModal";
import MoveModal from "@/components/files/MoveModal";

import { mockFiles, mockMembers } from "@/components/files/data";

export default function FolderDetailsPage() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  // Modals state
  const [isManagePermissionOpen, setIsManagePermissionOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
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

  const toggleFileSelection = (id: string) => {
    setSelectedFiles((prev) =>
      prev.includes(id)
        ? prev.filter((fileId) => fileId !== id)
        : [...prev, id],
    );
  };

  const toggleAll = () => {
    if (selectedFiles.length === mockFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(mockFiles.map((f) => f.id));
    }
  };

  const isAllSelected =
    selectedFiles.length === mockFiles.length && mockFiles.length > 0;
  const isSomeSelected =
    selectedFiles.length > 0 && selectedFiles.length < mockFiles.length;

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
        title="Salaries"
        backUrl="/dashboard/files/folders"
        breadcrumbText="Files"
      />
      <div className="flex items-center gap-5">
        <button
          onClick={() => setIsUploadOpen(true)}
          className="bg-[#635BFF] hover:bg-[#524be0] text-white rounded-lg p-4 flex flex-col justify-between gap-5 w-40 shadow-sm transition-colors items-start text-left"
        >
          <Upload className="w-5 h-5" />
          <span className="font-bold text-[14px]">Upload</span>
        </button>
      </div>

      {/* Files List/Grid Area */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6 flex flex-col gap-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-6">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={toggleAll}
            >
              <div
                className={`w-[18px] h-[18px] rounded-[4px] flex items-center justify-center transition-colors ${
                  isAllSelected
                    ? "bg-[#635BFF] border border-[#635BFF]"
                    : isSomeSelected
                      ? "bg-[#F43F5E] border border-[#F43F5E]"
                      : "border-2 border-[#E2E8F0] bg-white group-hover:border-[#CBD5E1]"
                }`}
              >
                {isAllSelected && (
                  <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                )}
                {isSomeSelected && (
                  <Minus className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                )}
              </div>
              <span
                className={`text-[13px] font-bold decoration-2 hover:underline underline-offset-2 ${isAllSelected || isSomeSelected ? "text-[#635BFF]" : "text-[#635BFF]"}`}
              >
                {isAllSelected ? "Unselect All Files" : "Select All Files"}
              </span>
            </div>

            {selectedFiles.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsDeleteOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#FCE7F3] hover:bg-[#FBCFE8] text-[#F43F5E] rounded-lg text-[12px] font-bold transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
                <button
                  onClick={() => setIsDownloadOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#635BFF] rounded-lg text-[12px] font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
                <button
                  onClick={() => setIsMoveOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#1E293B] border border-[#E2E8F0] rounded-lg text-[12px] font-bold transition-colors"
                >
                  <Move className="w-3.5 h-3.5" />
                  Move
                </button>
              </div>
            )}
          </div>

          <div className="flex bg-white border border-[#E2E8F0] rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-[#EEF2FF] text-[#635BFF] shadow-sm" : "text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F8FAFC]"}`}
            >
              <List className="w-[18px] h-[18px]" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-[#EEF2FF] text-[#635BFF] shadow-sm" : "text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F8FAFC]"}`}
            >
              <LayoutGrid className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {mockFiles.map((file, i) => (
              <FileGridCard
                key={file.id + i}
                file={file}
                index={i}
                activeDropdown={activeDropdown}
                toggleDropdown={(id, e) => toggleDropdown(id, e)}
                openRename={openRename}
                openDownload={openDownload}
                openMove={openMove}
                openManagePermission={openManagePermission}
                openDelete={openDelete}
                isSelected={selectedFiles.includes(file.id)}
                onToggleSelect={() => toggleFileSelection(file.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {mockFiles.map((file, i) => (
              <FileListCard
                key={file.id + i}
                file={file}
                index={i}
                activeDropdown={activeDropdown}
                toggleDropdown={(id, e) => toggleDropdown(id, e)}
                openRename={openRename}
                openDownload={openDownload}
                openMove={openMove}
                openManagePermission={openManagePermission}
                openDelete={openDelete}
                isSelected={selectedFiles.includes(file.id)}
                onToggleSelect={() => toggleFileSelection(file.id)}
              />
            ))}
          </div>
        )}
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
        folders={[]}
      />
    </div>
  );
}
