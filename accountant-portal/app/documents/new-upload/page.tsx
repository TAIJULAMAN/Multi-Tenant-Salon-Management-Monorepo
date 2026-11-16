"use client";

import React from "react";
import { ChevronLeft, Home, UploadCloud } from "lucide-react";

import SuccessModal from "@/components/modal/SuccessModal";
import UploadActions from "@/components/documents/new-upload/UploadActions";
import SuggestedFolders from "@/components/documents/new-upload/SuggestedFolders";
import SuggestedFiles from "@/components/documents/new-upload/SuggestedFiles";
import SubfolderFilesSection from "@/components/documents/new-upload/SubfolderFilesSection";
import CreateFolderModal from "@/components/documents/new-upload/CreateFolderModal";
import RenameModal from "@/components/documents/new-upload/RenameModal";
import UploadFilesModal from "@/components/documents/new-upload/UploadFilesModal";
import ManagePermissionsModal from "@/components/documents/new-upload/ManagePermissionsModal";
import MoveFolderModal from "@/components/documents/new-upload/MoveFolderModal";
import { useDocumentsPage } from "@/components/documents/new-upload/useDocumentsPage";

export default function NewUploadPage() {
  const {
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
      setCurrentPath,
      setIsGridView,
      setIsFolderGridView,
      setActiveMenu,
      setIsSuccessOpen,
      setSuccessTitle,
      setSuccessMessage,
      setIsCreateFolderOpen,
      setNewFolderName,
      setIsRenameOpen,
      setRenameValue,
      setIsUploadModalOpen,
      setIsPermissionModalOpen,
      setIsMoveModalOpen,
      setPermissionMembers,
    },
    handlers: {
      handleUploadClick,
      handleFileChange,
      handleToggleFileSelection,
      handleHeaderCheckboxClick,
      handleDeleteSelectedFiles,
      handleDownloadSelectedFiles,
      handleMoveSelectedFiles,
      handleCreateFolderSubmit,
      handleRenameSubmit,
      handleRenameClick,
      handleDeleteClick,
      handleMockDownload,
      handleActionNotify,
    },
  } = useDocumentsPage();

  return (
    <main className="flex-1 overflow-y-auto bg-[#f8fafc] p-6 lg:p-8 space-y-6">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
      />
      {/* Header Container - Full width, white */}
      {currentPath.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-8 py-4 flex justify-between items-center animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentPath((prev) => prev.slice(0, -1))}
              className="p-2 hover:bg-slate-50 rounded-lg text-slate-500 transition-colors cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-lg font-bold text-slate-800 tracking-tight">
              {currentPath[currentPath.length - 1].name}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Home size={14} className="text-slate-400" />
            <span className="text-slate-300">/</span>
            <span className="bg-[#eef2ff] text-[#5c59f0] px-3 py-1.5 rounded-full text-[11px] font-bold">
              {currentPath.length >= 3 ? "Files" : "New Upload"}
            </span>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-8 py-6">
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">
            New Document Upload
          </h1>
        </div>
      )}

      {/* Upload actions block */}
      {currentPath.length < 3 ? (
        <UploadActions
          onUploadClick={() => setIsUploadModalOpen(true)}
          onCreateFolderClick={() => setIsCreateFolderOpen(true)}
        />
      ) : (
        /* Upload Button layout from Screenshot 1 */
        <div className="flex justify-start">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex flex-col items-center justify-center gap-2 w-28 h-24 bg-[#5c59f0] hover:bg-[#4744db] text-white rounded-2xl shadow-sm transition-all active:scale-95 cursor-pointer"
          >
            <UploadCloud size={24} />
            <span className="text-xs font-bold">Upload</span>
          </button>
        </div>
      )}

      {/* Directory Router */}
      {currentPath.length === 0 && (
        <>
          <SuggestedFolders
            folders={folders}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            dropdownRef={dropdownRef}
            handleRenameClick={handleRenameClick}
            handleMockDownload={handleMockDownload}
            handleActionNotify={handleActionNotify}
            handleDeleteClick={handleDeleteClick}
            onFolderClick={(folder) => setCurrentPath([folder])}
            isGridView={isFolderGridView}
            setIsGridView={setIsFolderGridView}
          />
          <SuggestedFiles
            files={files}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            dropdownRef={dropdownRef}
            isGridView={isGridView}
            setIsGridView={setIsGridView}
            handleRenameClick={handleRenameClick}
            handleMockDownload={handleMockDownload}
            handleActionNotify={handleActionNotify}
            handleDeleteClick={handleDeleteClick}
          />
        </>
      )}

      {currentPath.length === 1 && (
        <SuggestedFolders
          folders={employeeSubfolders}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          dropdownRef={dropdownRef}
          handleRenameClick={handleRenameClick}
          handleMockDownload={handleMockDownload}
          handleActionNotify={handleActionNotify}
          handleDeleteClick={handleDeleteClick}
          onFolderClick={(folder) => setCurrentPath([...currentPath, folder])}
          isGridView={isFolderGridView}
          setIsGridView={setIsFolderGridView}
          showViewMore={false}
        />
      )}

      {currentPath.length === 2 && (
        <SuggestedFolders
          folders={mariaRodriguezFolders}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          dropdownRef={dropdownRef}
          handleRenameClick={handleRenameClick}
          handleMockDownload={handleMockDownload}
          handleActionNotify={handleActionNotify}
          handleDeleteClick={handleDeleteClick}
          onFolderClick={(folder) => setCurrentPath([...currentPath, folder])}
          isGridView={isFolderGridView}
          setIsGridView={setIsFolderGridView}
          showViewMore={false}
        />
      )}

      {currentPath.length >= 3 && (
        <SubfolderFilesSection
          subfolderFiles={subfolderFiles}
          selectedFileIds={selectedFileIds}
          handleHeaderCheckboxClick={handleHeaderCheckboxClick}
          handleDeleteSelectedFiles={handleDeleteSelectedFiles}
          handleDownloadSelectedFiles={handleDownloadSelectedFiles}
          handleMoveSelectedFiles={handleMoveSelectedFiles}
          isGridView={isFolderGridView}
          setIsGridView={setIsFolderGridView}
          handleToggleFileSelection={handleToggleFileSelection}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          dropdownRef={dropdownRef}
          handleRenameClick={handleRenameClick}
          handleMockDownload={handleMockDownload}
          handleActionNotify={handleActionNotify}
          handleDeleteClick={handleDeleteClick}
        />
      )}

      <CreateFolderModal
        isOpen={isCreateFolderOpen}
        onClose={() => setIsCreateFolderOpen(false)}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        onSubmit={handleCreateFolderSubmit}
      />

      {renameTarget && (
        <RenameModal
          isOpen={isRenameOpen}
          onClose={() => setIsRenameOpen(false)}
          renameValue={renameValue}
          setRenameValue={setRenameValue}
          onSubmit={handleRenameSubmit}
        />
      )}

      <UploadFilesModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadClick={handleUploadClick}
      />

      {permissionTarget && (
        <ManagePermissionsModal
          isOpen={isPermissionModalOpen}
          onClose={() => setIsPermissionModalOpen(false)}
          targetName={permissionTarget.name}
          permissionMembers={permissionMembers}
          setPermissionMembers={setPermissionMembers}
          onSave={() => {
            setIsPermissionModalOpen(false);
            setSuccessTitle("Permissions Updated!");
            setSuccessMessage(
              `Permissions for "${permissionTarget.name}" have been saved successfully.`,
            );
            setIsSuccessOpen(true);
          }}
        />
      )}

      {moveTarget && (
        <MoveFolderModal
          isOpen={isMoveModalOpen}
          onClose={() => setIsMoveModalOpen(false)}
          targetName={moveTarget.name}
          onSave={() => {
            setIsMoveModalOpen(false);
            setSuccessTitle("Move Completed!");
            setSuccessMessage(
              `"${moveTarget.name}" has been successfully moved to the destination folder.`,
            );
            setIsSuccessOpen(true);
          }}
        />
      )}

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title={successTitle}
        message={successMessage}
      />
    </main>
  );
}
