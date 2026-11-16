"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import TemplateCards from "./TemplateCards";
import DropzoneSection from "./DropzoneSection";
import ImportedTable from "./ImportedTable";
import ServiceReceiptModal from "./ServiceReceiptModal";
import { mockImportedAppointments } from "./data";
import { ImportedAppointment } from "./types";

export default function ImportAppointmentContent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] =
    useState<ImportedAppointment | null>(null);

  const toggleSelectAll = () => {
    if (selectedRows.length === mockImportedAppointments.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(mockImportedAppointments.map((r) => r.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const toggleExpandRow = (id: string) => {
    setExpandedRowId((prev) => (prev === id ? null : id));
  };

  const handleOpenReceipt = (row: ImportedAppointment) => {
    setSelectedRowData(row);
    setIsReceiptOpen(true);
  };

  const handleCloseReceipt = () => {
    setIsReceiptOpen(false);
    setSelectedRowData(null);
  };

  return (
    <div className="w-full space-y-6 pb-24 font-manrope">
      {/* Header bar */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/appointment"
            className="text-[#64748B] hover:text-[#635BFF] transition-colors p-1 rounded-lg hover:bg-[#EEF2FF]"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-[1.1rem] font-bold text-[#1E293B]">
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

      {/* Main Configuration Card */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6 space-y-8">
        <VideoPlayer />
        <TemplateCards />
        <DropzoneSection
          selectedFile={selectedFile}
          onFileSelect={setSelectedFile}
        />
      </div>

      {/* Imported Table (shows when file is uploaded) */}
      {selectedFile && (
        <ImportedTable
          data={mockImportedAppointments}
          selectedRows={selectedRows}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectRow={toggleSelectRow}
          expandedRowId={expandedRowId}
          onToggleExpandRow={toggleExpandRow}
          onOpenReceipt={handleOpenReceipt}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Link
          href="/appointment"
          className="bg-[#635BFF] hover:bg-[#524be0] text-white px-8 py-3 rounded-lg text-[14px] font-bold shadow-lg shadow-[#635BFF]/30 transition-colors animate-in zoom-in-95 duration-300 block text-center"
        >
          Save
        </Link>
      </div>
      <ServiceReceiptModal
        isOpen={isReceiptOpen}
        onClose={handleCloseReceipt}
        data={selectedRowData}
      />
    </div>
  );
}
