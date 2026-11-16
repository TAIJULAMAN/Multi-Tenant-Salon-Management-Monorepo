"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, Home } from "lucide-react";
import { ImportVideoBanner } from "@/components/common/ImportVideoBanner";
import { ReceiptImportDropzone } from "@/components/financial/payments/import/ReceiptImportDropzone";
import { ReceiptImportTable } from "@/components/financial/payments/import/ReceiptImportTable";
import { ImportedReceipt } from "@/components/financial/types";
import { MOCK_IMPORTED_RECEIPTS } from "@/components/financial/data";

export default function ImportReceiptsPage() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<string>("");
  const [importData, setImportData] = useState<ImportedReceipt[]>(MOCK_IMPORTED_RECEIPTS);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleFileSelect = (file: File) => {
    setFileName(file.name);
    setFileSize((file.size / (1024 * 1024)).toFixed(1) + " MB");
    setImportData(MOCK_IMPORTED_RECEIPTS);
    setSelectedIndices([]);
    setCurrentPage(1);
  };

  const handleRemoveFile = () => {
    setFileName(null);
    setFileSize("");
    setImportData([]);
    setSelectedIndices([]);
  };

  const toggleSelectAll = () => {
    if (selectedIndices.length === importData.length) {
      setSelectedIndices([]);
    } else {
      setSelectedIndices(importData.map((_, i) => i));
    }
  };

  const toggleSelect = (index: number) => {
    setSelectedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const removeRow = (index: number) => {
    setImportData((prev) => prev.filter((_, i) => i !== index));
    setSelectedIndices((prev) => prev.filter((i) => i !== index));
  };

  const handleMassAction = () => {
    setImportData((prev) => prev.filter((_, i) => !selectedIndices.includes(i)));
    setSelectedIndices([]);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/financial/payments"
            className="text-[#635BFF] hover:bg-[#EEF2FF] p-1.5 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-[14px] font-bold text-[#1E293B]">Import Receipts</h1>
        </div>
        <div className="flex items-center gap-2 text-[12px] font-medium text-[#94A3B8]">
          <Home className="w-3.5 h-3.5" />
          <span>/</span>
          <span className="bg-[#EEF2FF] text-[#635BFF] px-2.5 py-1 rounded-lg font-bold">Payments</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6 lg:p-8 space-y-8">
        {/* Tutorial Video Banner */}
        <ImportVideoBanner
          videoSrc="https://www.w3schools.com/html/mov_bbb.mp4"
          posterSrc="/playerBg.png"
        />

        {/* File Upload Dropzone */}
        <ReceiptImportDropzone
          fileName={fileName}
          fileSize={fileSize}
          onFileSelect={handleFileSelect}
          onRemoveFile={handleRemoveFile}
        />

        {/* Preview Table */}
        {fileName && importData.length > 0 && (
          <ReceiptImportTable
            data={importData}
            selectedIndices={selectedIndices}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onToggleSelectAll={toggleSelectAll}
            onToggleSelect={toggleSelect}
            onRemoveRow={removeRow}
            onMassAction={handleMassAction}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Save Button */}
      {fileName && importData.length > 0 && (
        <div className="flex justify-end pt-2 pb-10">
          <button className="bg-[#635BFF] hover:bg-[#524be0] text-white px-8 py-3 rounded-lg font-bold text-[14px] transition-colors shadow-sm shadow-[#635BFF]/20">
            Save
          </button>
        </div>
      )}
    </div>
  );
}
