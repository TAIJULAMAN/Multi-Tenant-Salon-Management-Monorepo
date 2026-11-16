"use client";

import React from "react";
import { Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { SalaryRecord } from "@/components/team/types";
import { ExpandedRowDetails } from "./ExpandedRowDetails";
import { Badge } from "@/components/ui/Badge";

interface PendingSalariesTableProps {
  salaries: SalaryRecord[];
  expandedRows: string[];
  onToggleRow: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewPayslip: (record: SalaryRecord) => void;
}

export const PendingSalariesTable: React.FC<PendingSalariesTableProps> = ({
  salaries,
  expandedRows,
  onToggleRow,
  onApprove,
  onReject,
  onViewPayslip,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#F8F9FE] border-y border-[#E2E8F0]">
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B]">
                Team Member
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B]">
                Role
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B]">
                Net Amount
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B]">
                Month
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B]">
                Date
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B]">
                Status
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((salary) => (
              <React.Fragment key={salary.id}>
                <tr
                  className={`border-b border-[#E2E8F0] transition-colors ${
                    expandedRows.includes(salary.id)
                      ? "bg-[#F8F9FE]"
                      : "hover:bg-[#F8FAFC]"
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0 ${salary.avatarBg}`}
                      >
                        <img
                          src={salary.avatarUrl}
                          alt={salary.name}
                          className="w-10 h-10 object-cover mix-blend-multiply"
                        />
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-[#1E293B] leading-tight">
                          {salary.name}
                        </div>
                        <div className="text-[11px] text-[#94A3B8] font-medium mt-0.5">
                          Uploaded by: {salary.uploader}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="warning">{salary.role}</Badge>
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#1E293B] font-medium">
                    {salary.netAmount}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#475569]">
                    {salary.month}
                  </td>
                  <td className="px-6 py-4 text-[13px] text-[#475569]">
                    {salary.date}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="warning" dot>
                      Under Review
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => onToggleRow(salary.id)}
                        className="text-[#635BFF] hover:bg-[#E0E7FF] p-1.5 rounded-lg transition-colors"
                      >
                        {expandedRows.includes(salary.id) ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                      <button
                        onClick={() => onApprove(salary.id)}
                        className="w-8 h-8 rounded-lg bg-[#CCFBF1] hover:bg-[#99F6E4] text-[#0D9488] flex items-center justify-center transition-colors"
                        title="Approve salary"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onReject(salary.id)}
                        className="w-8 h-8 rounded-lg bg-[#FCE7F3] hover:bg-[#FBCFE8] text-[#F43F5E] flex items-center justify-center transition-colors"
                        title="Reject salary"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRows.includes(salary.id) && (
                  <tr>
                    <td colSpan={7} className="p-0 border-b border-[#E2E8F0]">
                      <ExpandedRowDetails
                        record={salary}
                        onViewPayslip={onViewPayslip}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 bg-[#F8FAFC] rounded-lg p-4 flex items-center justify-between border border-[#E2E8F0]">
        <span className="text-[14px] font-bold text-[#1E293B]">
          Total Amount
        </span>
        <span className="bg-[#635BFF] text-white px-4 py-1.5 rounded-full text-[13px] font-bold">
          € 16,000.00
        </span>
      </div>
    </div>
  );
};
