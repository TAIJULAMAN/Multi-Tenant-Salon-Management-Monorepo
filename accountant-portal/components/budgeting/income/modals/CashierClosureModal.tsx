"use client";

import React from "react";
import Image from "next/image";
import { X, AlertCircle, Eye, FileText } from "lucide-react";
import type { CashierClosureRow } from "../types";

export interface CashierClosureModalProps {
  isOpen: boolean;
  onClose: () => void;
  closure: CashierClosureRow | null;
}

export function CashierClosureModal({
  isOpen,
  onClose,
  closure,
}: CashierClosureModalProps) {
  if (!isOpen || !closure) return null;

  const isRegular = closure.status === "Regular";

  // Mock list of receipts for display
  const receiptsList = [
    {
      hour: "10:30",
      client: {
        name: "Jane Doe",
        phone: "+39 333 1234567",
        avatar:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
      },
      employee: {
        name: "Sofia Bianchi",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop",
      },
      services: "Women's Cut, Fold",
      amount: 600,
    },
    {
      hour: "11:00",
      client: {
        name: "John Smith",
        phone: "+39 333 1234567",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop",
      },
      employee: {
        name: "Marco Esposito",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop",
      },
      services: "Women's Cut, Fold",
      amount: 600,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm p-4 flex justify-center items-start sm:items-center py-6 sm:py-10 animate-in fade-in">
      <div className="bg-white max-w-3xl w-full rounded-2xl border border-slate-100 shadow-2xl p-6 relative flex flex-col gap-6 animate-in zoom-in-95 duration-200 my-auto">
        {/* Header */}
        <div className="flex items-start justify-between text-left">
          <div className="space-y-2">
            <h2 className="text-base font-black text-slate-800 tracking-tight">
              Cashier&apos;s Office Closes - October 4, 2025
            </h2>
            <div className="flex">
              {isRegular ? (
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg border bg-emerald-50 text-emerald-600 border-emerald-100/50 flex items-center gap-1">
                  Regular Closing ✓
                </span>
              ) : (
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg border bg-pink-50 text-pink-600 border-pink-100/50 flex items-center gap-1">
                  Irregular Closure ⚠
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* 3 Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col gap-1">
            <h4 className="text-2xl font-black text-slate-800">
              € {closure.taxClosure}
            </h4>
            <span className="text-[10px] font-bold text-slate-400">
              Tax Closure
            </span>
          </div>

          <div className="bg-[#f0f2ff]/30 border border-[#d0ebff] p-4 rounded-xl flex flex-col gap-1 text-[#5c60f5]">
            <h4 className="text-2xl font-black">
              € {closure.platformReceipts}
            </h4>
            <span className="text-[10px] font-bold text-slate-400">
              Platform Receipts
            </span>
          </div>

          {isRegular ? (
            <div className="bg-[#e6fcf5]/30 border border-[#c3fae8] p-4 rounded-xl flex flex-col gap-1 text-[#0ca678]">
              <h4 className="text-2xl font-black">€ {closure.difference}</h4>
              <span className="text-[10px] font-bold text-slate-400">
                Difference
              </span>
            </div>
          ) : (
            <div className="bg-[#fff0f6]/30 border border-[#ffdeeb] p-4 rounded-xl flex flex-col gap-1 text-[#e64980]">
              <h4 className="text-2xl font-black">+ € {closure.difference}</h4>
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                <span>Difference</span>
                <span className="text-[#e64980]">Tax surplus</span>
              </div>
            </div>
          )}
        </div>

        {/* Warning callout banner for irregular closures */}
        {!isRegular && (
          <div className="bg-[#fff0f6] border border-[#ffdeeb]/40 rounded-xl p-4 text-[#e64980] text-[11px] font-bold flex items-start gap-3 text-left leading-relaxed">
            <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#e64980]" />
            <p>
              Warning: Irregularity Detected — The tax closing date does not
              match the receipts recorded on the platform. Carefully check all
              the day&apos;s transactions and tax documents.
            </p>
          </div>
        )}

        {/* Receipts segment */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-800 text-left">
            Receipts of the Day ( {isRegular ? receiptsList.length : 0} )
          </h3>

          {isRegular ? (
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-100 overflow-hidden flex flex-col">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f8fafc] border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-700 whitespace-nowrap">
                        Hour
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-700 whitespace-nowrap">
                        Client
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-700 whitespace-nowrap">
                        Employee
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-700 whitespace-nowrap">
                        Services
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-700 whitespace-nowrap">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-700 whitespace-nowrap">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {receiptsList.map((row, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-3 text-xs font-semibold text-slate-500 whitespace-nowrap">
                          {row.hour}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Image
                              src={row.client.avatar}
                              alt={row.client.name}
                              width={28}
                              height={28}
                              unoptimized
                              className="h-7 w-7 rounded-full object-cover shrink-0 bg-slate-50"
                            />
                            <div className="flex flex-col text-left">
                              <span className="text-xs font-extrabold text-slate-700 leading-tight">
                                {row.client.name}
                              </span>
                              <span className="text-[9px] font-bold text-slate-400">
                                {row.client.phone}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Image
                              src={row.employee.avatar}
                              alt={row.employee.name}
                              width={28}
                              height={28}
                              unoptimized
                              className="h-7 w-7 rounded-full object-cover shrink-0 bg-slate-50"
                            />
                            <span className="text-xs font-extrabold text-slate-700">
                              {row.employee.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-xs font-bold text-slate-500 whitespace-nowrap">
                          {row.services}
                        </td>
                        <td className="px-6 py-3 text-xs font-black text-[#0ca678] whitespace-nowrap">
                          € {row.amount}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          <button
                            className="p-1 rounded-md text-[#5c60f5] hover:bg-slate-50 transition-colors cursor-pointer"
                            aria-label="View receipt details"
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-[#f8fafc]">
                      <td
                        colSpan={4}
                        className="px-6 py-3.5 text-xs font-bold text-slate-500 text-left"
                      >
                        Total
                      </td>
                      <td className="px-6 py-3.5 text-xs font-black text-[#5c60f5] text-left">
                        € 1200
                      </td>
                      <td className="px-6 py-3.5" />
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="border border-slate-100 rounded-xl py-12 flex flex-col items-center justify-center text-center gap-3">
              <FileText size={40} className="text-slate-400 shrink-0" />
              <span className="text-xs font-extrabold text-slate-500">
                No receipt recorded for this date
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
