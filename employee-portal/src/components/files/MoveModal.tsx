import React, { useState } from "react";
import Modal from "@/components/customComponent/Modal";
import CustomSearch from "@/components/customComponent/CustomSearch";
import SubmitButton from "@/components/customComponent/SubmitButton";

import { FolderData } from "./types";

import { MoveModalProps } from "./types";

export default function MoveModal({ isOpen, onClose, folders }: MoveModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Move Folder">
      <div className="space-y-6">
        <CustomSearch
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search a folder"
        />

        <div className="space-y-3">
          <h3 className="text-[14px] font-bold text-[#1E293B]">Suggestions</h3>
          <div className="flex flex-col gap-2 max-h-[280px] overflow-y-auto pr-2">
            {filteredFolders.map((folder) => (
              <div key={folder.id} className="flex items-center gap-4 p-2.5 rounded-lg hover:bg-[#F8FAFC] transition-colors cursor-pointer border border-transparent hover:border-[#E2E8F0]">
                <div className="w-12 h-12 bg-[#F8FAFC] rounded-lg flex items-center justify-center border border-[#F1F5F9] shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V10C22 8.89543 21.1046 8 20 8H12L10 4H4Z" fill="#A5B4FC" />
                    <path d="M12 14H16" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-[14px] font-bold text-[#1E293B]">{folder.name}</span>
                  <span className="text-[12px] font-medium text-[#94A3B8]">Created by {folder.createdBy}</span>
                </div>
              </div>
            ))}
            {filteredFolders.length === 0 && (
              <div className="text-center text-[13px] text-[#64748B] py-4">
                No folders found.
              </div>
            )}
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <SubmitButton onClick={onClose} type="button">
            Save
          </SubmitButton>
        </div>
      </div>
    </Modal>
  );
}
