import React from "react";
import { Search } from "lucide-react";
import CashRegisterProgressSteps from "./CashRegisterProgressSteps";
import { CashRegisterSearchingProps } from "./types";

export default function CashRegisterSearching({ loadingProgress }: CashRegisterSearchingProps) {
  return (
    <div className="py-4">
      <CashRegisterProgressSteps activeStep={2} />
      <div className="border border-[#E2E8F0] rounded-lg p-10 flex flex-col items-center text-center mt-6">
        <div className="w-16 h-16 flex items-center justify-center mb-6">
          <Search className="w-12 h-12 text-[#1E293B]" strokeWidth={1.5} />
        </div>
        <p className="text-[14px] font-bold text-[#1E293B] mb-6">Searching for connected cash registers...</p>

        {/* Progress Bar */}
        <div className="w-full max-w-[300px] h-3 bg-[#F1F5F9] rounded-full overflow-hidden relative mb-4">
          <div
            className="absolute top-0 left-0 bottom-0 bg-[#635BFF] transition-all duration-300"
            style={{ width: `${loadingProgress}%` }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-[#635BFF] mix-blend-difference">
            {loadingProgress}%
          </div>
        </div>

        <p className="text-[12px] font-semibold text-[#10B981]">Found: Epson FP-81 II</p>
      </div>
    </div>
  );
}
