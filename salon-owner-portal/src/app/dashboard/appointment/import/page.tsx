"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ImportedAppointment } from "@/components/appointment/types";
import AppointmentImportUploader from "@/components/appointment/import/AppointmentImportUploader";
import AppointmentImportTable from "@/components/appointment/import/AppointmentImportTable";
import ImportServiceReceiptModal from "@/components/appointment/import/ImportServiceReceiptModal";

export default function ImportAppointmentsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState<ImportedAppointment | null>(null);

  const handleSelectReceipt = (row: ImportedAppointment) => {
    setSelectedRowData(row);
    setIsReceiptOpen(true);
  };

  return (
    <div className="w-full space-y-6 pb-24">
      {/* Header bar */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/appointment"
            className="text-[#64748B] hover:text-[#635BFF] transition-colors p-1 rounded-lg hover:bg-[#EEF2FF]"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-[1.1rem] font-bold text-[#1E293B] font-manrope">
            Import Appointments
          </h1>
        </div>
        <div className="text-[12px] font-medium text-[#94A3B8] flex items-center gap-2">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          /{" "}
          <span className="bg-[#EEF2FF] text-[#635BFF] px-2 py-1 rounded-lg">
            Appointments
          </span>
        </div>
      </div>

      {/* Main Content Sections */}
      <AppointmentImportUploader
        selectedFile={selectedFile}
        onFileSelect={setSelectedFile}
      />

      <AppointmentImportTable
        onSelectReceipt={handleSelectReceipt}
      />

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link
          href="/dashboard/appointment"
          className="bg-[#635BFF] hover:bg-[#524be0] text-white px-8 py-3 rounded-lg text-[14px] font-bold shadow-lg shadow-[#635BFF]/30 transition-colors animate-in zoom-in-95 duration-300 block text-center"
        >
          Save
        </Link>
      </div>

      {/* Fiscal Service Receipt Modal */}
      <ImportServiceReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        selectedRowData={selectedRowData}
      />
    </div>
  );
}
