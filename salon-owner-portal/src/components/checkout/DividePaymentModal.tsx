"use client";

import React, { useState } from "react";
import { X, Banknote, CreditCard, Ticket, Globe, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { DividePaymentModalProps } from "./types";

const DEFAULT_GIFT_CARDS = [
  { id: "gc1", code: "#0B1", balance: 170, name: "Birthday Voucher" },
  { id: "gc2", code: "#0B5", balance: 170, name: "Special Client Reward" },
];

export default function DividePaymentModal({
  isOpen,
  onClose,
  totalAmount,
  selectedMethods,
  onConfirmSuccess,
}: DividePaymentModalProps) {
  const router = useRouter();
  const [amounts, setAmounts] = React.useState<Record<string, string>>({});
  const [error, setError] = React.useState("");

  // Gift Card selection states
  const [selectedGiftCardId, setSelectedGiftCardId] = useState<string>("gc1");
  const [manualGiftCardCode, setManualGiftCardCode] = useState<string>("");

  React.useEffect(() => {
    if (isOpen) {
      const initialAmounts: Record<string, string> = {};
      const splitAmount = (totalAmount / selectedMethods.length).toFixed(2);
      selectedMethods.forEach((method, idx) => {
        if (idx === selectedMethods.length - 1) {
          initialAmounts[method] = (
            totalAmount -
            parseFloat(splitAmount) * (selectedMethods.length - 1)
          ).toFixed(2);
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
      case "Cash":
        return <Banknote className="w-5 h-5" />;
      case "Gift Card":
        return <Ticket className="w-5 h-5" />;
      case "Card Terminal":
        return <CreditCard className="w-5 h-5" />;
      case "Online Payment":
        return <Globe className="w-5 h-5" />;
      default:
        return <Banknote className="w-5 h-5" />;
    }
  };

  const handleAmountChange = (method: string, value: string) => {
    if (!/^\d*\.?\d*$/.test(value)) return;
    const parsed = parseFloat(value);
    if (
      selectedMethods.length === 2 &&
      !isNaN(parsed) &&
      parsed >= 0 &&
      parsed <= totalAmount
    ) {
      const otherMethod = selectedMethods.find((m) => m !== method);
      if (otherMethod) {
        setAmounts({
          [method]: value,
          [otherMethod]: (totalAmount - parsed).toFixed(2),
        });
        return;
      }
    }
    setAmounts((prev) => ({ ...prev, [method]: value }));
  };

  const currentSum = Object.values(amounts).reduce(
    (acc, curr) => acc + (parseFloat(curr) || 0),
    0,
  );
  const isValid = Math.abs(currentSum - totalAmount) <= 0.05;

  const handleConfirm = () => {
    if (!isValid) {
      setError(
        `Amounts must sum to €${totalAmount.toFixed(2)}. Current sum is €${currentSum.toFixed(2)}`,
      );
      return;
    }
    setError("");
    onClose();
    if (onConfirmSuccess) {
      onConfirmSuccess();
    } else {
      router.push("/dashboard?receiptSuccess=true");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 font-manrope">
      <div className="bg-white rounded-xl w-full max-w-[560px] shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-[17px] font-bold text-[#1E293B]">
              Divide Payment
            </h2>
            <p className="text-[12px] text-[#64748B] mt-0.5">
              Choose how much to pay with each selected payment method
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#F1F5F9] rounded-lg transition-colors text-[#64748B] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Total Amount */}
        <div className="mb-6">
          <label className="block text-[12px] font-bold text-[#1E293B] mb-2">
            Total Amount
          </label>
          <div className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-[16px] font-bold text-[#635BFF]">
            € {totalAmount.toFixed(2)}
          </div>
        </div>

        {/* Dynamic Payment Method Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
          {selectedMethods.map((method) => {
            const isGiftCard = method === "Gift Card";

            return (
              <div
                key={method}
                className="border border-[#E2E8F0] rounded-xl p-4 bg-[#FAFBFC] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#EEF2FF] text-[#635BFF] flex items-center justify-center">
                      {getIcon(method)}
                    </div>
                    <span className="text-[13px] font-bold text-[#1E293B]">
                      {method}
                    </span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[14px] font-bold text-[#64748B]">
                      €
                    </span>
                    <input
                      type="text"
                      value={amounts[method] || ""}
                      onChange={(e) => handleAmountChange(method, e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-white border border-[#E2E8F0] rounded-lg pl-8 pr-4 py-2.5 text-[14px] font-bold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors"
                    />
                  </div>
                </div>

                {/* Requirement 6: Choose between available gift cards or add manually */}
                {isGiftCard && (
                  <div className="mt-3 pt-3 border-t border-[#E2E8F0] space-y-2">
                    <label className="block text-[11px] font-bold text-[#475569]">
                      Select Gift Card *
                    </label>
                    <div className="relative">
                      <select
                        value={selectedGiftCardId}
                        onChange={(e) => setSelectedGiftCardId(e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[12px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors appearance-none cursor-pointer pr-8"
                      >
                        {DEFAULT_GIFT_CARDS.map((card) => (
                          <option key={card.id} value={card.id}>
                            {card.code} - {card.name} (€ {card.balance})
                          </option>
                        ))}
                        <option value="manual">+ Add Gift Card Manually</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {selectedGiftCardId === "manual" && (
                      <div className="pt-1 animate-in fade-in duration-150">
                        <input
                          type="text"
                          placeholder="Enter gift card code (e.g. #GC-1234)"
                          value={manualGiftCardCode}
                          onChange={(e) => setManualGiftCardCode(e.target.value)}
                          className="w-full bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-[12px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF] placeholder:text-[#94A3B8]"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Validation Warning */}
        <div className="min-h-5 mb-4">
          {!isValid && (
            <p className="text-[12px] font-medium text-rose-500">
              Amounts must sum to € {totalAmount.toFixed(2)} (Current: €{" "}
              {currentSum.toFixed(2)})
            </p>
          )}
          {error && (
            <p className="text-[12px] font-medium text-rose-500">{error}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-[#F1F5F9]">
          <button
            type="button"
            onClick={onClose}
            className="bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1E293B] px-5 py-2.5 rounded-lg font-semibold text-[13px] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!isValid}
            className={`px-6 py-2.5 rounded-lg font-bold text-[13px] transition-colors shadow-sm cursor-pointer ${
              isValid
                ? "bg-[#635BFF] hover:bg-[#524be0] text-white shadow-[#635BFF]/20"
                : "bg-[#635BFF]/50 text-white cursor-not-allowed"
            }`}
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );
}
