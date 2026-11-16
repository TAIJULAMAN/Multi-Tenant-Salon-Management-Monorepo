"use client";

import React from "react";
import { X, Banknote, CreditCard, Ticket, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import CancelButton from "@/components/customComponent/CancelButton";
import SubmitButton from "@/components/customComponent/SubmitButton";
import { DividePaymentModalProps } from "./types";

export default function DividePaymentModal({ isOpen, onClose, totalAmount, selectedMethods }: DividePaymentModalProps) {
  const router = useRouter();
  const [amounts, setAmounts] = React.useState<Record<string, string>>({});
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (isOpen) {
      const initialAmounts: Record<string, string> = {};
      const splitAmount = (totalAmount / selectedMethods.length).toFixed(2);
      selectedMethods.forEach((method, idx) => {
        if (idx === selectedMethods.length - 1) {
          initialAmounts[method] = (totalAmount - parseFloat(splitAmount) * (selectedMethods.length - 1)).toFixed(2);
        } else {
          initialAmounts[method] = splitAmount;
        }
      });
      setAmounts(initialAmounts);
      setError("");
    }
  }, [isOpen, selectedMethods, totalAmount]);

  if (!isOpen) return null;

  const getIcon = (id: string) => {
    switch (id) {
      case "Cash": return <Banknote className="w-5 h-5" />;
      case "Gift Card": return <Ticket className="w-5 h-5" />;
      case "Card Terminal": return <CreditCard className="w-5 h-5" />;
      case "Online Payment": return <Globe className="w-5 h-5" />;
      default: return <Banknote className="w-5 h-5" />;
    }
  };

  const handleAmountChange = (method: string, value: string) => {
    // Only allow numbers and one decimal point
    if (!/^\d*\.?\d*$/.test(value)) return;
    setAmounts(prev => ({ ...prev, [method]: value }));
  };

  const handleConfirm = () => {
    const sum = Object.values(amounts).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
    // Allow small floating point difference like 0.01
    if (Math.abs(sum - totalAmount) > 0.01) {
      setError(`Amounts must sum to €${totalAmount}. Current sum is €${sum.toFixed(2)}`);
      return;
    }
    setError("");
    onClose();
    router.push("/dashboard?receiptSuccess=true");
  };

  const currentSum = Object.values(amounts).reduce((acc, curr) => acc + (parseFloat(curr) || 0), 0);
  const isValid = Math.abs(currentSum - totalAmount) <= 0.01;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-lg w-full max-w-[600px] shadow-2xl p-6 relative animate-in fade-in zoom-in duration-200 mx-4">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[16px] font-bold text-[#1E293B]">Divide Payment</h2>
          <button onClick={onClose} className="p-1 hover:bg-[#F1F5F9] rounded-lg transition-colors text-[#64748B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Amount */}
        <div className="mb-6">
          <label className="block text-[12px] font-bold text-[#1E293B] mb-2">Total Amount</label>
          <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-[12px] px-4 py-3 text-[14px] font-semibold text-[#94A3B8]">
            € {totalAmount}
          </div>
        </div>



        {/* Dynamic Payment Method Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
          {selectedMethods.map((method) => (
            <div key={method} className="border border-[#E2E8F0] rounded-[16px] p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#EEF2FF] text-[#635BFF] flex items-center justify-center">
                  {getIcon(method)}
                </div>
                <span className="text-[14px] font-bold text-[#1E293B]">{method}</span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px] font-semibold text-[#1E293B]">€</span>
                <input
                  type="text"
                  value={amounts[method] || ""}
                  onChange={(e) => handleAmountChange(method, e.target.value)}
                  className={`w-full border rounded-[12px] pl-8 pr-4 py-2.5 text-[14px] font-semibold text-[#1E293B] outline-none transition-colors ${!isValid && currentSum > 0 ? 'border-[#F87171] focus:border-[#F87171]' : 'border-[#E2E8F0] focus:border-[#635BFF]'}`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Validation Warning */}
        <div className="h-6 mb-4">
          {!isValid && currentSum > 0 && (
            <p className="text-[12px] font-medium text-[#F87171]">
              Amounts must sum up to € {totalAmount}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E293B] px-6 py-2.5 rounded-[8px] font-semibold text-[13px] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!isValid}
            className={`px-6 py-2.5 rounded-[8px] font-semibold text-[13px] transition-colors shadow-sm ${isValid ? 'bg-[#635BFF] hover:bg-[#524be0] text-white shadow-[#635BFF]/20' : 'bg-[#635BFF]/50 text-white cursor-not-allowed'}`}
          >
            Confirm Payment
          </button>
        </div>

      </div>
    </div>
  );
}
