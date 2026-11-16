"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import PageHeader from "@/components/saloonOwner/customComponent/CustomPageHeader";
import { RoleData } from "@/components/roles/types";
import { INITIAL_ROLES } from "@/components/roles/data";
import RolesTable from "@/components/roles/RolesTable";
import EditRoleModal from "@/components/roles/EditRoleModal";
import DeleteRoleModal from "@/components/roles/DeleteRoleModal";
import SubmitButton from "@/components/customComponent/SubmitButton";
import CustomPagination from "@/components/saloonOwner/common/CustomPagination";

export default function RolesPage() {
  const [rolesData, setRolesData] = useState<RoleData[]>(INITIAL_ROLES);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleData | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

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

  const handleOpenEdit = (role: RoleData) => {
    setSelectedRole(role);
    setIsEditOpen(true);
  };

  const handleOpenDelete = (role: RoleData) => {
    setSelectedRole(role);
    setIsDeleteOpen(true);
  };

  const handleEditRole = (updatedData: {
    name: string;
    email: string;
    role: string;
    date: string;
    createdBy: string;
    creatorRole: string;
    avatarBg: string;
    avatarUrl: string;
  }) => {
    if (!selectedRole) return;
    setRolesData(
      rolesData.map((role) =>
        role.id === selectedRole.id
          ? { ...role, ...updatedData, lastUpdate: "Just now" }
          : role,
      ),
    );
    setIsEditOpen(false);
  };

  const handleDeleteRole = () => {
    if (!selectedRole) return;
    setRolesData(rolesData.filter((role) => role.id !== selectedRole.id));
    setIsDeleteOpen(false);
  };

  const totalPages = Math.ceil(rolesData.length / itemsPerPage);
  const paginatedData = rolesData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="w-full space-y-6">
      <PageHeader
        title="Roles"
        action={
          <Link href="/dashboard/roles/create">
            <SubmitButton className="flex items-center gap-2 px-4 py-2.5">
              <Plus className="w-4 h-4" />
              Add Role
            </SubmitButton>
          </Link>
        }
      />
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0]">
        <div className="overflow-x-auto min-h-[300px]">
          <RolesTable
            roles={paginatedData}
            activeDropdown={activeDropdown}
            onToggleDropdown={setActiveDropdown}
            onOpenEdit={handleOpenEdit}
            onOpenDelete={handleOpenDelete}
          />
        </div>
        {rolesData.length > 0 && (
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={rolesData.length}
            itemsPerPage={itemsPerPage}
            itemName="roles"
            onPageChange={setCurrentPage}
          />
        )}
      </div>
      <EditRoleModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        role={selectedRole}
        onSubmit={handleEditRole}
      />
      <DeleteRoleModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        role={selectedRole}
        onConfirm={handleDeleteRole}
      />
    </div>
  );
}
