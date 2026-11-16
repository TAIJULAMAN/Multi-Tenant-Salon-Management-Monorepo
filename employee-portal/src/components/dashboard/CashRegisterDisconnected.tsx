import React from "react";
import { Power } from "lucide-react";
import SubmitButton from "@/components/customComponent/SubmitButton";
import { CashRegisterDisconnectedProps } from "./types";

export default function CashRegisterDisconnected({ onConnect }: CashRegisterDisconnectedProps) {
  return (
    <div className="border border-[#E2E8F0] rounded-lg p-10 flex flex-col items-center text-center">
      <div className="w-16 h-16 rounded-lg border-2 border-[#1E293B] flex items-center justify-center mb-6">
        <Power className="w-8 h-8 text-[#1E293B]" />
      </div>
      <h3 className="text-[18px] font-bold text-[#1E293B] mb-2">No cash register connected</h3>
      <p className="text-[13px] text-[#94A3B8] font-medium mb-8">Connect your cash register easily.</p>
      <button
        onClick={onConnect}
        className="bg-[#E0E7FF] hover:bg-[#EEF2FF] text-[#635BFF] px-6 py-2.5 rounded-lg font-bold text-[13px] transition-colors"
      >
        Connect Cash Register
      </button>
    </div>
  );
}
