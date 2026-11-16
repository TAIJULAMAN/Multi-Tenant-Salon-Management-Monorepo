import React from "react";
import { Check, Printer } from "lucide-react";
import SubmitButton from "@/components/customComponent/SubmitButton";
import { CashRegisterConfigSuccessProps } from "./types";

export default function CashRegisterConfigSuccess({ onTestPrint }: CashRegisterConfigSuccessProps) {
  return (
    <div className="flex flex-col items-center text-center py-6">
      <div className="w-20 h-20 rounded-full bg-[#ECFDF5] flex items-center justify-center mb-6">
        <Check className="w-10 h-10 text-[#10B981]" strokeWidth={3} />
      </div>

      <h2 className="text-[20px] font-bold text-[#1E293B] mb-2">Configuration completed!</h2>
      <p className="text-[13px] text-[#94A3B8] font-medium mb-8">The cash register has been successfully configured.</p>

      <div className="w-full bg-[#F8FAFC] rounded-lg p-6 text-left mb-2 relative overflow-hidden">
        <h4 className="text-[14px] font-bold text-[#1E293B] mb-6">Cash Register Details</h4>

        <div className="grid grid-cols-2 gap-y-6 mb-16">
          <div>
            <div className="text-[11px] font-medium text-[#94A3B8] mb-1">Brand</div>
            <div className="text-[13px] font-bold text-[#1E293B]">Epson</div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#94A3B8] mb-1">Model</div>
            <div className="text-[13px] font-bold text-[#1E293B]">FP-81 II</div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#94A3B8] mb-1">Serial</div>
            <div className="text-[13px] font-bold text-[#1E293B]">EP12345678</div>
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#94A3B8] mb-1">Alias</div>
            <div className="text-[13px] font-bold text-[#1E293B]">Register 1</div>
          </div>
        </div>
        <SubmitButton
          onClick={onTestPrint}
          className="sm:absolute sm:bottom-6 sm:right-6 mt-4 sm:mt-0 flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <Printer className="w-4 h-4" />
          Test print
        </SubmitButton>
      </div>
    </div>
  );
}
