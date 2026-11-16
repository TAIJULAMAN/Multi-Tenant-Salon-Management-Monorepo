"use client";

import React from "react";
import { X, CreditCard, TrendingUp } from "lucide-react";

export interface RevenueDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalRevenue: number;
  uniqueCustomers: number;
}

export function RevenueDetailModal({
  isOpen,
  onClose,
  totalRevenue,
  uniqueCustomers,
}: RevenueDetailModalProps) {
  if (!isOpen) return null;

  // Mock subvalues for display
  const receiptsCount = totalRevenue > 0 ? Math.floor(totalRevenue / 42.5) : 0;
  const awaitingPayment = totalRevenue > 0 ? 5 : 0;
  const receiptToIssue = totalRevenue > 0 ? 2 : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 flex justify-center items-start sm:items-center py-6 sm:py-10 animate-in fade-in">
      <div className="bg-white max-w-3xl w-full rounded-2xl border border-slate-100 shadow-2xl p-6 relative flex flex-col gap-6 animate-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="flex items-start justify-between text-left">
          <div>
            <h2 className="text-base font-black text-slate-800 tracking-tight">
              Revenue Detail
            </h2>
            <p className="text-xs font-bold text-slate-400 mt-0.5">
              Complete analysis of salon revenue
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* 1. Accounted Revenue Card */}
        <div className="bg-[#e6fcf5]/30 border border-[#c3fae8] rounded-2xl p-5 flex flex-col gap-4 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0ca678] text-white shadow-sm">
                <CreditCard size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800">
                  Accounted Revenue
                </h4>
                <p className="text-[10px] font-bold text-slate-400">
                  Entries recorded with printed receipt and completed payment
                </p>
              </div>
            </div>
            <span className="text-[#0ca678] text-3xl font-black shrink-0 sm:text-right">
              €{" "}
              {totalRevenue.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-[#c3fae8]/50 p-4 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Number of Receipts
              </span>
              <span className="text-2xl font-black text-[#0ca678]">
                {receiptsCount}
              </span>
            </div>
            <div className="bg-white rounded-xl border border-[#c3fae8]/50 p-4 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Unique Customers
              </span>
              <span className="text-2xl font-black text-[#0ca678]">
                {uniqueCustomers}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Credit Income Card */}
        <div className="bg-[#fff0f6]/30 border border-[#ffdeeb] rounded-2xl p-5 flex flex-col gap-4 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#e64980] text-white shadow-sm">
                <CreditCard size={20} />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800">
                  Credit Income
                </h4>
                <p className="text-[10px] font-bold text-slate-400 leading-snug max-w-md">
                  Services provided but not yet paid for or for which a receipt
                  has yet to be issued. Includes deferred payments, advance
                  payments, and services pending payment.
                </p>
              </div>
            </div>
            <span className="text-[#e64980] text-3xl font-black shrink-0 sm:text-right">
              € 0
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-[#ffdeeb]/50 p-4 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Awaiting Payment
              </span>
              <span className="text-2xl font-black text-[#e64980]">
                {awaitingPayment}
              </span>
            </div>
            <div className="bg-white rounded-xl border border-[#ffdeeb]/50 p-4 flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Receipt to Issue
              </span>
              <span className="text-2xl font-black text-[#e64980]">
                {receiptToIssue}
              </span>
            </div>
          </div>
        </div>

        {/* 3. Total Revenue Card */}
        <div className="bg-[#f0f2ff]/30 border border-[#d0ebff] rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#5c60f5] text-white shadow-sm">
              <TrendingUp size={20} />
            </div>
            <span className="text-xs font-black text-slate-800">
              Total Revenue (Accounted + Credit)
            </span>
          </div>
          <span className="text-[#5c60f5] text-3xl font-black shrink-0 sm:text-right">
            €{" "}
            {totalRevenue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>

        {/* Bottom Disclaimer */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-left">
          <p className="text-[10px] font-semibold text-slate-400 leading-relaxed">
            <span className="text-slate-500 font-extrabold">Note:</span>{" "}
            Accounted revenue represents actual and documented revenue. Credit
            revenue requires follow-up to complete the collection cycle and tax
            documentation.
          </p>
        </div>
      </div>
    </div>
  );
}
