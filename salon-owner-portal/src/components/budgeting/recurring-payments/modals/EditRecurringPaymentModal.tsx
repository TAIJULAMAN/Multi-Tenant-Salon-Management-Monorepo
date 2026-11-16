"use client";

import React from "react";
import { X, CreditCard } from "lucide-react";
import { RecurringPayment } from "@/components/budgeting/types";

interface EditRecurringPaymentModalProps {
  payment: RecurringPayment;
  onClose: () => void;
  onSave: (payment: RecurringPayment) => void;
}

export const EditRecurringPaymentModal: React.FC<
  EditRecurringPaymentModalProps
> = ({ payment, onClose, onSave }) => {
  const [formData, setFormData] = React.useState<RecurringPayment>({
    ...payment,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6 border border-[#E2E8F0] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2 text-[#635BFF]">
            <CreditCard className="w-5 h-5" />
            <h3 className="text-[16px] font-bold text-[#1E293B]">
              Edit Recurring Payment
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#1E293B] p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-[#475569] mb-1">
              Payee / Supplier *
            </label>
            <input
              type="text"
              value={formData.payee}
              onChange={(e) =>
                setFormData({ ...formData, payee: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#475569] mb-1">
                Amount (€) *
              </label>
              <input
                type="number"
                value={formData.amountNum}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setFormData({
                    ...formData,
                    amountNum: val,
                    amount: `€ ${val.toLocaleString()}`,
                  });
                }}
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF]"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#475569] mb-1">
                Frequency *
              </label>
              <select
                value={formData.frequency}
                onChange={(e) =>
                  setFormData({ ...formData, frequency: e.target.value as any })
                }
                className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] font-bold text-[#1E293B] outline-none focus:border-[#635BFF] bg-white"
              >
                <option value="Weekly">Weekly</option>
                <option value="Bi-weekly">Bi-weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#475569] mb-1">
              Execution Day *
            </label>
            <input
              type="text"
              value={formData.day}
              onChange={(e) =>
                setFormData({ ...formData, day: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] font-semibold text-[#1E293B] outline-none focus:border-[#635BFF]"
              placeholder="e.g. 6th of the month"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#475569] mb-1">
              Expiration / Until *
            </label>
            <select
              value={formData.expiration}
              onChange={(e) =>
                setFormData({ ...formData, expiration: e.target.value })
              }
              className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] font-bold text-[#1E293B] outline-none focus:border-[#635BFF] bg-white"
            >
              <option value="Never (Ongoing)">Never (Ongoing)</option>
              <option value="Expires 30/06/2025">Expires 30/06/2025</option>
              <option value="Expires 31/12/2025">Expires 31/12/2025</option>
              <option value="Expires in 1 year">Expires in 1 year</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#475569] mb-1">
              Status *
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: "Active" })}
                className={`flex-1 py-2 rounded-lg text-[12px] font-bold border transition-colors ${
                  formData.status === "Active"
                    ? "bg-[#DCFCE7] text-[#16A34A] border-[#16A34A]"
                    : "bg-white text-[#64748B] border-[#E2E8F0]"
                }`}
              >
                Active
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: "Paused" })}
                className={`flex-1 py-2 rounded-lg text-[12px] font-bold border transition-colors ${
                  formData.status === "Paused"
                    ? "bg-[#F1F5F9] text-[#475569] border-[#94A3B8]"
                    : "bg-white text-[#64748B] border-[#E2E8F0]"
                }`}
              >
                Paused / Stopped
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] text-[12px] font-bold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#635BFF] text-white hover:bg-[#524be0] text-[12px] font-bold rounded-lg transition-colors shadow-sm shadow-[#635BFF]/20"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
