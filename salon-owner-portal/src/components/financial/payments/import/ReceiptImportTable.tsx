"use client";

import React from "react";
import { X, Check } from "lucide-react";
import Pagination from "@/components/saloonOwner/common/CustomPagination";
import { ImportedReceipt } from "@/components/financial/types";

interface ReceiptImportTableProps {
  data: ImportedReceipt[];
  selectedIndices: number[];
  currentPage: number;
  itemsPerPage: number;
  onToggleSelectAll: () => void;
  onToggleSelect: (index: number) => void;
  onRemoveRow: (index: number) => void;
  onMassAction: () => void;
  onPageChange: (page: number) => void;
}

export const ReceiptImportTable: React.FC<ReceiptImportTableProps> = ({
  data,
  selectedIndices,
  currentPage,
  itemsPerPage,
  onToggleSelectAll,
  onToggleSelect,
  onRemoveRow,
  onMassAction,
  onPageChange,
}) => {
  const totalPages = Math.ceil(data.length / itemsPerPage) || 1;
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="space-y-4">
      {selectedIndices.length > 0 && (
        <div className="flex items-center justify-between bg-[#F8F9FE] border border-[#E2E8F0] p-3 rounded-lg">
          <span className="text-[12px] font-bold text-[#635BFF]">
            {selectedIndices.length} item(s) selected
          </span>
          <button
            onClick={onMassAction}
            className="px-3 py-1.5 bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#F43F5E] text-[11px] font-bold rounded-lg transition-colors"
          >
            Delete Selected
          </button>
        </div>
      )}

      <div className="border border-[#E2E8F0] rounded-lg overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              <th className="py-4 px-6 border-r border-[#E2E8F0] w-12 text-center">
                <input
                  type="checkbox"
                  className="rounded text-[#635BFF] focus:ring-[#635BFF] border-[#CBD5E1]"
                  checked={
                    selectedIndices.length === data.length && data.length > 0
                  }
                  onChange={onToggleSelectAll}
                />
              </th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap">
                id
              </th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap">
                receipt_number
              </th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap">
                date
              </th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap">
                client_ref
              </th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap">
                total
              </th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap">
                vat
              </th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap">
                discount
              </th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0] whitespace-nowrap">
                payment_method
              </th>
              <th className="py-4 px-6 text-[12px] font-bold text-[#1E293B] whitespace-nowrap text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">
            {paginatedData.map((item, i) => {
              const actualIndex = (currentPage - 1) * itemsPerPage + i;
              const isSelected = selectedIndices.includes(actualIndex);
              return (
                <tr
                  key={actualIndex}
                  className={`hover:bg-[#F8FAFC] transition-colors ${isSelected ? "bg-[#F1F5F9]/50" : ""}`}
                >
                  <td className="py-4 px-6 border-r border-[#E2E8F0] text-center">
                    <input
                      type="checkbox"
                      className="rounded text-[#635BFF] focus:ring-[#635BFF] border-[#CBD5E1]"
                      checked={isSelected}
                      onChange={() => onToggleSelect(actualIndex)}
                    />
                  </td>
                  <td className="py-4 px-6 border-r border-[#E2E8F0] text-[12px] font-bold text-[#635BFF]">
                    {item.id}
                  </td>
                  <td className="py-4 px-6 border-r border-[#E2E8F0] text-[12px] font-medium text-[#475569]">
                    {item.receipt_number}
                  </td>
                  <td className="py-4 px-6 border-r border-[#E2E8F0] text-[12px] font-medium text-[#475569] whitespace-nowrap">
                    {item.date}
                  </td>
                  <td className="py-4 px-6 border-r border-[#E2E8F0] text-[12px] font-medium text-[#475569]">
                    {item.client_ref}
                  </td>
                  <td className="py-4 px-6 border-r border-[#E2E8F0] text-[12px] font-medium text-[#475569]">
                    {item.total}
                  </td>
                  <td className="py-4 px-6 border-r border-[#E2E8F0] text-[12px] font-medium text-[#475569]">
                    {item.vat}
                  </td>
                  <td className="py-4 px-6 border-r border-[#E2E8F0] text-[12px] font-medium text-[#475569]">
                    {item.discount}
                  </td>
                  <td className="py-4 px-6 border-r border-[#E2E8F0] text-[12px] font-medium text-[#475569] whitespace-nowrap">
                    {item.payment_method}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onRemoveRow(actualIndex)}
                        className="w-7 h-7 flex items-center justify-center bg-[#FFF1F2] text-[#F43F5E] rounded-lg transition-colors hover:bg-red-100"
                        title="Remove row"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onRemoveRow(actualIndex)}
                        className="w-7 h-7 flex items-center justify-center bg-[#F0FDFA] text-[#14B8A6] rounded-lg transition-colors hover:bg-teal-100"
                        title="Confirm row"
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
          itemName="receipts"
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};
