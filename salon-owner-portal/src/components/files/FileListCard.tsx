import React from 'react';
import { MoreVertical, Pencil, Download, Move, Users, Trash2, Share2, Check } from "lucide-react";
import CustomDropdownItem from "../customComponent/CustomDropdownItem";
import FileIcon from "../customComponent/FileIcon";

import { FileListCardProps } from "./types";

export default function FileListCard({
  file,
  index,
  activeDropdown,
  toggleDropdown,
  openRename,
  openDownload,
  openMove,
  openManagePermission,
  openDelete,
  isSelected,
  onToggleSelect,
}: FileListCardProps) {
  return (
    <div className="border border-[#E2E8F0] rounded-lg p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors bg-white shadow-sm">
      <div className="flex items-center gap-5">
        {onToggleSelect && (
          <div
            className="cursor-pointer"
            onClick={onToggleSelect}
          >
            <div
              className={`w-5 h-5 rounded-[4px] flex items-center justify-center transition-colors ${isSelected ? "bg-[#635BFF] border border-[#635BFF]" : "border-2 border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"}`}
            >
              {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </div>
          </div>
        )}
        <div className="relative flex items-center justify-center">
          <FileIcon type={file.type} className="w-10 h-10 text-[#94A3B8]" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-bold text-[#1E293B]">{file.name}</span>
          <span className="text-[12px] font-medium text-[#94A3B8]">{file.type} • {file.size} • Created by {file.createdBy}</span>
        </div>
      </div>
      <div className="relative action-dropdown-container">
        <button
          onClick={(e) => toggleDropdown(`file-${file.id}-${index}`, e)}
          className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors text-[#64748B]"
        >
          <MoreVertical className="w-[18px] h-[18px]" />
        </button>

        {activeDropdown === `file-${file.id}-${index}` && (
          <div
            className="absolute right-0 top-full mt-1 z-[60] min-w-[220px] bg-white rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] border border-[#E2E8F0] py-2 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <CustomDropdownItem icon={<Pencil className="w-[15px] h-[15px] text-[#38BDF8]" />} label="Rename" onClick={() => openRename(file.name)} />
            <CustomDropdownItem icon={<Download className="w-[15px] h-[15px] text-[#64748B]" />} label="Download" onClick={() => openDownload(file.name)} />
            <CustomDropdownItem icon={<Move className="w-[15px] h-[15px] text-[#A855F7]" />} label="Move" onClick={() => openMove(file.name)} />
            <CustomDropdownItem icon={<Share2 className="w-[15px] h-[15px] text-[#2DD4BF]" />} label="Publish social media post" />
            <CustomDropdownItem icon={<Users className="w-[15px] h-[15px] text-[#FBBF24]" />} label="Manage Permission" onClick={openManagePermission} />
            <CustomDropdownItem icon={<Trash2 className="w-[15px] h-[15px] text-[#F43F5E]" />} label="Delete" textColor="text-[#F43F5E]" onClick={() => openDelete(file.name)} />
          </div>
        )}
      </div>
    </div>
  );
}
