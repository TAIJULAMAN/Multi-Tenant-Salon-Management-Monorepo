"use client";

import React from "react";
import { Clock, Pause, Play, Edit2, Trash2 } from "lucide-react";
import { RecurringPayment } from "@/components/budgeting/types";
import { Badge } from "@/components/ui/Badge";

interface RecurringPaymentsTableProps {
  payments: RecurringPayment[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectOne: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onEdit: (payment: RecurringPayment) => void;
  onDelete: (payment: RecurringPayment) => void;
}

export const RecurringPaymentsTable: React.FC<RecurringPaymentsTableProps> = ({
  payments,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectOne,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[12px] font-bold text-[#64748B]">
            <th className="py-3 px-4 w-12 text-center border-r border-[#E2E8F0]">
              <input
                type="checkbox"
                checked={selectedIds.length === payments.length && payments.length > 0}
                onChange={onToggleSelectAll}
                className="w-4 h-4 rounded border-[#CBD5E1] text-[#635BFF] focus:ring-[#635BFF] cursor-pointer"
              />
            </th>
            <th className="py-3 px-6 border-r border-[#E2E8F0]">Payee & Category</th>
            <th className="py-3 px-6 border-r border-[#E2E8F0]">Amount</th>
            <th className="py-3 px-6 border-r border-[#E2E8F0]">Frequency</th>
            <th className="py-3 px-6 border-r border-[#E2E8F0]">Next Execution</th>
            <th className="py-3 px-6 border-r border-[#E2E8F0]">Expiration</th>
            <th className="py-3 px-6 border-r border-[#E2E8F0]">Status</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E2E8F0]">
          {payments.length === 0 ? (
            <tr>
              <td colSpan={8} className="py-12 text-center text-[#94A3B8]">
                <p className="text-[14px] font-medium">No recurring payments found</p>
              </td>
            </tr>
          ) : (
            payments.map((item) => {
              const isActive = item.status === "Active";
              const isSelected = selectedIds.includes(item.id);

              return (
                <tr
                  key={item.id}
                  className={`hover:bg-[#F8FAFC] transition-colors ${
                    isSelected ? "bg-[#F1F5F9]/50" : ""
                  }`}
                >
                  <td className="py-4 px-4 text-center border-r border-[#E2E8F0]">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelectOne(item.id)}
                      className="w-4 h-4 rounded border-[#CBD5E1] text-[#635BFF] focus:ring-[#635BFF] cursor-pointer"
                    />
                  </td>

                  <td className="py-4 px-6 border-r border-[#E2E8F0]">
                    <div>
                      <span className="text-[13px] font-bold text-[#1E293B] block">{item.payee}</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] font-semibold text-[#635BFF] bg-[#EEF2FF] px-2 py-0.5 rounded">
                          {item.macroCategory}
                        </span>
                        <span className="text-[11px] text-[#94A3B8]">• {item.category}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-6 border-r border-[#E2E8F0]">
                    <span className="text-[14px] font-bold text-[#1E293B]">{item.amount}</span>
                  </td>

                  <td className="py-4 px-6 border-r border-[#E2E8F0]">
                    <div>
                      <span className="text-[12px] font-bold text-[#334155]">{item.frequency}</span>
                      <div className="text-[11px] text-[#94A3B8]">{item.day}</div>
                    </div>
                  </td>

                  <td className="py-4 px-6 border-r border-[#E2E8F0]">
                    <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#475569]">
                      <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
                      <span>{item.nextDate}</span>
                    </div>
                  </td>

                  <td className="py-4 px-6 border-r border-[#E2E8F0]">
                    <span
                      className={`text-[12px] font-medium ${
                        item.expiration.includes("Expires") ? "text-[#D97706]" : "text-[#64748B]"
                      }`}
                    >
                      {item.expiration}
                    </span>
                  </td>

                  <td className="py-4 px-6 border-r border-[#E2E8F0]">
                    <Badge variant={isActive ? "success" : "neutral"} dot>
                      {item.status}
                    </Badge>
                  </td>

                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onToggleStatus(item.id)}
                        className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors ${
                          isActive
                            ? "bg-[#FFF1F2] text-[#F43F5E] hover:bg-[#FFE4E6]"
                            : "bg-[#DCFCE7] text-[#16A34A] hover:bg-[#BBF7D0]"
                        }`}
                        title={isActive ? "Stop / Pause this recurring payment" : "Resume recurring payment"}
                      >
                        {isActive ? (
                          <>
                            <Pause className="w-3 h-3" />
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3" />
                            <span>Resume</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 text-[#64748B] hover:text-[#635BFF] hover:bg-[#EEF2FF] rounded-lg transition-colors"
                        title="Edit Recurring Details"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDelete(item)}
                        className="p-1.5 text-[#64748B] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg transition-colors"
                        title="Delete Recurring Payment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
