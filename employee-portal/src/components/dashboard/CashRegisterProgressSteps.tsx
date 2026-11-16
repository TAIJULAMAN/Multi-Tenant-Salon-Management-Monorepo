import React from "react";
import { Check } from "lucide-react";
import { CashRegisterProgressStepsProps } from "./types";

export default function CashRegisterProgressSteps({ activeStep }: CashRegisterProgressStepsProps) {
  return (
    <div className="flex items-center justify-between mb-10 mt-2 max-w-lg mx-auto relative px-4">
      <div className="absolute top-[14px] left-[15%] right-[15%] h-[1px] bg-[#E2E8F0] -z-10"></div>

      {[1, 2, 3, 4].map((step) => {
        const isActive = step === activeStep;
        const isPast = step < activeStep;
        const bgColor = isActive || isPast ? "bg-[#635BFF]" : "bg-[#64748B]";

        const labels = ["Agent Verification", "Search Devices", "Select Cash Register", "Configuration"];

        return (
          <div key={step} className="flex flex-col items-center gap-2 bg-white relative z-0 px-2">
            <div className={`w-7 h-7 rounded-full ${bgColor} text-white flex items-center justify-center text-[12px] font-bold`}>
              {step}
            </div>
            <span className={`text-[11px] font-medium hidden sm:block ${isActive ? "text-[#1E293B]" : "text-[#94A3B8]"}`}>
              {labels[step - 1]}
            </span>
          </div>
        );
      })}
    </div>
  );
}
