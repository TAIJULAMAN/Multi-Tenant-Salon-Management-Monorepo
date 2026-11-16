"use client";

import React from "react";
import { Eye } from "lucide-react";
import { SalaryRecord } from "@/components/team/types";

interface ExpandedRowDetailsProps {
  record: SalaryRecord;
  onViewPayslip: (record: SalaryRecord) => void;
}

export const ExpandedRowDetails: React.FC<ExpandedRowDetailsProps> = ({
  record,
  onViewPayslip,
}) => {
  return (
    <div className="flex items-center justify-between pl-[84px] pr-[150px] py-4 bg-white border-x border-[#E2E8F0]">
      <div className="flex items-center gap-12">
        <div>
          <div className="text-[10px] text-[#94A3B8] font-bold mb-1 uppercase tracking-wider">
            Gross Salary
          </div>
          <div className="text-[13px] font-bold text-[#1E293B]">
            {record.grossSalary}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-[#94A3B8] font-bold mb-1 uppercase tracking-wider">
            Net Salary
          </div>
          <div className="text-[13px] font-bold text-[#1E293B]">
            {record.netSalary}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-[#94A3B8] font-bold mb-1 uppercase tracking-wider">
            TRF (Monthly)
          </div>
          <div className="text-[13px] font-bold text-[#1E293B]">
            {record.trfMonthly}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-[#94A3B8] font-bold mb-1 uppercase tracking-wider">
            Cumulative TRF
          </div>
          <div className="text-[13px] font-bold text-[#1E293B]">
            {record.cumulativeTrf}
          </div>
        </div>
        <div>
          <div className="text-[10px] text-[#94A3B8] font-bold mb-1 uppercase tracking-wider">
            IBAN
          </div>
          <div className="text-[13px] font-bold text-[#1E293B]">
            {record.iban}
          </div>
        </div>
      </div>
      <button
        onClick={() => onViewPayslip(record)}
        className="bg-[#E0E7FF] text-[#635BFF] px-4 py-2 rounded-lg text-[12px] font-bold hover:bg-[#C7D2FE] transition-colors flex items-center gap-2"
      >
        <Eye className="w-4 h-4" />
        View Payslip
      </button>
    </div>
  );
};
