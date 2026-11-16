"use client";

import React from "react";
import Link from "next/link";
import {
  MoreVertical,
  Eye,
  Clock,
  Calendar,
  Key,
  PauseCircle,
  Trash2,
} from "lucide-react";
import { MemberData } from "@/components/team/types";
import { Badge } from "@/components/ui/Badge";
import Pagination from "@/components/saloonOwner/common/CustomPagination";

interface TeamMembersTableProps {
  members: MemberData[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  openActionMenuId: string | number | null;
  onToggleActionMenu: (id: string, e: React.MouseEvent) => void;
  onOpenTimeOff: (member: MemberData) => void;
  onDeleteMember: (member: MemberData) => void;
  onPageChange: (page: number) => void;
}

export const TeamMembersTable: React.FC<TeamMembersTableProps> = ({
  members,
  currentPage,
  totalPages,
  itemsPerPage,
  openActionMenuId,
  onToggleActionMenu,
  onOpenTimeOff,
  onDeleteMember,
  onPageChange,
}) => {
  const getRoleVariant = (role: string) => {
    if (role === "Manager") return "info" as const;
    if (role === "Staff") return "warning" as const;
    if (role === "Accountant") return "purple" as const;
    return "neutral" as const;
  };

  const getStatusVariant = (status: string) => {
    if (status === "Active") return "success" as const;
    if (status === "Pending") return "warning" as const;
    if (status === "Inactive") return "danger" as const;
    return "neutral" as const;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-hidden">
      <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">
                Name
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">
                Role
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">
                Status
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">
                Employment Status
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">
                Contract Type
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">
                Last Active
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr
                key={member.id}
                className="border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors"
              >
                <td className="px-6 py-4 border-r border-[#E2E8F0]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0 bg-[#FCE7F3]">
                      <img
                        src={member.avatarUrl}
                        alt={member.name}
                        className="w-10 h-10 object-cover mix-blend-multiply"
                      />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[#1E293B] leading-tight">
                        {member.name}
                      </div>
                      <div className="text-[11px] text-[#94A3B8] font-medium mt-0.5">
                        {member.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0]">
                  <Badge variant={getRoleVariant(member.role)} size="sm">
                    {member.role}
                  </Badge>
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0]">
                  <Badge
                    variant={getStatusVariant(member.status)}
                    dot
                    size="sm"
                  >
                    {member.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0]">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold ${
                      member.employmentStatus.includes("Out of Team")
                        ? "bg-[#FFE4E6] text-[#F43F5E]"
                        : "bg-[#F1F5F9] text-[#475569]"
                    }`}
                  >
                    {member.employmentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0]">
                  <span className="inline-flex px-3 py-1 rounded-full text-[11px] font-bold border border-[#4ADE80] text-[#16A34A]">
                    {member.contractType}
                  </span>
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-[13px] text-[#475569]">
                  {member.lastActive}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="relative inline-block text-left">
                    <button
                      onClick={(e) => onToggleActionMenu(member.id, e)}
                      className="p-1.5 rounded-lg hover:bg-[#F1F5F9] text-[#1E293B] transition-colors flex items-center justify-center"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>

                    {openActionMenuId === member.id && (
                      <div
                        className="absolute right-1/2 translate-x-1/2 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-[#E2E8F0] py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link
                          href={`/dashboard/team/members/${member.id}`}
                          className="w-full flex items-center gap-3 px-4 py-2 text-[13px] font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#635BFF] transition-colors"
                        >
                          <Eye className="w-4 h-4 text-[#635BFF]" />
                          View Details
                        </Link>

                        {member.status !== "Inactive" && (
                          <button
                            onClick={() => onOpenTimeOff(member)}
                            className="w-full flex items-center gap-3 px-4 py-2 text-[13px] font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#635BFF] transition-colors text-left"
                          >
                            <Clock className="w-4 h-4 text-[#635BFF]" />
                            Add Time Off
                          </button>
                        )}

                        <button className="w-full flex items-center gap-3 px-4 py-2 text-[13px] font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#10B981] transition-colors text-left">
                          <Calendar className="w-4 h-4 text-[#10B981]" />
                          View Calendar
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-[13px] font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#64748B] transition-colors text-left">
                          <Key className="w-4 h-4 text-[#94A3B8]" />
                          Reset Password
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2 text-[13px] font-medium text-[#64748B] hover:bg-[#FFF1F2] hover:text-[#F59E0B] transition-colors text-left">
                          <PauseCircle className="w-4 h-4 text-[#F59E0B]" />
                          Suspend
                        </button>

                        {member.status === "Inactive" && (
                          <button
                            onClick={() => onDeleteMember(member)}
                            className="w-full flex items-center gap-3 px-4 py-2 text-[13px] font-medium text-[#64748B] hover:bg-[#FFF1F2] hover:text-[#EF4444] transition-colors text-left"
                          >
                            <Trash2 className="w-4 h-4 text-[#FCA5A5]" />
                            Delete user
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {members.length > 0 ? (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={members.length}
          itemsPerPage={itemsPerPage}
          itemName="members"
          onPageChange={onPageChange}
        />
      ) : (
        <div className="p-8 text-center text-[#64748B] text-[14px]">
          No members found matching your filters.
        </div>
      )}
    </div>
  );
};
