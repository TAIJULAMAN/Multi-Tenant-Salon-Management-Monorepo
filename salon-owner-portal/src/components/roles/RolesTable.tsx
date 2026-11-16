"use client";

import React from "react";
import Link from "next/link";
import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { RolesTableProps } from "./types";
import CustomDropdownItem from "@/components/customComponent/CustomDropdownItem";

export default function RolesTable({
  roles,
  activeDropdown,
  onToggleDropdown,
  onOpenEdit,
  onOpenDelete,
}: RolesTableProps) {
  return (
    <table className="w-full text-left border-collapse min-w-[800px]">
      <thead>
        <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
          <th className="px-6 py-5 text-sm font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] last:border-r-0 w-[20%]">Name</th>
          <th className="px-6 py-5 text-sm font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] last:border-r-0 w-[15%]">Role</th>
          <th className="px-6 py-5 text-sm font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] last:border-r-0 w-[20%]">Email</th>
          <th className="px-6 py-5 text-sm font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] last:border-r-0 w-[15%]">Date</th>
          <th className="px-6 py-5 text-sm font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] last:border-r-0 w-[20%]">Created by</th>
          <th className="px-6 py-5 text-sm font-bold text-[#1E293B] font-manrope text-center w-[10%]">Actions</th>
        </tr>
      </thead>
      <tbody>
        {roles.length > 0 ? (
          roles.map((role) => (
            <tr key={role.id} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors">
              <td className="px-6 py-4 border-r border-[#E2E8F0] last:border-r-0">
                <span className="text-[13px] font-semibold text-[#1E293B]">{role.name}</span>
              </td>
              <td className="px-6 py-4 border-r border-[#E2E8F0] last:border-r-0">
                <span className="inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#F1F5F9] text-[#475569]">{role.role}</span>
              </td>
              <td className="px-6 py-4 border-r border-[#E2E8F0] last:border-r-0">
                <span className="text-[13px] font-semibold text-[#1E293B]">{role.email}</span>
              </td>
              <td className="px-6 py-4 border-r border-[#E2E8F0] last:border-r-0 text-[13px] text-[#64748B] font-medium">
                {role.date}
              </td>
              <td className="px-6 py-4 border-r border-[#E2E8F0] last:border-r-0">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden shrink-0 ${role.avatarBg}`}>
                    <img src={role.avatarUrl} alt={role.createdBy} className="w-8 h-8 object-cover mix-blend-multiply" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-[#1E293B] leading-tight">{role.createdBy}</div>
                    <div className="text-[12px] text-[#94A3B8] font-medium mt-0.5">{role.creatorRole}</div>
                  </div>
                </div>
              </td>

              <td className="px-6 py-4">
                <div className="flex items-center justify-center">
                  <div className="relative action-dropdown-container">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onToggleDropdown(activeDropdown === role.id ? null : role.id);
                      }}
                      className="text-[#1E293B] hover:bg-[#F1F5F9] transition-colors p-2 rounded-lg cursor-pointer"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {activeDropdown === role.id && (
                      <div
                        className="absolute right-0 top-full mt-1 z-[60] min-w-[140px] bg-white rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.15)] border border-[#E2E8F0] py-2 flex flex-col animate-in fade-in slide-in-from-top-2 duration-150"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link href={`/dashboard/roles/${role.id}`} className="block w-full">
                          <CustomDropdownItem
                            onClick={() => onToggleDropdown(null)}
                            icon={<Eye className="w-4 h-4 text-[#635BFF]" />}
                            label="View"
                          />
                        </Link>
                        <CustomDropdownItem
                          onClick={() => {
                            onOpenEdit(role);
                            onToggleDropdown(null);
                          }}
                          icon={<Pencil className="w-4 h-4 text-[#635BFF]" />}
                          label="Edit"
                        />
                        <CustomDropdownItem
                          onClick={() => {
                            onOpenDelete(role);
                            onToggleDropdown(null);
                          }}
                          icon={<Trash2 className="w-4 h-4 text-[#F43F5E]" />}
                          label="Delete"
                          textColor="text-[#F43F5E]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="px-6 py-8 text-center text-[13px] font-medium text-[#94A3B8]">
              No roles found.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
