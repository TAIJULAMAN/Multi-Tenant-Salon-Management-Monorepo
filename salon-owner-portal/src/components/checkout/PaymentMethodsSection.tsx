import React from "react";
import { PaymentMethodsSectionProps } from "./types";
import { paymentMethods } from "./data";

interface ExtendedPaymentMethodsSectionProps extends PaymentMethodsSectionProps {
  activeGiftCardsCount?: number;
}

export default function PaymentMethodsSection({
  activePaymentMethods,
  onPaymentToggle,
  activeGiftCardsCount = 2,
}: ExtendedPaymentMethodsSectionProps) {
  return (
    <div className="font-manrope">
      <h3 className="text-[14px] font-bold text-[#1E293B] mb-1">Payment Methods</h3>
      <p className="text-[12px] text-[#94A3B8] font-medium mb-6">Select one or more methods.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {paymentMethods.map((method) => {
          const isSelected = activePaymentMethods.includes(method.id);
          const isGiftCard = method.id === "Gift Card";

          return (
            <div
              key={method.id}
              onClick={() => onPaymentToggle(method.id)}
              className={`bg-white border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors relative ${
                isSelected ? "border-[#635BFF] shadow-sm" : "border-[#E2E8F0] hover:border-[#CBD5E1]"
              }`}
            >
              {/* Circular Badge with number of active gift cards */}
              {isGiftCard && activeGiftCardsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1 bg-[#EF4444] text-white text-[11px] font-extrabold rounded-full flex items-center justify-center shadow-md border-2 border-white animate-in zoom-in-75 duration-200">
                  {activeGiftCardsCount}
                </span>
              )}
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${
                  isSelected ? "bg-[#EEF2FF] text-[#635BFF]" : "bg-[#F1F5F9] text-[#64748B]"
                }`}
              >
                {method.icon}
              </div>
              <span className="text-[14px] font-bold text-[#1E293B]">{method.id}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
