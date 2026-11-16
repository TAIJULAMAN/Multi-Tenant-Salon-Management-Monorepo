"use client";

import React, { useState } from "react";
import {
  MessageCircle,
  Mail,
  MessageSquare,
  ChevronDown,
  Eye,
  Check,
} from "lucide-react";
import Pagination from "@/components/saloonOwner/common/CustomPagination";
import { mockCommunicationLogs } from "@/components/clients/data";

interface ClientCommunicationLogTabProps {
  onOpenCommLogDetail: (log: any) => void;
}

export default function ClientCommunicationLogTab({
  onOpenCommLogDetail,
}: ClientCommunicationLogTabProps) {
  const [activeCommChannelFilter, setActiveCommChannelFilter] = useState("All");
  const [activeCommStatusFilter, setActiveCommStatusFilter] =
    useState("All Statuses");
  const [activeCommDateFilter, setActiveCommDateFilter] = useState("All Time");
  const [currentCommLogPage, setCurrentCommLogPage] = useState(1);

  const filteredCommLogs = mockCommunicationLogs.filter((log) => {
    const channelMatch =
      activeCommChannelFilter === "All" ||
      log.channel === activeCommChannelFilter;
    const statusMatch =
      activeCommStatusFilter === "All Statuses" ||
      log.status === activeCommStatusFilter;
    const dateMatch =
      activeCommDateFilter === "All Time" || log.date === activeCommDateFilter;
    return channelMatch && statusMatch && dateMatch;
  });

  const COMM_LOGS_PER_PAGE = 5;
  const commLogsTotalItems = filteredCommLogs.length;
  const commLogsTotalPages =
    Math.ceil(commLogsTotalItems / COMM_LOGS_PER_PAGE) || 1;
  const commLogsPaginated = filteredCommLogs.slice(
    (currentCommLogPage - 1) * COMM_LOGS_PER_PAGE,
    currentCommLogPage * COMM_LOGS_PER_PAGE,
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-5 sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-[16px] font-bold text-[#1E293B] font-manrope">
          Communication Log
        </h2>
        <div className="flex items-center gap-2 text-[12px] font-medium text-[#94A3B8]">
          <span>Last time contacted:</span>
          <span className="bg-[#EEF2FF] text-[#635BFF] px-3 py-1 rounded-full font-bold">
            07/08/2025 (via WhatsApp, by Maria)
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8 mb-6">
        <div>
          <span className="block text-[11px] font-medium text-[#94A3B8] mb-2">
            Channel
          </span>
          <div className="relative">
            <select
              value={activeCommChannelFilter}
              onChange={(e) => setActiveCommChannelFilter(e.target.value)}
              className="appearance-none bg-transparent border border-[#E2E8F0] rounded-lg px-4 py-1.5 text-[12px] font-bold text-[#1E293B] hover:bg-[#F8FAFC] focus:outline-none focus:border-[#635BFF] transition-colors w-[130px] pr-8 cursor-pointer"
            >
              <option value="All">All</option>
              <option value="Email">Email</option>
              <option value="SMS">SMS</option>
              <option value="WhatsApp">WhatsApp</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <span className="block text-[11px] font-medium text-[#94A3B8] mb-2">
              Status
            </span>
            <div className="relative">
              <select
                value={activeCommStatusFilter}
                onChange={(e) => setActiveCommStatusFilter(e.target.value)}
                className="appearance-none bg-transparent border border-[#E2E8F0] rounded-lg px-4 py-1.5 text-[12px] font-bold text-[#1E293B] hover:bg-[#F8FAFC] focus:outline-none focus:border-[#635BFF] transition-colors w-[130px] pr-8 cursor-pointer"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Delivered">Delivered</option>
                <option value="Sent">Sent</option>
                <option value="Read">Read</option>
                <option value="Failed">Failed</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <span className="block text-[11px] font-medium text-[#94A3B8] mb-2">
              Date Range
            </span>
            <div className="relative">
              <select
                value={activeCommDateFilter}
                onChange={(e) => setActiveCommDateFilter(e.target.value)}
                className="appearance-none bg-transparent border border-[#E2E8F0] rounded-lg px-4 py-1.5 text-[12px] font-bold text-[#1E293B] hover:bg-[#F8FAFC] focus:outline-none focus:border-[#635BFF] transition-colors w-[130px] pr-8 cursor-pointer"
              >
                <option value="All Time">All Time</option>
                <option value="07/08/2025">07/08/2025</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="border border-[#E2E8F0] rounded-lg overflow-x-auto mb-6">
        <div className="flex flex-col min-w-[700px]">
          {commLogsPaginated.map((log, index) => (
            <div
              key={log.id}
              className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 ${index !== commLogsPaginated.length - 1 ? "border-b border-[#E2E8F0]" : ""}`}
            >
              <div className="flex items-start md:items-center gap-4">
                <div
                  className={`w-[36px] h-[36px] rounded-full flex items-center justify-center shrink-0 ${
                    log.channel === "WhatsApp"
                      ? "bg-[#DCFCE7] text-[#16A34A]"
                      : log.channel === "Email"
                        ? "bg-[#EEF2FF] text-[#635BFF]"
                        : "bg-[#FEFCE8] text-[#EAB308]"
                  }`}
                >
                  {log.channel === "WhatsApp" && (
                    <MessageCircle className="w-4 h-4" />
                  )}
                  {log.channel === "Email" && <Mail className="w-4 h-4" />}
                  {log.channel === "SMS" && (
                    <MessageSquare className="w-4 h-4" />
                  )}
                </div>

                <div>
                  <h4 className="text-[13px] font-bold text-[#1E293B] mb-1.5">
                    {log.title}
                  </h4>
                  <div className="flex items-center gap-3 text-[11px] font-medium text-[#94A3B8]">
                    {log.employee !== "System" ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full overflow-hidden">
                          <img
                            src="https://i.pravatar.cc/150?img=47"
                            alt="User"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[#64748B]">{log.employee}</span>
                      </div>
                    ) : (
                      <span className="text-[#64748B]">System</span>
                    )}
                    <span>{log.date}</span>
                    <span>{log.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                {/* Status Badge */}
                <span
                  className={`px-2.5 py-1 rounded-[6px] border text-[10px] font-bold inline-flex items-center ${
                    log.status === "Delivered"
                      ? "bg-[#EEF2FF] text-[#635BFF] border-[#635BFF]/30"
                      : log.status === "Sent"
                        ? "bg-[#CCFBF1] text-[#14B8A6] border-[#14B8A6]/30"
                        : log.status === "Read"
                          ? "bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]/30"
                          : "bg-[#FFE4E6] text-[#F43F5E] border-[#F43F5E]/30"
                  }`}
                >
                  {log.status}
                </span>

                {/* Source Badge */}
                <span
                  className={`px-2.5 py-1 rounded-[6px] border text-[10px] font-bold inline-flex items-center ${
                    log.source === "Staff Member"
                      ? "border-[#635BFF]/30 text-[#635BFF] bg-[#EEF2FF]/50"
                      : "border-[#14B8A6]/30 text-[#14B8A6] bg-[#CCFBF1]/50"
                  }`}
                >
                  {log.source}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onOpenCommLogDetail(log)}
                    className="w-[30px] h-[30px] rounded-lg bg-[#EEF2FF] text-[#635BFF] flex items-center justify-center hover:bg-[#E0E7FF] transition-colors shadow-sm cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {log.status === "Sent" && (
                    <button
                      type="button"
                      className="w-[30px] h-[30px] rounded-lg border border-[#E2E8F0] text-[#635BFF] flex items-center justify-center hover:bg-[#EEF2FF] transition-colors shadow-sm cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <Pagination
          currentPage={currentCommLogPage}
          totalPages={commLogsTotalPages}
          totalItems={commLogsTotalItems}
          itemsPerPage={COMM_LOGS_PER_PAGE}
          itemName="logs"
          onPageChange={setCurrentCommLogPage}
        />
      </div>
    </div>
  );
}
