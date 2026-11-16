import React from "react";
import { UserPlus } from "lucide-react";
import CancelButton from "@/components/customComponent/CancelButton";
import { BasicInformationSectionProps } from "./types";

export default function BasicInformationSection({
  selectedClient,
  onOpenClientModal,
}: BasicInformationSectionProps) {
  return (
    <div>
      <h3 className="text-[14px] font-bold text-[#1E293B] mb-4">Basic Informations</h3>

      {!selectedClient ? (
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-10 flex flex-col items-center justify-center text-center">
          <div className="w-12 h-12 flex items-center justify-center mb-4 text-[#1E293B]">
            {/* Custom User Icon approximation */}
            <UserPlus className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h4 className="text-[14px] font-bold text-[#1E293B] mb-3">No client registred</h4>
          <CancelButton onClick={onOpenClientModal}>
            Select Client
          </CancelButton>
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={selectedClient.avatar} alt="Avatar" className="w-14 h-14 rounded-lg object-cover" />
            <div>
              <h4 className="text-[16px] font-bold text-[#1E293B]">{selectedClient.name}</h4>
              <p className="text-[13px] text-[#94A3B8] font-medium mt-0.5">{selectedClient.phone}</p>
            </div>
          </div>
          <button
            onClick={onOpenClientModal}
            className="text-[#635BFF] text-[13px] font-bold hover:underline"
          >
            Change Client
          </button>
        </div>
      )}
    </div>
  );
}
