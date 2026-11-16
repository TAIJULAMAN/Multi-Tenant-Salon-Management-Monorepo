"use client";

import React, { useState, useEffect } from "react";
import Modal from "@/components/customComponent/Modal";
import MethodIcon from "../icons/MethodIcon";
import { METHOD_LABELS } from "../data";
import { DividePaymentModalProps } from "../types";

export default function DividePaymentModal({
  open,
  onClose,
  methodA,
  methodB,
  total,
  onComplete,
}: DividePaymentModalProps) {
  const [amountA, setAmountA] = useState<number>(total / 2);
  const amountB = total - amountA;

  useEffect(() => {
    setAmountA(total / 2);
  }, [total, open]);

  function handleCollect(): void {
    onClose();
    onComplete?.();
  }

  return (
    <Modal isOpen={open} onClose={onClose} title="Divide Payment" maxWidth="max-w-[440px]">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-[#F4F6FA] rounded-xl">
          <span className="text-xs text-[#526B7A]">Total Amount</span>
          <span className="text-sm font-bold text-[#635BFF]">
            € {total.toFixed ? total.toFixed(2) : total}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="border border-[#EFF4FA] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#DDDBFF] flex items-center justify-center">
                <MethodIcon id={methodA} />
              </div>
              <span className="text-xs font-semibold text-[#29343D]">
                {METHOD_LABELS[methodA]}
              </span>
            </div>
            <div className="flex items-center gap-1 border-b border-[#E0E6EB] pb-0.5 focus-within:border-[#635BFF] transition-colors">
              <span className="text-xs text-[#98A4AE]">€</span>
              <input
                type="number"
                value={amountA}
                min={0}
                max={total}
                onChange={(e) =>
                  setAmountA(Math.min(total, Math.max(0, Number(e.target.value))))
                }
                className="w-full text-sm font-bold text-[#29343D] outline-none bg-transparent"
              />
            </div>
          </div>

          <div className="border border-[#EFF4FA] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#DDDBFF] flex items-center justify-center">
                <MethodIcon id={methodB} />
              </div>
              <span className="text-xs font-semibold text-[#29343D]">
                {METHOD_LABELS[methodB]}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-[#98A4AE]">€</span>
              <span className="text-sm font-bold text-[#29343D]">
                {amountB.toFixed ? amountB.toFixed(2) : amountB}
              </span>
            </div>
          </div>
        </div>

        <div className="px-0.5">
          <input
            type="range"
            min={0}
            max={total}
            value={amountA}
            onChange={(e) => setAmountA(Number(e.target.value))}
            className="w-full accent-[#635BFF]"
          />
          <div className="flex justify-between text-xs text-[#98A4AE] mt-1">
            <span>€ 0</span>
            <span>€ {total.toFixed ? total.toFixed(2) : total}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#E0E6EB] rounded-lg text-sm font-semibold text-[#29343D] hover:bg-[#F4F6FA] transition-colors cursor-pointer"
          >
            None
          </button>
          <button
            onClick={handleCollect}
            className="flex-1 py-2.5 bg-[#635BFF] hover:bg-[#4f49e0] text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            Collect Payment
          </button>
        </div>
      </div>
    </Modal>
  );
}
export { DividePaymentModal };
