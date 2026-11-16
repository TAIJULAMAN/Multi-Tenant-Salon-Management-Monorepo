import React from 'react';
import Link from "next/link";
import { MoreVertical, Pencil, Download, Move, Users, Trash2 } from "lucide-react";
import CustomDropdownItem from "../customComponent/CustomDropdownItem";

import { FolderCardProps } from "./types";

export default function FolderCard({
  folder,
  activeDropdown,
  toggleDropdown,
  openRename,
  openDownload,
  openMove,
  openManagePermission,
  openDelete,
}: FolderCardProps) {
  return (
    <Link href={`/dashboard/files/folders/${folder.id}`} className="block border border-[#E2E8F0] rounded-lg p-3 flex flex-col gap-3 hover:border-[#CBD5E1] transition-colors group">
      <div className="bg-[#F8FAFC] rounded-lg h-36 flex items-center justify-center border border-[#F1F5F9] group-hover:bg-[#F1F5F9] transition-colors">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="scale-125">
          <path d="M4 4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V10C22 8.89543 21.1046 8 20 8H12L10 4H4Z" fill="#A5B4FC" />
          <path d="M12 14H16" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
      <div className="px-1 pb-1 flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-bold text-[#1E293B]">{folder.name}</span>
          <span className="text-[12px] font-medium text-[#94A3B8]">Created by {folder.createdBy}</span>
        </div>
        <div className="relative action-dropdown-container">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleDropdown(`folder-${folder.id}`, e);
            }}
            className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors text-[#64748B]"
          >
            <MoreVertical className="w-[18px] h-[18px]" />
          </button>

          {activeDropdown === `folder-${folder.id}` && (
            <div
              className="absolute right-0 top-full mt-1 z-[60] min-w-[220px] bg-white rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] border border-[#E2E8F0] py-2 flex flex-col"
              onClick={(e) => e.preventDefault()}
            >
              <CustomDropdownItem icon={<Pencil className="w-[15px] h-[15px] text-[#38BDF8]" />} label="Rename" onClick={() => openRename(folder.name)} />
              <CustomDropdownItem icon={<Download className="w-[15px] h-[15px] text-[#64748B]" />} label="Download" onClick={() => openDownload(folder.name)} />
              <CustomDropdownItem icon={<Move className="w-[15px] h-[15px] text-[#A855F7]" />} label="Move" onClick={() => openMove(folder.name)} />
              <CustomDropdownItem icon={<Users className="w-[15px] h-[15px] text-[#FBBF24]" />} label="Manage Permission" onClick={openManagePermission} />
              <CustomDropdownItem icon={<Trash2 className="w-[15px] h-[15px] text-[#F43F5E]" />} label="Delete" textColor="text-[#F43F5E]" onClick={() => openDelete(folder.name)} />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
