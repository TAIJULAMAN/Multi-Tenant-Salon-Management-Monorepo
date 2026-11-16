"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { RecurringPayment } from "@/components/budgeting/types";

interface DeleteRecurringPaymentModalProps {
  payment: RecurringPayment;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteRecurringPaymentModal: React.FC<
  DeleteRecurringPaymentModalProps
> = ({ payment, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm p-6 border border-[#E2E8F0]">
        <div className="flex items-center gap-3 text-[#EF4444] mb-3">
          <div className="w-10 h-10 rounded-full bg-[#FEE2E2] flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <h3 className="text-[15px] font-bold text-[#1E293B]">
            Delete Recurring Payment
          </h3>
        </div>
        <p className="text-[13px] text-[#64748B] mb-5">
          Are you sure you want to stop and delete recurring schedule for{" "}
          <strong className="text-[#1E293B]">{payment.payee}</strong> (
          {payment.amount})?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] text-[12px] font-bold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-[#EF4444] text-white hover:bg-[#DC2626] text-[12px] font-bold rounded-lg transition-colors shadow-sm shadow-[#EF4444]/20"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
