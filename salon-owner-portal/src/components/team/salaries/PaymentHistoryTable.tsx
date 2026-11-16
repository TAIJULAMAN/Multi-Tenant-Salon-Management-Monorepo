"use client";

import React from "react";
import { ChevronDown, ChevronUp, Eye } from "lucide-react";
import { SalaryRecord } from "@/components/team/types";
import { mockHistoryData } from "@/components/team/data";
import { ExpandedRowDetails } from "./ExpandedRowDetails";
import { Badge } from "@/components/ui/Badge";

interface PaymentHistoryTableProps {
  expandedRows: string[];
  onToggleRow: (id: string) => void;
  onViewPayslip: (record: SalaryRecord) => void;
}

export const PaymentHistoryTable: React.FC<PaymentHistoryTableProps> = ({
  expandedRows,
  onToggleRow,
  onViewPayslip,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {["December 2024", "November 2024"].map((monthSection) => (
        <div
          key={monthSection}
          className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-hidden"
        >
          <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#E2E8F0]">
            <h2 className="text-[16px] font-bold text-[#635BFF]">
              {monthSection}
            </h2>
            <div className="text-right mt-2 sm:mt-0">
              <div className="text-[15px] font-bold text-[#1E293B]">
                € 16,000.00
              </div>
              <div className="text-[12px] font-medium text-[#94A3B8]">
                5 Payments
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
                  <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B]">
                    Member
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockHistoryData.map((salary) => {
                  const uid = `${monthSection}-${salary.id}`;
                  return (
                    <React.Fragment key={uid}>
                      <tr
                        className={`border-b border-[#E2E8F0] transition-colors ${
                          expandedRows.includes(uid)
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
                          <Badge variant="success" dot>
                            Paid
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-4">
                            <button
                              onClick={() => onToggleRow(uid)}
                              className="text-[#635BFF] hover:bg-[#E0E7FF] p-1.5 rounded-lg transition-colors"
                            >
                              {expandedRows.includes(uid) ? (
                                <ChevronUp className="w-5 h-5" />
                              ) : (
                                <ChevronDown className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() => onViewPayslip(salary)}
                              className="border border-[#E0E7FF] text-[#635BFF] px-4 py-1.5 rounded-lg text-[12px] font-bold hover:bg-[#E0E7FF] transition-colors flex items-center gap-2"
                            >
                              <Eye className="w-4 h-4" />
                              View Payslip
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedRows.includes(uid) && (
                        <tr>
                          <td
                            colSpan={7}
                            className="p-0 border-b border-[#E2E8F0]"
                          >
                            <ExpandedRowDetails
                              record={salary}
                              onViewPayslip={onViewPayslip}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-[#F8FAFC] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[14px] font-bold text-[#1E293B]">
                Month Total
              </span>
              <span className="bg-[#635BFF] text-white px-4 py-1.5 rounded-full text-[13px] font-bold">
                € 16,000.00
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[14px] font-bold text-[#1E293B]">
                Average Salary
              </span>
              <span className="bg-[#635BFF] text-white px-4 py-1.5 rounded-full text-[13px] font-bold">
                € 16,000.00
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
