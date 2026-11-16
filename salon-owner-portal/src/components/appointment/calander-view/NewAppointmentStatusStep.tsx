"use client";

import React from "react";
import CustomSelect from "@/components/customComponent/CustomSelect";
import { AppStatus } from "@/@types/salon-owner/CalAppointment.type";
import {
  modalStatusOptions,
  MOCK_RECEIPTS,
} from "@/components/appointment/data";

interface NewAppointmentStatusStepProps {
  selectedStatus: AppStatus;
  setSelectedStatus: (status: AppStatus) => void;
  selectedPaymentStatus: "Paid" | "Partially Paid" | "Unpaid";
  setSelectedPaymentStatus: (
    status: "Paid" | "Partially Paid" | "Unpaid",
  ) => void;
  associatedReceipt: string;
  setAssociatedReceipt: (receipt: string) => void;
  appointmentNote: string;
  setAppointmentNote: (note: string) => void;
}

export default function NewAppointmentStatusStep({
  selectedStatus,
  setSelectedStatus,
  selectedPaymentStatus,
  setSelectedPaymentStatus,
  associatedReceipt,
  setAssociatedReceipt,
  appointmentNote,
  setAppointmentNote,
}: NewAppointmentStatusStepProps) {
  return (
    <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <label className="text-[12px] font-bold text-[#999] mb-4 block">
          Status
        </label>
        <div className="flex gap-4">
          {modalStatusOptions.map((status) => {
            const isSelected = selectedStatus === status;
            const color = status === "Booked" ? "#635BFF" : "#10B981";
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`flex-1 flex items-center gap-3 p-4 rounded-[4px] border text-[14px] font-bold transition-all ${
                  isSelected
                    ? "bg-slate-50"
                    : "bg-white border-slate-200 text-[#999]"
                }`}
                style={{
                  borderColor: isSelected ? color : undefined,
                  color: isSelected ? "#29343D" : undefined,
                }}
              >
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {status}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-[12px] font-bold text-[#999] mb-4 block">
          Payment Status
        </label>
        <div className="flex gap-4">
          {(["Paid", "Partially Paid", "Unpaid"] as const).map((status) => {
            const isSelected = selectedPaymentStatus === status;
            const color =
              status === "Paid"
                ? "#10B981"
                : status === "Partially Paid"
                  ? "#F59E0B"
                  : "#E53535";
            return (
              <button
                key={status}
                onClick={() => setSelectedPaymentStatus(status)}
                className={`flex-1 flex items-center gap-2 p-3 rounded-[4px] border text-[13px] font-bold transition-all ${
                  isSelected
                    ? "bg-slate-50"
                    : "bg-white border-slate-200 text-[#999]"
                }`}
                style={{
                  borderColor: isSelected ? color : undefined,
                  color: isSelected ? "#29343D" : undefined,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: color }}
                />
                {status}
              </button>
            );
          })}
        </div>
        {selectedPaymentStatus === "Paid" && (
          <div className="mt-4 animate-in fade-in slide-in-from-top-2">
            <label className="text-[12px] font-bold text-[#999] mb-2 block">
              Associate Existing Receipt
            </label>
            <CustomSelect
              value={associatedReceipt}
              onChange={setAssociatedReceipt}
              options={[
                { label: "Select a receipt...", value: "" },
                ...MOCK_RECEIPTS.map((r) => ({ label: r, value: r })),
              ]}
            />
            <p className="text-[11px] text-[#999] mt-2 leading-relaxed">
              This will automatically discount the amount when releasing the
              final receipt in person.
            </p>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-slate-100">
        <label className="text-[12px] font-bold text-[#999] mb-4 block">
          Appointment Note
        </label>
        <textarea
          value={appointmentNote}
          onChange={(e) => setAppointmentNote(e.target.value)}
          placeholder="Add a note to this appointment..."
          className="w-full bg-white border border-slate-200 rounded-[8px] p-4 text-[13px] text-[#29343D] outline-none focus:border-[#635BFF] transition-colors resize-none min-h-[100px]"
        />
      </div>
    </section>
  );
}
