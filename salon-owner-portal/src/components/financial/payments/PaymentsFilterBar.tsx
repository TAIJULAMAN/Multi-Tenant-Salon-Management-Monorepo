"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import { CustomSelect } from "@/components/common/CustomSelect";

interface PaymentsFilterBarProps {
  activeMethod: string;
  setActiveMethod: (v: string) => void;
  activePaymentStatus: string;
  setActivePaymentStatus: (v: string) => void;
  activeReceiptStatus: string;
  setActiveReceiptStatus: (v: string) => void;
  hasActiveFilters: boolean;
  onResetFilters: () => void;
}

const FilterGroup = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (val: string) => void;
}) => (
  <div className="flex flex-col gap-1.5 flex-1 min-w-[200px]">
    <label className="text-[12px] font-semibold text-[#64748B]">{label}</label>
    <CustomSelect
      value={value}
      onChange={onChange}
      options={options}
      
      className="w-full bg-[#F8FAFC] border-[#E2E8F0] rounded-lg text-[13px] font-bold text-[#1E293B]"
    />
  </div>
);

export default function PaymentsFilterBar({
  activeMethod,
  setActiveMethod,
  activePaymentStatus,
  setActivePaymentStatus,
  activeReceiptStatus,
  setActiveReceiptStatus,
  hasActiveFilters,
  onResetFilters,
}: PaymentsFilterBarProps) {
  return (
    <div className="flex flex-wrap items-end gap-4 pt-5 mt-6 border-t border-[#E2E8F0]">
      <FilterGroup
        label="Payment Method"
        value={activeMethod}
        onChange={setActiveMethod}
        options={["Cash", "Card Terminal", "Gift Card", "Online Payment"]}
      />
      <FilterGroup
        label="Payment Status"
        value={activePaymentStatus}
        onChange={setActivePaymentStatus}
        options={["Fully Paid", "Half Paid", "Not Paid"]}
      />
      <FilterGroup
        label="Receipt Status"
        value={activeReceiptStatus}
        onChange={setActiveReceiptStatus}
        options={["Completed", "Half Printed", "Not Issued"]}
      />

      {hasActiveFilters && (
        <button
          onClick={onResetFilters}
          className="px-3.5 py-2 text-[12px] font-bold text-[#F43F5E] hover:bg-[#FFF1F2] rounded-lg transition-colors border border-[#FFE4E6] flex items-center gap-1.5 h-[38px] shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Filters
        </button>
      )}
    </div>
  );
}
