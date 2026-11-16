import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import SubmitButton from "@/components/customComponent/SubmitButton";
import { CashRegisterConfigErrorProps } from "./types";

export default function CashRegisterConfigError({ onRetry }: CashRegisterConfigErrorProps) {
  return (
    <div className="flex flex-col items-center text-center py-6">
      <div className="w-20 h-20 rounded-full bg-[#FFE4E6] flex items-center justify-center mb-6">
        <AlertCircle className="w-10 h-10 text-[#F43F5E]" strokeWidth={2} />
      </div>

      <h2 className="text-[20px] font-bold text-[#1E293B] mb-3">An error occurred during configuration.</h2>
      <p className="text-[13px] text-[#94A3B8] font-medium max-w-[340px] mb-8 leading-relaxed">
        The device is not responding or the connection was interrupted.<br />
        Verify that the cash register is turned on and properly connected.
      </p>

      <SubmitButton
        onClick={onRetry}
        className="flex items-center justify-center gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Test print
      </SubmitButton>
    </div>
  );
}
