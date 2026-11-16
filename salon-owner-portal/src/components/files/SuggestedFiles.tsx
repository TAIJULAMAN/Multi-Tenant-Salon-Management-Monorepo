import React from "react";
import { List, LayoutGrid } from "lucide-react";
import FileGridCard from "./FileGridCard";
import FileListCard from "./FileListCard";

import { FileData } from "./types";

import { SuggestedFilesProps } from "./types";
export default function SuggestedFiles({
  files,
  viewMode,
  setViewMode,
  activeDropdown,
  toggleDropdown,
  openRename,
  openDownload,
  openMove,
  openManagePermission,
  openDelete,
}: SuggestedFilesProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-[#1E293B] font-manrope">Suggested Files</h2>
        <div className="flex bg-white border border-[#E2E8F0] rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#EEF2FF] text-[#635BFF] shadow-sm' : 'text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F8FAFC]'}`}
          >
            <List className="w-[18px] h-[18px]" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#EEF2FF] text-[#635BFF] shadow-sm' : 'text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F8FAFC]'}`}
          >
            <LayoutGrid className="w-[18px] h-[18px]" />
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {files.map((file, i) => (
            <FileGridCard
              key={file.id + i}
              file={file}
              index={i}
              activeDropdown={activeDropdown}
              toggleDropdown={toggleDropdown}
              openRename={openRename}
              openDownload={openDownload}
              openMove={openMove}
              openManagePermission={openManagePermission}
              openDelete={openDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {files.map((file, i) => (
            <FileListCard
              key={file.id + i}
              file={file}
              index={i}
              activeDropdown={activeDropdown}
              toggleDropdown={toggleDropdown}
              openRename={openRename}
              openDownload={openDownload}
              openMove={openMove}
              openManagePermission={openManagePermission}
              openDelete={openDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
