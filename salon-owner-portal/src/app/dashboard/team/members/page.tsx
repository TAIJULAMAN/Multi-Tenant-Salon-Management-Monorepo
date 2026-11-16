"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Download } from "lucide-react";

import AddEmployeeModal from "@/components/saloonOwner/team/AddEmployeeModal";
import DeleteMemberModal from "@/components/saloonOwner/team/DeleteMemberModal";
import AddTimeOffModal from "@/components/saloonOwner/team/AddTimeOffModal";
import { MemberData } from "@/components/team/types";
import { initialMembers } from "@/components/team/data";
import { TeamMembersTable } from "@/components/team/members/TeamMembersTable";

export default function MembersPage() {
  const [membersData, setMembersData] = useState<MemberData[]>(initialMembers);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTimeOffModalOpen, setIsTimeOffModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
  const [openActionMenuId, setOpenActionMenuId] = useState<number | string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedContractType, setSelectedContractType] = useState("");

  useEffect(() => {
    const handleClick = () => setOpenActionMenuId(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const handleDeleteClick = (member: MemberData) => {
    setSelectedMember(member);
    setIsDeleteModalOpen(true);
    setOpenActionMenuId(null);
  };

  const handleDeleteConfirm = () => {
    if (selectedMember) {
      setMembersData((prev) => prev.filter((m) => m.id !== selectedMember.id));
    }
    setIsDeleteModalOpen(false);
    setSelectedMember(null);
  };

  const handleOpenTimeOff = (member: MemberData) => {
    setSelectedMember(member);
    setIsTimeOffModalOpen(true);
    setOpenActionMenuId(null);
  };

  const handleToggleActionMenu = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenActionMenuId(openActionMenuId === id ? null : id);
  };

  const filteredMembers = membersData.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole ? member.role === selectedRole : true;
    const matchesContract = selectedContractType
      ? member.contractType === selectedContractType
      : true;
    return matchesSearch && matchesRole && matchesContract;
  });

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / itemsPerPage));
  const paginatedData = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full space-y-6">
      {/* Top Header & Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h1 className="text-[1.15rem] font-bold text-[#1E293B]">Members</h1>
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <Link
            href="/dashboard/team/members/import"
            className="border border-[#635BFF] text-[#635BFF] px-4 py-2.5 rounded-lg text-[13px] font-bold hover:bg-[#EEF2FF] transition-colors w-full sm:w-auto text-center"
          >
            Import Members
          </Link>
          <button className="bg-[#E0E7FF] text-[#635BFF] px-4 py-2.5 rounded-lg text-[13px] font-bold hover:bg-[#D6DFFE] transition-colors w-full sm:w-auto flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </button>

          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#635BFF] transition-colors text-[#64748B] bg-[#F8FAFC]"
          >
            <option value="">All Roles</option>
            <option value="Manager">Manager</option>
            <option value="Staff">Staff</option>
            <option value="Accountant">Accountant</option>
          </select>

          <select
            value={selectedContractType}
            onChange={(e) => {
              setSelectedContractType(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full sm:w-auto border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-[13px] outline-none focus:border-[#635BFF] transition-colors text-[#64748B] bg-[#F8FAFC]"
          >
            <option value="">All Contract Types</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Stage">Stage</option>
            <option value="Vat collaboration">Vat collaboration</option>
          </select>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto justify-center bg-[#635BFF] hover:bg-[#524be0] text-white px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center gap-2 transition-colors shrink-0 shadow-sm shadow-[#635BFF]/20"
          >
            <Plus className="w-4 h-4 shrink-0" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Table Section */}
      <TeamMembersTable
        members={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        openActionMenuId={openActionMenuId}
        onToggleActionMenu={handleToggleActionMenu}
        onOpenTimeOff={handleOpenTimeOff}
        onDeleteMember={handleDeleteClick}
        onPageChange={setCurrentPage}
      />

      {/* Modals */}
      <AddEmployeeModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <AddEmployeeModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        isEdit={true}
      />

      <DeleteMemberModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        memberName={selectedMember?.name}
      />

      <AddTimeOffModal
        isOpen={isTimeOffModalOpen}
        onClose={() => setIsTimeOffModalOpen(false)}
      />
    </div>
  );
}
