import React from "react";
import Link from "next/link";
import FolderCard from "./FolderCard";

import { FolderData } from "./types";

import { SuggestedFoldersProps } from "./types";

export default function SuggestedFolders({
  folders,
  activeDropdown,
  toggleDropdown,
  openRename,
  openDownload,
  openMove,
  openManagePermission,
  openDelete,
}: SuggestedFoldersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[15px] font-bold text-[#1E293B] font-manrope">
          Suggested Folders
        </h2>
        <Link href="/files/folders">
          <button className="px-5 py-2 bg-white border border-[#635BFF] rounded-lg text-[13px] font-bold text-[#635BFF]">
            View More
          </button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
        {folders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
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
    </div>
  );
}
