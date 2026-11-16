"use client";

import React from "react";
import { Check, X, FileText } from "lucide-react";
import { BookingOrderStepperProps } from "./types";

export default function BookingOrderStepper({
  status,
  onPrintReceipt,
}: BookingOrderStepperProps) {
  const isCancelled = status === "Cancelled";
  const isCompleted = status === "Completed";
  const isBooked = status === "Booked";
  const isStarted = status === "Started";

  return (
    <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
      <h3 className="text-[13px] font-bold text-[#475569] tracking-wider uppercase">
        Booking Order
      </h3>

      {/* Steps container */}
      <div className="flex items-center justify-between w-full max-w-[620px] relative px-6">
        {/* Connector line */}
        <div className="absolute top-[28px] left-[50px] right-[50px] h-[2.5px] bg-slate-200 z-0" />

        {/* Step 1 */}
        <div className="flex flex-col items-center z-10 space-y-2">
          <span
            className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold tracking-wide ${
              isBooked
                ? "bg-amber-100 text-amber-700"
                : isStarted
                ? "bg-sky-100 text-sky-700"
                : isCancelled
                ? "bg-rose-100 text-rose-700"
                : isCompleted
                ? "bg-emerald-100 text-emerald-700"
                : "bg-indigo-50 text-indigo-600"
            }`}
          >
            {isBooked
              ? "Overdue"
              : isStarted
              ? "Doing"
              : isCancelled
              ? "Canceled"
              : isCompleted
              ? "Completed"
              : "To Do"}
          </span>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] border-2 bg-white ${
              isBooked
                ? "border-amber-500 text-amber-600"
                : isStarted
                ? "border-sky-500 text-sky-600"
                : isCancelled
                ? "border-rose-500 text-rose-600"
                : isCompleted
                ? "border-emerald-500 text-emerald-600"
                : "border-indigo-500 text-indigo-600"
            }`}
          >
            {isCancelled ? (
              <X className="w-4 h-4 stroke-[3px]" />
            ) : isCompleted ? (
              <Check className="w-4 h-4 stroke-[3px]" />
            ) : (
              "1"
            )}
          </div>
          <div className="text-center">
            <div className="text-[11px] font-extrabold text-[#1E293B]">
              12:00-12:05
            </div>
            <div className="text-[10px] font-bold text-[#475569]">Haircut</div>
            <div className="text-[10px] font-medium text-slate-400">Angelica</div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center z-10 space-y-2">
          <span
            className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold tracking-wide ${
              isCancelled
                ? "bg-rose-100 text-rose-700"
                : isCompleted
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {isCancelled
              ? "Canceled"
              : isCompleted
              ? "Completed"
              : "To Do"}
          </span>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] border-2 bg-white ${
              isCancelled
                ? "border-rose-500 text-rose-600"
                : isCompleted
                ? "border-emerald-500 text-emerald-600"
                : "border-slate-300 text-slate-500"
            }`}
          >
            {isCancelled ? (
              <X className="w-4 h-4 stroke-[3px]" />
            ) : isCompleted ? (
              <Check className="w-4 h-4 stroke-[3px]" />
            ) : (
              "2"
            )}
          </div>
          <div className="text-center">
            <div className="text-[11px] font-extrabold text-[#1E293B]">
              12:05-12:10
            </div>
            <div className="text-[10px] font-bold text-[#475569]">Haircut</div>
            <div className="text-[10px] font-medium text-slate-400">Angelica</div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center z-10 space-y-2">
          <span
            className={`px-2 py-0.5 rounded-lg text-[10px] font-extrabold tracking-wide ${
              isCancelled
                ? "bg-rose-100 text-rose-700"
                : isCompleted
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {isCancelled
              ? "Canceled"
              : isCompleted
              ? "Completed"
              : "To Do"}
          </span>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] border-2 bg-white ${
              isCancelled
                ? "border-rose-500 text-rose-600"
                : isCompleted
                ? "border-emerald-500 text-emerald-600"
                : "border-slate-300 text-slate-500"
            }`}
          >
            {isCancelled ? (
              <X className="w-4 h-4 stroke-[3px]" />
            ) : isCompleted ? (
              <Check className="w-4 h-4 stroke-[3px]" />
            ) : (
              "3"
            )}
          </div>
          <div className="text-center">
            <div className="text-[11px] font-extrabold text-[#1E293B]">
              12:10-12:15
            </div>
            <div className="text-[10px] font-bold text-[#475569]">Haircut</div>
            <div className="text-[10px] font-medium text-slate-400">Angelica</div>
          </div>
        </div>
      </div>

      {/* Action Row */}
      <button
        onClick={onPrintReceipt}
        className="bg-[#EEF2FF] hover:bg-[#D3DCFF] text-[#635BFF] px-6 py-2.5 rounded-xl font-bold text-[12px] transition-all flex items-center gap-2 shadow-sm border border-[#C7D2FE] cursor-pointer"
      >
        <FileText className="w-3.5 h-3.5" />
        Print Receipt
      </button>
    </div>
  );
}
