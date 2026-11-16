import React from "react";
import { Loader2 } from "lucide-react";
import CashRegisterProgressSteps from "./CashRegisterProgressSteps";
import { CashRegisterCheckingProps } from "./types";

export default function CashRegisterChecking({ loadingProgress, onTestNotFound }: CashRegisterCheckingProps) {
  return (
    <div className="py-4">
      <CashRegisterProgressSteps activeStep={1} />
      <div className="flex flex-col items-center justify-center py-10">
        <div className="relative w-20 h-20 mb-6">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" className="stroke-[#E2E8F0]" strokeWidth="4" fill="none" />
            <circle
              cx="50" cy="50" r="45"
              className="stroke-[#635BFF] transition-all duration-300"
              strokeWidth="4"
              fill="none"
              strokeDasharray="283"
              strokeDashoffset={283 - (283 * loadingProgress) / 100}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[14px] font-bold text-white">{loadingProgress}%</span>
          </div>
        </div>
        <p className="text-[14px] font-bold text-[#1E293B]">Checking if the local agent is active...</p>

        {/* Dev shortcut to test NOT FOUND state */}
        <button onClick={onTestNotFound} className="mt-8 text-[10px] text-gray-300 hover:text-gray-500">
          Test Not Found State
        </button>
      </div>
    </div>
  );
}
