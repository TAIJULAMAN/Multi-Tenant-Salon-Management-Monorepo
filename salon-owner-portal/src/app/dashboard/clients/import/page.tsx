"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ImportVideoBanner } from "@/components/common/ImportVideoBanner";
import { ClientImportDropzone } from "@/components/clients/import/ClientImportDropzone";
import { ClientImportTable } from "@/components/clients/import/ClientImportTable";
import { ImportedClient } from "@/components/clients/types";
import { MOCK_IMPORTED_CLIENTS } from "@/components/clients/data";

export default function ImportClientsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importedData, setImportedData] = useState<ImportedClient[]>(MOCK_IMPORTED_CLIENTS);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setImportedData(MOCK_IMPORTED_CLIENTS);
    setSelectedRows([]);
    setCurrentPage(1);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setImportedData([]);
    setSelectedRows([]);
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === importedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(importedData.map((r) => r.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const removeRow = (id: string) => {
    setImportedData((prev) => prev.filter((r) => r.id !== id));
    setSelectedRows((prev) => prev.filter((r) => r !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/clients"
            className="text-[#635BFF] hover:bg-[#EEF2FF] p-1.5 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-[14px] font-bold text-[#1E293B]">Import Clients</h1>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6 lg:p-8 space-y-8">
        {/* Tutorial Video Banner */}
        <ImportVideoBanner
          videoSrc="https://www.w3schools.com/html/mov_bbb.mp4"
          posterSrc="/playerBg.png"
        />

        {/* Dropzone Component */}
        <ClientImportDropzone
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onRemoveFile={handleRemoveFile}
        />

        {/* Preview Table */}
        {selectedFile && importedData.length > 0 && (
          <ClientImportTable
            data={importedData}
            selectedRows={selectedRows}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            onToggleSelectAll={toggleSelectAll}
            onToggleSelectRow={toggleSelectRow}
            onRemoveRow={removeRow}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Save Button */}
      {selectedFile && importedData.length > 0 && (
        <div className="flex justify-end pt-2 pb-10">
          <button className="bg-[#635BFF] hover:bg-[#524be0] text-white px-8 py-3 rounded-lg font-bold text-[14px] transition-colors shadow-sm shadow-[#635BFF]/20">
            Save
          </button>
        </div>
      )}
    </div>
  );
}
