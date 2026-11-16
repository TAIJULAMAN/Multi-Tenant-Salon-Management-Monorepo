import React from "react";
import { Monitor, Download } from "lucide-react";
import CashRegisterProgressSteps from "./CashRegisterProgressSteps";
import { CashRegisterNotFoundProps } from "./types";

export default function CashRegisterNotFound({ onRetry }: CashRegisterNotFoundProps) {
  return (
    <div className="py-4">
      <CashRegisterProgressSteps activeStep={1} />
      <div className="border border-[#E2E8F0] rounded-lg p-10 flex flex-col items-center text-center mt-6">
        <div className="w-16 h-16 flex items-center justify-center mb-4">
          <Monitor className="w-12 h-12 text-[#1E293B]" strokeWidth={1.5} />
        </div>
        <h3 className="text-[18px] font-bold text-[#1E293B] mb-3">Agent not found</h3>
        <p className="text-[13px] text-[#94A3B8] font-medium max-w-[340px] mb-8">
          The agent was not found on your computer. Download and install the software to connect cash registers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 w-full">
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#E0E7FF] hover:bg-[#EEF2FF] text-[#635BFF] px-6 py-2.5 rounded-lg font-bold text-[12px] transition-colors">
            <Download className="w-4 h-4" />
            Download for Windows
          </button>
          <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#F0FDFA] hover:bg-[#CCFBF1] text-[#2DD4BF] px-6 py-2.5 rounded-lg font-bold text-[12px] transition-colors">
            <Download className="w-4 h-4" />
            Download for Mac
          </button>
        </div>

        <button
          onClick={onRetry}
          className="text-[13px] font-semibold text-[#635BFF] hover:underline"
        >
          I've already installed the agent, try again
        </button>
      </div>
    </div>
  );
}
