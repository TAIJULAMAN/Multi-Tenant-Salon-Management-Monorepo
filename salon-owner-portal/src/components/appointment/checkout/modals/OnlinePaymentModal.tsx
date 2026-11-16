"use client";

import React, { useState } from "react";
import Modal from "@/components/customComponent/Modal";
import { OnlineFormState } from "../types";

interface OnlinePaymentModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: () => void;
  title?: string;
  total?: number;
}

export default function OnlinePaymentModal({
  open,
  onClose,
  onComplete,
  title = "Online Payment",
  total,
}: OnlinePaymentModalProps) {
  const [form, setForm] = useState<OnlineFormState>({
    firstName: "",
    lastName: "",
    cardNumber: "",
    expiration: "",
    cvv: "",
  });

  function handleClose(): void {
    setForm({
      firstName: "",
      lastName: "",
      cardNumber: "",
      expiration: "",
      cvv: "",
    });
    onClose();
  }

  function handlePrintAction(): void {
    onComplete();
  }

  function updateField(key: keyof OnlineFormState, value: string): void {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <Modal isOpen={open} onClose={handleClose} maxWidth="max-w-[460px]">
      <div className="p-1">
        <h3 className="text-[17px] font-bold text-[#1E293B] mb-1">{title}</h3>
        {total !== undefined && (
          <p className="text-[13px] text-[#64748B] mb-5">
            Amount to charge:{" "}
            <span className="font-bold text-[#635BFF]">€ {total.toFixed(2)}</span>
          </p>
        )}

        <div className="flex flex-col gap-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#64748B] mb-1 uppercase tracking-wider">
                First Name
              </label>
              <input
                type="text"
                placeholder="Maria"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#E0E6EB] text-[13px] text-[#1E293B] focus:border-[#635BFF] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#64748B] mb-1 uppercase tracking-wider">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Rodriguez"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#E0E6EB] text-[13px] text-[#1E293B] focus:border-[#635BFF] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#64748B] mb-1 uppercase tracking-wider">
              Card Number
            </label>
            <input
              type="text"
              placeholder="1234  5678  9012  3456"
              value={form.cardNumber}
              onChange={(e) => updateField("cardNumber", e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-[#E0E6EB] text-[13px] text-[#1E293B] focus:border-[#635BFF] focus:outline-none tracking-widest"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#64748B] mb-1 uppercase tracking-wider">
                Expiration
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                value={form.expiration}
                onChange={(e) => updateField("expiration", e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#E0E6EB] text-[13px] text-[#1E293B] focus:border-[#635BFF] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#64748B] mb-1 uppercase tracking-wider">
                CVV
              </label>
              <input
                type="text"
                placeholder="123"
                value={form.cvv}
                onChange={(e) => updateField("cvv", e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-[#E0E6EB] text-[13px] text-[#1E293B] focus:border-[#635BFF] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleClose}
            className="flex-1 py-2.5 rounded-lg border border-[#E0E6EB] text-[13px] font-semibold text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePrintAction}
            className="flex-1 py-2.5 rounded-lg bg-[#635BFF] text-white text-[13px] font-semibold hover:bg-[#5248e5] transition-colors shadow-sm"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </Modal>
  );
}
