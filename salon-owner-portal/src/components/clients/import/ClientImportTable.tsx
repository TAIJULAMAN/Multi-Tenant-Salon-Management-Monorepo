"use client";

import React from "react";
import { Check, X } from "lucide-react";
import Pagination from "@/components/saloonOwner/common/CustomPagination";
import { ImportedClient } from "@/components/clients/types";

interface ClientImportTableProps {
  data: ImportedClient[];
  selectedRows: string[];
  currentPage: number;
  itemsPerPage: number;
  onToggleSelectAll: () => void;
  onToggleSelectRow: (id: string) => void;
  onRemoveRow: (id: string) => void;
  onPageChange: (page: number) => void;
}

export const ClientImportTable: React.FC<ClientImportTableProps> = ({
  data,
  selectedRows,
  currentPage,
  itemsPerPage,
  onToggleSelectAll,
  onToggleSelectRow,
  onRemoveRow,
  onPageChange,
}) => {
  const totalPages = Math.ceil(data.length / itemsPerPage) || 1;
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-4">
      <div className="border border-[#E2E8F0] rounded-lg overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <th className="py-4 px-6 border-r border-[#E2E8F0] w-12 text-center">
                <input
                  type="checkbox"
                  className="rounded text-[#635BFF] focus:ring-[#635BFF] border-[#CBD5E1]"
                  checked={
                    selectedRows.length === data.length && data.length > 0
                  }
                  onChange={onToggleSelectAll}
                />
              </th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap">
                id
              </th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap">
                first_name
              </th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap">
                last_name
              </th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap">
                phone
              </th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap">
                email
              </th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap">
                consent
              </th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap">
                birth_date
              </th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#1E293B] whitespace-nowrap text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {paginatedData.map((row) => {
              const isSelected = selectedRows.includes(row.id);
              return (
                <tr
                  key={row.id}
                  className={`hover:bg-[#F8FAFC] transition-colors ${isSelected ? "bg-[#F1F5F9]/50" : ""}`}
                >
                  <td className="py-4 px-6 border-r border-[#E2E8F0] text-center">
                    <input
                      type="checkbox"
                      className="rounded text-[#635BFF] focus:ring-[#635BFF] border-[#CBD5E1]"
                      checked={isSelected}
                      onChange={() => onToggleSelectRow(row.id)}
                    />
                  </td>
                  <td className="py-4 px-6 border-r border-[#E2E8F0] text-[12px] font-bold text-[#635BFF]">
                    {row.id}
                  </td>
                  <td className="py-4 px-6 border-r border-[#E2E8F0] text-[12px] font-medium text-[#475569]">
                    {row.firstName}
                  </td>
                  <td className="py-4 px-6 border-r border-[#E2E8F0] text-[12px] font-medium text-[#475569]">
                    {row.lastName}
                  </td>
                  <td className="py-4 px-6 border-r border-[#E2E8F0] text-[12px] font-medium text-[#475569] whitespace-nowrap">
                    {row.phone}
                  </td>
                  <td className="py-4 px-6 border-r border-[#E2E8F0] text-[12px] font-medium text-[#475569]">
                    {row.email}
                  </td>
                  <td className="py-4 px-6 border-r border-[#E2E8F0] text-[12px] font-medium text-[#475569] capitalize">
                    {row.consent}
                  </td>
                  <td className="py-4 px-6 border-r border-[#E2E8F0] text-[12px] font-medium text-[#475569] whitespace-nowrap">
                    {row.birthDate}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onRemoveRow(row.id)}
                        className="w-7 h-7 flex items-center justify-center bg-[#FFF1F2] text-[#F43F5E] rounded-lg transition-colors hover:bg-red-100"
                        title="Remove row"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRemoveRow(row.id)}
                        className="w-7 h-7 flex items-center justify-center bg-[#F0FDFA] text-[#14B8A6] rounded-lg transition-colors hover:bg-teal-100"
                        title="Approve row"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-white">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={data.length}
          itemsPerPage={itemsPerPage}
          itemName="clients"
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};
