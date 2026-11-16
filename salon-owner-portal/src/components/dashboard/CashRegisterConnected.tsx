import React from "react";
import { Wallet } from "lucide-react";
import CustomCloseButton from "@/components/customComponent/CustomCloseButton";
import CancelButton from "@/components/customComponent/CancelButton";
import { CashRegisterConnectedProps } from "./types";

export default function CashRegisterConnected({ onClose, onDisconnect }: CashRegisterConnectedProps) {
  return (
    <div className="flex flex-col items-center text-center mt-2">
      <CustomCloseButton onClick={onClose} />

      <div className="w-20 h-20 rounded-full bg-[#E0E7FF] flex items-center justify-center mb-6">
        <Wallet className="w-10 h-10 text-[#635BFF]" />
      </div>
      <h2 className="text-[20px] font-bold text-[#1E293B] mb-2">Cash Register Settings</h2>
      <p className="text-[13px] text-[#94A3B8] font-medium mb-8">Check and update your cash register information easily.</p>

      <div className="w-full bg-[#F8FAFC] rounded-lg p-6 text-left mb-8">
        <div className="flex items-center justify-between mb-8">
          <h4 className="text-[14px] font-bold text-[#1E293B]">Cash Register Connected</h4>
          <div className="w-10 h-6 bg-[#E0E7FF] rounded-full relative cursor-pointer">
            <div className="w-4 h-4 bg-[#635BFF] rounded-full absolute top-1 right-1 shadow-sm"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-6">
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
      </div>

      <div className="w-full flex flex-col sm:flex-row justify-end gap-3 mt-4">
        <CancelButton onClick={onClose}>
          Close
        </CancelButton>
        <button
          onClick={onDisconnect}
          className="w-full sm:w-auto bg-[#F43F5E] hover:bg-[#E11D48] text-white px-6 py-2.5 rounded-lg font-bold text-[13px] transition-colors"
        >
          Disconnect Cash Register
        </button>
      </div>
    </div>
  );
}
