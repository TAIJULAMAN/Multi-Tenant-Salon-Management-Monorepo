"use client";

import React, { useState } from "react";
import { Tag } from "lucide-react";

interface CheckoutSummaryProps {
  subtotal: number;
  tax: number;
  discount: number;
  tip: number;
  onApplyDiscount: (amount: number) => void;
  onSetTip: (amount: number) => void;
  onPay: () => void;
  disabled?: boolean;
}

const TIP_PRESETS = [0, 5, 10, 15, 20];

export default function CheckoutSummary({
  subtotal,
  tax,
  discount,
  tip,
  onApplyDiscount,
  onSetTip,
  onPay,
  disabled = false,
}: CheckoutSummaryProps) {
  const [couponCode, setCouponCode] = useState("");
  const total = Math.max(0, subtotal + tax + tip - discount);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E0E6EB] shadow-xs flex flex-col gap-5">
      <h3 className="text-[15px] font-bold text-[#1E293B]">Order Summary</h3>

      {/* Discount / Coupon Input */}
      <div>
        <div className="text-[12px] font-bold text-[#64748B] mb-2 uppercase tracking-wider">
          Add Discount / Promo
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-[#E0E6EB] text-[13px] text-[#1E293B] focus:border-[#635BFF] focus:outline-none"
            />
            <Tag
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]"
            />
          </div>
          <button
            onClick={() => {
              if (couponCode.toLowerCase() === "vip10") onApplyDiscount(10);
              else if (couponCode.trim()) onApplyDiscount(5);
            }}
            disabled={!couponCode.trim()}
            className="px-4 h-10 rounded-xl bg-[#F4F6FA] text-[13px] font-bold text-[#1E293B] hover:bg-[#E0E6EB] disabled:opacity-40 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Tip presets */}
      <div>
        <div className="text-[12px] font-bold text-[#64748B] mb-2 uppercase tracking-wider">
          Add Tip
        </div>
        <div className="flex gap-2">
          {TIP_PRESETS.map((t) => (
            <button
              key={t}
              onClick={() => onSetTip(t)}
              className={`flex-1 py-2 rounded-lg text-[12px] font-bold transition-all border ${
                tip === t
                  ? "bg-[#635BFF] text-white border-[#635BFF]"
                  : "bg-[#FAFBFC] border-[#E0E6EB] text-[#64748B] hover:border-[#CBD5E1]"
              }`}
            >
              {t === 0 ? "No Tip" : `€ ${t}`}
            </button>
          ))}
        </div>
      </div>

      {/* Breakdown lines */}
      <div className="border-t border-b border-[#F1F5F9] py-3.5 space-y-2.5 text-[13px]">
        <div className="flex justify-between text-[#64748B]">
          <span>Subtotal</span>
          <span className="font-semibold text-[#1E293B]">
            € {subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between text-[#64748B]">
          <span>VAT / Tax</span>
          <span className="font-semibold text-[#1E293B]">
            € {tax.toFixed(2)}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-[#22C55E]">
            <span>Discount Applied</span>
            <span className="font-semibold">- € {discount.toFixed(2)}</span>
          </div>
        )}
        {tip > 0 && (
          <div className="flex justify-between text-[#635BFF]">
            <span>Tip</span>
            <span className="font-semibold">+ € {tip.toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* Final Total */}
      <div className="flex items-center justify-between">
        <span className="text-[16px] font-bold text-[#1E293B]">Total Due</span>
        <span className="text-[22px] font-extrabold text-[#635BFF]">
          € {total.toFixed(2)}
        </span>
      </div>

      <button
        onClick={onPay}
        disabled={disabled || total <= 0}
        className="w-full h-12 rounded-xl bg-[#635BFF] hover:bg-[#5248e5] text-white font-bold text-[14px] shadow-sm disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
      >
        Complete Payment (€ {total.toFixed(2)})
      </button>
    </div>
  );
}
