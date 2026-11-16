"use client";

import React, { useState } from "react";
import { MessageCircle, Mail, MessageSquare, Eye } from "lucide-react";
import CustomSelect from "@/components/customComponent/CustomSelect";
import Pagination from "@/components/customComponent/Pagination";

export interface CommLogItem {
  id: string;
  channel: "WhatsApp" | "Email" | "SMS";
  title: string;
  employee: string;
  date: string;
  time: string;
  status: "Delivered" | "Sent" | "Read" | "Failed";
  source: string;
}

interface ClientCommunicationLogTabProps {
  logs: CommLogItem[];
  onViewLog?: (log: CommLogItem) => void;
}

export default function ClientCommunicationLogTab({ logs, onViewLog }: ClientCommunicationLogTabProps) {
  const [channelFilter, setChannelFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredLogs = logs.filter((log) => {
    if (channelFilter !== "All" && log.channel !== channelFilter) return false;
    if (statusFilter !== "All Statuses" && log.status !== statusFilter) return false;
    if (dateFilter !== "All Time" && log.date !== dateFilter) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0] p-5 sm:p-7 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-[16px] font-bold text-[#1E293B] font-manrope">Communication Log</h2>
        <div className="flex items-center gap-2 text-[12px] font-medium text-[#94A3B8]">
          <span>Last time contacted:</span>
          <span className="bg-[#EEF2FF] text-[#635BFF] px-2.5 py-1 rounded-lg text-[11px] font-bold">
            07/08/2025 (via WhatsApp, by Maria)
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8 mb-6">
        <div>
          <span className="block text-[11px] font-medium text-[#94A3B8] mb-2">Channel</span>
          <CustomSelect
            value={channelFilter}
            onChange={setChannelFilter}
            options={["All", "Email", "SMS", "WhatsApp"]}
            buttonClassName="h-9 px-3 text-[12px] font-bold text-[#1E293B] bg-white border border-[#E2E8F0] rounded-lg min-w-[130px]"
          />
        </div>

        <div className="flex items-center gap-6">
          <div>
            <span className="block text-[11px] font-medium text-[#94A3B8] mb-2">Status</span>
            <CustomSelect
              value={statusFilter}
              onChange={setStatusFilter}
              options={["All Statuses", "Delivered", "Sent", "Read", "Failed"]}
              buttonClassName="h-9 px-3 text-[12px] font-bold text-[#1E293B] bg-white border border-[#E2E8F0] rounded-lg min-w-[130px]"
            />
          </div>

          <div>
            <span className="block text-[11px] font-medium text-[#94A3B8] mb-2">Date Range</span>
            <CustomSelect
              value={dateFilter}
              onChange={setDateFilter}
              options={["All Time", "07/08/2025"]}
              buttonClassName="h-9 px-3 text-[12px] font-bold text-[#1E293B] bg-white border border-[#E2E8F0] rounded-lg min-w-[130px]"
            />
          </div>
        </div>
      </div>

      <div className="border border-[#E2E8F0] rounded-xl overflow-hidden mb-6">
        <div className="flex flex-col min-w-[700px] divide-y divide-[#E2E8F0]">
          {paginatedLogs.map((log) => (
            <div key={log.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 hover:bg-[#F8FAFC] transition-colors">
              <div className="flex items-start md:items-center gap-4">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    log.channel === "WhatsApp"
                      ? "bg-[#DCFCE7] text-[#16A34A]"
                      : log.channel === "Email"
                      ? "bg-[#EEF2FF] text-[#635BFF]"
                      : "bg-[#FEFCE8] text-[#EAB308]"
                  }`}
                >
                  {log.channel === "WhatsApp" && <MessageCircle className="w-4 h-4" />}
                  {log.channel === "Email" && <Mail className="w-4 h-4" />}
                  {log.channel === "SMS" && <MessageSquare className="w-4 h-4" />}
                </div>

                <div>
                  <h4 className="text-[13px] font-bold text-[#1E293B] mb-1.5">{log.title}</h4>
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

              <div className="flex items-center gap-4">
                {/* Status Badge */}
                <span
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center ${
                    log.status === "Delivered"
                      ? "bg-[#EEF2FF] text-[#635BFF]"
                      : log.status === "Sent"
                      ? "bg-[#CCFBF1] text-[#14B8A6]"
                      : log.status === "Read"
                      ? "bg-[#DCFCE7] text-[#16A34A]"
                      : "bg-[#FFE4E6] text-[#F43F5E]"
                  }`}
                >
                  {log.status}
                </span>

                {/* Source Badge */}
                <span
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center ${
                    log.source === "Staff Member"
                      ? "text-[#635BFF] bg-[#EEF2FF]"
                      : "text-[#14B8A6] bg-[#CCFBF1]"
                  }`}
                >
                  {log.source}
                </span>

                {/* View Action */}
                {onViewLog && (
                  <button
                    onClick={() => onViewLog(log)}
                    className="w-[30px] h-[30px] rounded-lg bg-[#EEF2FF] text-[#635BFF] flex items-center justify-center hover:bg-[#E0E7FF] transition-colors shadow-sm cursor-pointer"
                    title="View Log"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}

          {paginatedLogs.length === 0 && (
            <div className="py-12 text-center text-[#94A3B8] text-[13px] font-medium">
              No communication logs matching the selected filters.
            </div>
          )}
        </div>
      </div>

      {filteredLogs.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredLogs.length}
          itemsPerPage={itemsPerPage}
          itemsName="logs"
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
