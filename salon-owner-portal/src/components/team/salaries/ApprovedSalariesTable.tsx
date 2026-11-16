"use client";

import React from "react";
import { ChevronDown, ChevronUp, Eye } from "lucide-react";
import { SalaryRecord } from "@/components/team/types";
import { ExpandedRowDetails } from "./ExpandedRowDetails";
import { Badge } from "@/components/ui/Badge";

interface ApprovedSalariesTableProps {
  salaries: SalaryRecord[];
  expandedRows: string[];
  onToggleRow: (id: string) => void;
  onViewPayslip: (record: SalaryRecord) => void;
  onStartPaymentWorkflow: () => void;
}

export const ApprovedSalariesTable: React.FC<ApprovedSalariesTableProps> = ({
  salaries,
  expandedRows,
  onToggleRow,
  onViewPayslip,
  onStartPaymentWorkflow,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6">
      <h2 className="text-[15px] font-bold text-[#1E293B] mb-6">
        Approved and Ready for Payment
      </h2>

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
                    {salary.date}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="success" dot>
                      Approved
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
                        onClick={() => onViewPayslip(salary)}
                        className="p-1.5 text-[#635BFF] hover:bg-[#E0E7FF] rounded-lg transition-colors"
                        title="View Payslip"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
                {expandedRows.includes(salary.id) && (
                  <tr>
                    <td colSpan={6} className="p-0 border-b border-[#E2E8F0]">
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

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto flex-1 bg-[#F8FAFC] rounded-lg p-4 flex items-center justify-between border border-[#E2E8F0]">
          <span className="text-[14px] font-bold text-[#1E293B]">
            Total Net Amount
          </span>
          <span className="bg-[#635BFF] text-white px-4 py-1.5 rounded-full text-[13px] font-bold">
            € 3,200.00
          </span>
        </div>
        <button
          onClick={onStartPaymentWorkflow}
          className="w-full sm:w-auto bg-[#635BFF] hover:bg-[#0F172A] text-white px-8 py-4 rounded-lg font-bold text-[13px] flex items-center justify-center gap-3 transition-colors shadow-sm"
        >
          <span>Pay With Revolut</span>
        </button>
      </div>
    </div>
  );
};
