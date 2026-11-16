"use client";

import React from "react";
import { Repeat, Calendar, AlertCircle } from "lucide-react";
import { RecurringPayment } from "@/components/budgeting/types";

interface RecurringPaymentsStatsProps {
  payments: RecurringPayment[];
}

export const RecurringPaymentsStats: React.FC<RecurringPaymentsStatsProps> = ({
  payments,
}) => {
  const activePayments = payments.filter((p) => p.status === "Active");
  const monthlyTotal = activePayments.reduce((acc, p) => {
    let monthlyVal = p.amountNum;
    if (p.frequency === "Weekly") monthlyVal = p.amountNum * 4.33;
    else if (p.frequency === "Bi-weekly") monthlyVal = p.amountNum * 2.16;
    else if (p.frequency === "Quarterly") monthlyVal = p.amountNum / 3;
    else if (p.frequency === "Yearly") monthlyVal = p.amountNum / 12;
    return acc + monthlyVal;
  }, 0);

  const nextUpcoming = activePayments[0] || null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div className="bg-white rounded-lg p-5 border border-[#E2E8F0] shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-[#EEF2FF] flex items-center justify-center text-[#635BFF]">
          <Repeat className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[12px] font-bold text-[#64748B] block">
            Active Subscriptions
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-[22px] font-bold text-[#1E293B]">
              {activePayments.length}
            </span>
            <span className="text-[12px] font-medium text-[#94A3B8]">
              / {payments.length} total
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-5 border border-[#E2E8F0] shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-[#ECFDF5] flex items-center justify-center text-[#10B981]">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[12px] font-bold text-[#64748B] block">
            Estimated Monthly Outflow
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-[22px] font-bold text-[#10B981]">
              € {Math.round(monthlyTotal).toLocaleString()}
            </span>
            <span className="text-[11px] font-medium text-[#94A3B8]">
              / month
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-5 border border-[#E2E8F0] shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-[#FEF3C7] flex items-center justify-center text-[#F59E0B]">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[12px] font-bold text-[#64748B] block">
            Next Due Payment
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[14px] font-bold text-[#1E293B] truncate max-w-[140px]">
              {nextUpcoming ? nextUpcoming.payee : "None scheduled"}
            </span>
            {nextUpcoming && (
              <span className="text-[12px] font-bold text-[#F59E0B]">
                ({nextUpcoming.nextDate})
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
