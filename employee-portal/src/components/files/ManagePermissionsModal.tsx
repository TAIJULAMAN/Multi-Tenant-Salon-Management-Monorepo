import React, { useState, useEffect, useRef } from "react";
import Modal from "@/components/customComponent/Modal";
import SubmitButton from "@/components/customComponent/SubmitButton";
import CustomSearch from "@/components/customComponent/CustomSearch";
import CustomSelect from "@/components/customComponent/CustomSelect";

import { ManagePermissionsModalProps, Member } from "./types";

const mockAvailableMembers: Member[] = [
  { id: 101, name: "Alice Johnson", email: "alice@beautywellness.com", role: "View Only", avatar: "avatar/icon1.png" },
  { id: 102, name: "Bob Smith", email: "bob@beautywellness.com", role: "View Only", avatar: "avatar/icon2.png" },
];

const ROLE_OPTIONS = ["View Only", "Edit Content", "Add Folder"];

export default function ManagePermissionsModal({ isOpen, onClose, mockMembers }: ManagePermissionsModalProps) {
  const [members, setMembers] = useState<Member[]>(mockMembers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMembers(mockMembers);
      setSearchTerm("");
    }
  }, [isOpen, mockMembers]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRoleChange = (memberId: number, newRole: string) => {
    setMembers(prev => prev.map(m => m.id === memberId ? { ...m, role: newRole } : m));
  };

  const handleAddMember = (newMember: Member) => {
    setMembers(prev => [...prev, newMember]);
    setSearchTerm("");
    setIsSearchOpen(false);
  };

  const filteredAvailable = mockAvailableMembers.filter(
    (m) =>
      !members.find((existing) => existing.id === m.id) &&
      (m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Permissions">
      <div className="space-y-6">
        <div className="space-y-2 relative" ref={searchRef}>
          <label className="text-[13px] font-bold text-[#1E293B]">Add Member <span className="text-[#EF4444]">*</span></label>
          <div onClick={() => setIsSearchOpen(true)}>
            <CustomSearch
              value={searchTerm}
              onChange={(val) => {
                setSearchTerm(val);
                setIsSearchOpen(true);
              }}
              placeholder="Search a member"
            />
          </div>

          {isSearchOpen && searchTerm && filteredAvailable.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#E2E8F0] rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] z-[60] py-2 flex flex-col max-h-48 overflow-y-auto">
              {filteredAvailable.map((m) => (
                <button
                  key={m.id}
                  onClick={() => handleAddMember(m)}
                  className="px-4 py-2.5 text-left flex items-center gap-3 hover:bg-[#F8FAFC] transition-colors"
                >
                  <img src={m.avatar} alt={m.name} className="w-8 h-8 rounded-lg object-cover mix-blend-multiply bg-[#F8FAFC] shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13.5px] font-medium text-[#1E293B] truncate">{m.name}</span>
                    <span className="text-[11px] text-[#94A3B8] truncate">{m.email}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
          {isSearchOpen && searchTerm && filteredAvailable.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-[#E2E8F0] rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] z-[60] py-3 px-4 text-center text-[13px] text-[#94A3B8]">
              No members found.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-[14px] font-bold text-[#1E293B]">People with Access</h3>
          <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2">
            {members.map((member) => (
              <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                <div className="flex items-center gap-3">
                  <img src={member.avatar} alt={member.name} className="w-10 h-10 rounded-lg object-cover mix-blend-multiply bg-[#F8FAFC] shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[14px] font-bold text-[#1E293B] truncate">{member.name}</span>
                    <span className="text-[12px] text-[#94A3B8] font-medium truncate">{member.email}</span>
                  </div>
                </div>
                <div className="relative shrink-0 w-full sm:w-[140px]">
                  <CustomSelect
                    value={member.role}
                    options={ROLE_OPTIONS}
                    onChange={(val) => handleRoleChange(member.id, val)}
                  />
                </div>
              </div>
            ))}
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
