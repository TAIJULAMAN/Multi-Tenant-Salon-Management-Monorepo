import React from 'react';
import { MoreVertical, Pencil, Download, Move, Users, Trash2, Share2, Check } from "lucide-react";
import CustomDropdownItem from "../customComponent/CustomDropdownItem";

import { FileGridCardProps } from "./types";

export default function FileGridCard({
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
}: FileGridCardProps) {
  return (
    <div className="border border-[#E2E8F0] rounded-lg p-3 flex flex-col gap-3 relative">
      {onToggleSelect && (
        <div
          className="absolute top-5 left-5 z-10 cursor-pointer"
          onClick={onToggleSelect}
        >
          <div
            className={`w-5 h-5 rounded-[4px] flex items-center justify-center transition-colors ${isSelected ? "bg-[#635BFF] border border-[#635BFF]" : "border-2 border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"}`}
          >
            {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
          </div>
        </div>
      )}
      <div className="bg-[#F8FAFC] rounded-lg h-36 flex flex-col items-center justify-start border border-[#F1F5F9] pt-5 px-5 overflow-hidden">
        <div className="w-full bg-white rounded-t-lg border border-[#E2E8F0] border-b-0 h-full flex flex-col shadow-sm">
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#F1F5F9]">
            <div className="w-16 h-1.5 bg-[#E2E8F0] rounded-full"></div>
            <div className="w-6 h-1.5 bg-[#EEF2FF] rounded-full"></div>
          </div>
          <div className="flex flex-col px-3 pt-3 gap-2">
            <div className="flex items-center justify-between px-1">
              <div className="w-8 h-1 bg-[#F1F5F9] rounded-full"></div>
              <div className="w-8 h-1 bg-[#F1F5F9] rounded-full"></div>
              <div className="w-8 h-1 bg-[#F1F5F9] rounded-full"></div>
            </div>
            <div className="flex items-center justify-between px-1 py-1.5 bg-[#F8FAFC] rounded-lg">
              <div className="w-8 h-1 bg-[#E2E8F0] rounded-full"></div>
              <div className="w-8 h-1 bg-[#E2E8F0] rounded-full"></div>
              <div className="w-8 h-1 bg-[#E2E8F0] rounded-full"></div>
            </div>
            <div className="flex items-center justify-between px-1">
              <div className="w-8 h-1 bg-[#F1F5F9] rounded-full"></div>
              <div className="w-8 h-1 bg-[#F1F5F9] rounded-full"></div>
              <div className="w-8 h-1 bg-[#F1F5F9] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-1 pb-1 flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-bold text-[#1E293B]">{file.name}</span>
          <span className="text-[12px] font-medium text-[#94A3B8]">{file.type} • {file.size} • Created by {file.createdBy}</span>
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
    </div>
  );
}
