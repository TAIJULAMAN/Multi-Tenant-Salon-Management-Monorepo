import React from "react";
import { PaymentMethodsSectionProps } from "./types";
import { paymentMethods } from "./data";
// import { paymentMethods } from "./data";

export default function PaymentMethodsSection({
  activePaymentMethods,
  onPaymentToggle,
}: PaymentMethodsSectionProps) {
  return (
    <div>
      <h3 className="text-[14px] font-bold text-[#1E293B] mb-1">Payment Methods</h3>
      <p className="text-[12px] text-[#94A3B8] font-medium mb-6">Select one or more methods.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => onPaymentToggle(method.id)}
            className={`bg-white border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${activePaymentMethods.includes(method.id)
              ? "border-[#635BFF] shadow-sm"
              : "border-[#E2E8F0] hover:border-[#CBD5E1]"
              }`}
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-colors ${activePaymentMethods.includes(method.id)
                ? "bg-[#EEF2FF] text-[#635BFF]"
                : "bg-[#F1F5F9] text-[#64748B]"
                }`}
            >
              {method.icon}
            </div>
            <span className="text-[14px] font-bold text-[#1E293B]">{method.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
