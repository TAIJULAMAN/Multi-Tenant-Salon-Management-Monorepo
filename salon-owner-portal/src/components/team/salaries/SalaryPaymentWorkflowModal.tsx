"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, CheckCircle2, ShieldAlert } from "lucide-react";

interface SalaryPaymentWorkflowModalProps {
  step: 0 | 1 | 2 | 3 | 4;
  onClose: () => void;
  onSetStep: (step: 0 | 1 | 2 | 3 | 4) => void;
}

export const SalaryPaymentWorkflowModal: React.FC<
  SalaryPaymentWorkflowModalProps
> = ({ step, onClose, onSetStep }) => {
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const pinRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 3) {
      timer = setTimeout(() => {
        onSetStep(4);
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [step, onSetStep]);

  const handlePinChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 5) {
      pinRefs.current[index + 1]?.focus();
    }
  };

  const handlePinKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      pinRefs.current[index - 1]?.focus();
    }
  };

  if (step === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={step === 3 ? undefined : onClose}
      />

      {/* Step 1: Confirmation */}
      {step === 1 && (
        <div className="bg-white rounded-lg w-full max-w-[500px] p-0 relative z-10 shadow-2xl flex flex-col overflow-hidden animate-in fade-in duration-200">
          <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[#1E293B]">
              Salary Payment
            </h2>
            <button
              onClick={onClose}
              className="text-[#94A3B8] hover:text-[#1E293B] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="bg-[#F8F9FE] border border-[#E0E7FF] rounded-lg p-5 mb-6">
              <div className="text-[14px] font-bold text-[#635BFF] mb-4">
                Revolut Business
              </div>
              <div className="grid grid-cols-2 gap-y-4">
                <div>
                  <div className="text-[11px] font-medium text-[#94A3B8] mb-1">
                    Account ending in
                  </div>
                  <div className="text-[13px] font-bold text-[#1E293B]">
                    ...8902
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-[#94A3B8] mb-1">
                    Available Balance
                  </div>
                  <div className="text-[13px] font-bold text-[#1E293B]">
                    € 45,000.00
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-[#94A3B8] mb-1">
                    Amount to Pay
                  </div>
                  <div className="text-[13px] font-bold text-[#1E293B]">
                    € 3,200.00
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-[#94A3B8] mb-1">
                    Estimated Fees
                  </div>
                  <div className="text-[13px] font-bold text-[#1E293B]">
                    € 2.50
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-[13px] font-bold text-[#1E293B] mb-4">
                Payment Details
              </h4>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden shrink-0 bg-[#FCE7F3]">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maria1&backgroundColor=fce7f3"
                      alt="Maria Rodriguez"
                      className="w-10 h-10 object-cover mix-blend-multiply"
                    />
                  </div>
                  <div>
                    <div className="text-[14px] font-bold text-[#1E293B]">
                      Maria Rodriguez
                    </div>
                    <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF9C3] text-[#EAB308] mt-1">
                      Staff
                    </span>
                  </div>
                </div>
                <div className="text-[16px] font-bold text-[#1E293B]">
                  € 3,200.00
                </div>
              </div>
            </div>

            <div className="bg-[#FFFBEB] border border-[#FEF08A] rounded-lg p-4 flex gap-4">
              <div className="w-5 h-5 rounded-full bg-[#FDE68A] text-[#D97706] flex items-center justify-center shrink-0">
                <span className="font-bold text-[12px]">!</span>
              </div>
              <p className="text-[12px] text-[#D97706] font-medium leading-relaxed">
                <span className="font-bold">Warning — </span> This action is
                irreversible. Funds will be transferred immediately.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white border-t border-[#E2E8F0] flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="bg-[#F8FAFC] text-[#1E293B] text-[13px] font-bold px-6 py-2.5 rounded-lg hover:bg-[#F1F5F9] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSetStep(2)}
              className="bg-[#635BFF] text-white text-[13px] font-bold px-6 py-2.5 rounded-lg hover:bg-[#4F46E5] transition-colors shadow-sm"
            >
              Confirm Payment
            </button>
          </div>
        </div>
      )}

      {/* Step 2: 2FA Verification */}
      {step === 2 && (
        <div className="bg-white rounded-lg w-full max-w-[450px] p-0 relative z-10 shadow-2xl flex flex-col animate-in slide-in-from-right-4 duration-300">
          <div className="p-6 border-b border-[#E2E8F0] flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[#1E293B]">
              Salary Payment
            </h2>
            <button
              onClick={onClose}
              className="text-[#94A3B8] hover:text-[#1E293B] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-8">
            <p className="text-[14px] text-[#64748B] mb-6 leading-relaxed">
              Enter the 6-digit code sent to your Revolut Business app to
              authorize this payment.
            </p>

            <div className="text-center mb-8">
              <div className="text-[32px] font-bold text-[#1E293B]">
                € 3,200.00
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-[12px] font-bold text-[#1E293B] mb-4 text-center">
                Two-Factor Auth Code (2FA)
              </label>
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                {pin.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      pinRefs.current[i] = el;
                    }}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(i, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(i, e)}
                    className="w-10 h-12 text-center text-[18px] font-bold border border-[#E2E8F0] rounded-lg focus:border-[#635BFF] focus:outline-none bg-[#F8FAFC]"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => onSetStep(3)}
              disabled={pin.some((d) => !d)}
              className="w-full bg-[#635BFF] text-white text-[13px] font-bold py-3.5 rounded-lg hover:bg-[#4F46E5] transition-colors shadow-sm disabled:opacity-50"
            >
              Authorize Payment
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Processing */}
      {step === 3 && (
        <div className="bg-white rounded-lg w-full max-w-[450px] p-8 relative z-10 shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
          <div className="text-center mb-8">
            <h2 className="text-[18px] font-bold text-[#1E293B] mb-2">
              Processing Payment
            </h2>
            <p className="text-[13px] text-[#94A3B8]">
              Connecting to Revolut Business API. This will take a few
              moments...
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 p-4 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] mb-6">
            <div className="w-5 h-5 rounded-full border-2 border-[#635BFF] border-t-transparent animate-spin" />
            <span className="text-[13px] font-bold text-[#635BFF]">
              Communicating with Bank...
            </span>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <div className="bg-white rounded-lg w-full max-w-[550px] p-8 relative z-10 shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-[#E2F7F5] rounded-full flex items-center justify-center text-[#14B8A6] mb-6">
              <CheckCircle2 className="w-8 h-8" strokeWidth={3} />
            </div>
            <h2 className="text-[22px] font-bold text-[#1E293B] mb-2">
              Payment Processing Complete
            </h2>
            <p className="text-[14px] text-[#94A3B8]">
              All transactions have been successfully processed and recorded.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-[#DCFCE7] border border-[#BBF7D0] rounded-lg p-5 relative overflow-hidden">
              <div className="text-[12px] font-bold text-[#16A34A] mb-1">
                Total Successfully Paid
              </div>
              <div className="text-[24px] font-bold text-[#16A34A] mb-2">1</div>
              <div className="text-[13px] font-medium text-[#16A34A]">
                € 3,200.00
              </div>
            </div>
            <div className="bg-[#FFE4E6] border border-[#FECDD3] rounded-lg p-5 relative overflow-hidden">
              <div className="text-[12px] font-bold text-[#E11D48] mb-1">
                Failed Payments
              </div>
              <div className="text-[24px] font-bold text-[#E11D48] mb-2">0</div>
              <div className="text-[13px] font-medium text-[#E11D48]">
                € 0.00
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#E0E7FF] text-[#635BFF] text-[14px] font-bold py-3.5 rounded-lg hover:bg-[#C7D2FE] transition-colors"
          >
            Close Window
          </button>
        </div>
      )}
    </div>
  );
};
