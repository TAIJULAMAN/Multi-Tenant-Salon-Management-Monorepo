import React from "react";
import { ChevronRight } from "lucide-react";
import CashRegisterProgressSteps from "./CashRegisterProgressSteps";
import CustomInput from "@/components/customComponent/CustomInput";
import SubmitButton from "@/components/customComponent/SubmitButton";
import { CashRegisterSelectDeviceProps } from "./types";

export default function CashRegisterSelectDevice({
  ipAddress,
  setIpAddress,
  onRescan,
  onConfigure,
}: CashRegisterSelectDeviceProps) {
  return (
    <div className="py-4">
      <CashRegisterProgressSteps activeStep={3} />

      <div className="mt-8">
        <h3 className="text-[13px] font-bold text-[#1E293B] mb-4">Select the cash register to configure</h3>

        <div className="space-y-3 mb-8 max-h-[220px] overflow-y-auto pr-2">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border border-[#E2E8F0] hover:border-[#635BFF] rounded-lg p-4 flex items-center justify-between cursor-pointer transition-colors bg-white">
              <div>
                <div className="text-[14px] font-bold text-[#1E293B] mb-1">Epson FP-81 II</div>
                <div className="text-[11px] text-[#94A3B8] font-medium">Serial: EP12345678</div>
                <div className="text-[11px] text-[#94A3B8] font-medium">IP: 192.168.1.100</div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#635BFF]" />
            </div>
          ))}
        </div>

        <div className="mb-8">
          <CustomInput
            label="Or enter the IP manually"
            value={ipAddress}
            onChange={setIpAddress}
            placeholder="E.g. 192.168.1.100"
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={onRescan}
            className="w-full sm:w-auto bg-[#E0E7FF] hover:bg-[#EEF2FF] text-[#635BFF] px-6 py-2.5 rounded-lg font-bold text-[13px] transition-colors"
          >
            Rescan
          </button>
          <SubmitButton
            onClick={onConfigure}
            className="w-full sm:w-auto"
          >
            Configure Device
          </SubmitButton>
        </div>
      </div>
    </div>
  );
}
