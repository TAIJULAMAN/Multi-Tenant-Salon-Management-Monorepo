"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Clock,
  MoreVertical,
  Eye,
  Edit,
  Send,
  Users,
  Briefcase,
  Trash2,
} from "lucide-react";

interface WaiversTableProps {
  activeTab: string;
  paginatedWaivers: any[];
  openMenuId: string | null;
  toggleMenu: (id: string) => void;
  setOpenMenuId: (id: string | null) => void;
  handleOpenEdit: (waiver: any) => void;
  handleOpenSignNow: (waiver: any) => void;
  handleOpenAssign: (waiver: any) => void;
  handleOpenAssignEmployee: (waiver: any) => void;
  handleOpenDelete: (waiver: any) => void;
}

export default function WaiversTable({
  activeTab,
  paginatedWaivers,
  openMenuId,
  toggleMenu,
  setOpenMenuId,
  handleOpenEdit,
  handleOpenSignNow,
  handleOpenAssign,
  handleOpenAssignEmployee,
  handleOpenDelete,
}: WaiversTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-visible">
      <div className="overflow-x-auto min-h-[450px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <th className="py-5 px-6 text-[14px] font-bold text-[#1E293B] whitespace-nowrap">
                Name
              </th>
              {activeTab === "Waiver Templates" ? (
                <>
                  <th className="py-5 px-6 text-[14px] font-bold text-[#1E293B] whitespace-nowrap">
                    Signers
                  </th>
                  <th className="py-5 px-6 text-[14px] font-bold text-[#1E293B] whitespace-nowrap">
                    Signed
                  </th>
                  <th className="py-5 px-6 text-[14px] font-bold text-[#1E293B] whitespace-nowrap">
                    Last Update
                  </th>
                </>
              ) : (
                <>
                  <th className="py-5 px-6 text-[14px] font-bold text-[#1E293B] whitespace-nowrap">
                    Signed By
                  </th>
                  <th className="py-5 px-6 text-[14px] font-bold text-[#1E293B] whitespace-nowrap">
                    Date Signed
                  </th>
                </>
              )}
              <th className="py-5 px-6 text-[14px] font-bold text-[#1E293B] text-center whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {paginatedWaivers.map((waiver) => (
              <tr
                key={waiver.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#EEF2FF] border border-[#E0E7FF] flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-[#635BFF]" />
                    </div>
                    <span className="text-[#1E293B] font-bold text-[14px]">
                      {waiver.name}
                    </span>
                  </div>
                </td>
                {activeTab === "Waiver Templates" ? (
                  <>
                    <td className="py-4 px-6">
                      <span className="text-[#475569] font-medium text-[14px]">
                        {waiver.signers}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[#475569] font-medium text-[14px]">
                        {waiver.signedCount}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#94A3B8]" />
                        <span className="text-[#475569] font-medium text-[14px]">
                          {waiver.lastUpdate}
                        </span>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-4 px-6">
                      <span className="text-[#475569] font-medium text-[14px]">
                        {waiver.signedBy || "Unknown Client"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[#94A3B8]" />
                        <span className="text-[#475569] font-medium text-[14px]">
                          {waiver.dateSigned || waiver.lastUpdate}
                        </span>
                      </div>
                    </td>
                  </>
                )}
                <td className="py-4 px-6 text-center relative action-menu-container">
                  <button
                    onClick={() => toggleMenu(waiver.id)}
                    className="text-[#64748B] hover:text-[#1E293B] transition-colors p-2 rounded-lg hover:bg-[#F1F5F9] inline-flex items-center justify-center cursor-pointer"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {openMenuId === waiver.id && (
                    <div className="absolute right-10 top-12 w-[240px] bg-white rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-[#E2E8F0] py-2 z-50 text-left">
                      <Link
                        href={`/dashboard/waivers/${waiver.id}`}
                        className="w-full px-5 py-2.5 text-[14px] font-medium text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-3 transition-colors"
                      >
                        <Eye className="w-[18px] h-[18px] text-[#635BFF]" />
                        View
                      </Link>
                      {activeTab === "Waiver Templates" && (
                        <>
                          <button
                            onClick={() => {
                              handleOpenEdit(waiver);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-5 py-2.5 text-[14px] font-medium text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-3 transition-colors cursor-pointer"
                          >
                            <Edit className="w-[18px] h-[18px] text-[#635BFF]" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              handleOpenSignNow(waiver);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-5 py-2.5 text-[14px] font-medium text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-3 transition-colors cursor-pointer"
                          >
                            <Send className="w-[18px] h-[18px] text-[#10B981]" />
                            Sign Now/Send To
                          </button>
                          <button
                            onClick={() => {
                              handleOpenAssign(waiver);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-5 py-2.5 text-[14px] font-medium text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-3 transition-colors cursor-pointer"
                          >
                            <Users className="w-[18px] h-[18px] text-[#10B981]" />
                            Assign to Client's Profiles
                          </button>
                          <button
                            onClick={() => {
                              handleOpenAssignEmployee(waiver);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-5 py-2.5 text-[14px] font-medium text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-3 transition-colors cursor-pointer"
                          >
                            <Briefcase className="w-[18px] h-[18px] text-[#10B981]" />
                            Assign to Employee
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          handleOpenDelete(waiver);
                          setOpenMenuId(null);
                        }}
                        className="w-full px-5 py-2.5 text-[14px] font-medium text-[#EF4444] hover:bg-[#FEF2F2] flex items-center gap-3 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-[18px] h-[18px] text-[#EF4444]" />
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
