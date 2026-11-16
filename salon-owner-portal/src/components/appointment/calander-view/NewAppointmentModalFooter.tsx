"use client";

import React from "react";

interface NewAppointmentModalFooterProps {
  currentStep: number;
  onClose: () => void;
  onBack: () => void;
  onNext: () => void;
  onConfirm: () => void;
  onFinalize: () => void;
  isStep1Valid: boolean;
  isStep2Valid: boolean;
  isStep3Valid: boolean;
  isValid: boolean;
}

export default function NewAppointmentModalFooter({
  currentStep,
  onClose,
  onBack,
  onNext,
  onConfirm,
  onFinalize,
  isStep1Valid,
  isStep2Valid,
  isStep3Valid,
  isValid,
}: NewAppointmentModalFooterProps) {
  if (currentStep >= 4) {
    return (
      <div className="flex-none p-8 border-t border-slate-100 flex justify-center bg-white">
        <button
          onClick={onFinalize}
          className="w-full py-4 rounded-[12px] bg-[#635BFF] text-white text-[15px] font-bold hover:opacity-90 transition-all shadow-lg shadow-[#635BFF]/20 cursor-pointer"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <div className="flex-none p-8 border-t border-slate-100 flex gap-4 bg-white">
      {currentStep === 1 ? (
        <button
          onClick={onClose}
          className="w-[30%] py-4 rounded-[12px] text-[15px] font-bold bg-[#F8FAFC] text-[#29343D] hover:bg-slate-100 cursor-pointer transition-colors"
        >
          Cancel
        </button>
      ) : (
        <button
          onClick={onBack}
          className="w-[30%] py-4 rounded-[12px] text-[15px] font-bold bg-[#F8FAFC] text-[#29343D] hover:bg-slate-100 cursor-pointer transition-colors"
        >
          Back
        </button>
      )}

      {currentStep < 3 ? (
        <button
          onClick={onNext}
          disabled={currentStep === 1 ? !isStep1Valid : !isStep2Valid}
          className="w-[70%] py-4 rounded-[12px] bg-[#635BFF] text-white text-[15px] font-bold hover:opacity-90 disabled:opacity-40 transition-all shadow-lg shadow-[#635BFF]/20 cursor-pointer"
        >
          Next
        </button>
      ) : (
        <button
          onClick={onConfirm}
          disabled={!isValid || !isStep3Valid}
          className="w-[70%] py-4 rounded-[12px] bg-[#635BFF] text-white text-[15px] font-bold hover:opacity-90 disabled:opacity-40 transition-all shadow-lg shadow-[#635BFF]/20 cursor-pointer"
        >
          Create Appointment
        </button>
      )}
    </div>
  );
}
