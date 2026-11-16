"use client";

import React from "react";
import { ChevronDown, ChevronUp, Check, X } from "lucide-react";
import Pagination from "@/components/customComponent/Pagination";
import BookingOrderStepper from "./BookingOrderStepper";
import { ImportedTableProps } from "./types";

const ITEMS_PER_PAGE = 5;

export default function ImportedTable({
  data,
  selectedRows,
  onToggleSelectAll,
  onToggleSelectRow,
  expandedRowId,
  onToggleExpandRow,
  onOpenReceipt,
  currentPage,
  onPageChange,
}: ImportedTableProps) {
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100 fill-mode-both">
      {/* Table Header Controls */}
      <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
        <h2 className="text-[14px] font-bold text-[#1E293B]">Imported List</h2>
        <div className="flex items-center gap-3">
          {selectedRows.length > 0 ? (
            <>
              <button
                type="button"
                className="bg-[#FFE4E6] hover:bg-[#FECDD3] text-[#F43F5E] px-4 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer"
                onClick={() => alert(`Mass Reject ${selectedRows.length} item(s)`)}
              >
                Mass Reject
              </button>
              <button
                type="button"
                className="bg-[#14B8A6] hover:bg-[#0D9488] text-white px-4 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer"
                onClick={() => alert(`Mass Approve ${selectedRows.length} item(s)`)}
              >
                Mass Approve
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                disabled
                className="border border-slate-100 text-slate-350 bg-slate-50/50 cursor-not-allowed px-4 py-1.5 rounded-lg text-[12px] font-medium"
              >
                Mass Reject
              </button>
              <button
                type="button"
                disabled
                className="border border-slate-100 text-slate-350 bg-slate-50/50 cursor-not-allowed px-4 py-1.5 rounded-lg text-[12px] font-medium"
              >
                Mass Approve
              </button>
            </>
          )}
        </div>
      </div>

      {/* Interactive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
              <th className="px-6 py-4 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[5%]">
                <button
                  type="button"
                  onClick={onToggleSelectAll}
                  className={`w-4 h-4 rounded-[4px] flex items-center justify-center border transition-colors cursor-pointer ${
                    selectedRows.length === data.length
                      ? "bg-[#635BFF] border-[#635BFF] text-white"
                      : selectedRows.length > 0
                      ? "bg-[#635BFF] border-[#635BFF] text-white"
                      : "bg-white border-[#CBD5E1]"
                  }`}
                >
                  {selectedRows.length === data.length ? (
                    <svg
                      width="10"
                      height="8"
                      viewBox="0 0 10 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : selectedRows.length > 0 ? (
                    <svg
                      width="10"
                      height="2"
                      viewBox="0 0 10 2"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1H9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </button>
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                id
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                start_at
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                end_at
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                client_ref
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                service_ref
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                staff_ref
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                status
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                note
              </th>
              <th className="px-6 py-4 text-[13px] font-bold text-[#1E293B] font-manrope text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row) => (
              <React.Fragment key={row.id}>
                <tr className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-6 py-3 border-r border-[#E2E8F0]">
                    <button
                      type="button"
                      onClick={() => onToggleSelectRow(row.id)}
                      className={`w-4 h-4 rounded-[4px] flex items-center justify-center border transition-colors cursor-pointer ${
                        selectedRows.includes(row.id)
                          ? "bg-[#635BFF] border-[#635BFF] text-white"
                          : "bg-white border-[#CBD5E1]"
                      }`}
                    >
                      {selectedRows.includes(row.id) && (
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-3 border-r border-[#E2E8F0] text-[12px] font-semibold text-[#635BFF]">
                    {row.id}
                  </td>
                  <td className="px-6 py-3 border-r border-[#E2E8F0] text-[12px] font-medium text-[#1E293B]">
                    {row.startAt}
                  </td>
                  <td className="px-6 py-3 border-r border-[#E2E8F0] text-[12px] font-medium text-[#1E293B]">
                    {row.endAt}
                  </td>
                  <td className="px-6 py-3 border-r border-[#E2E8F0] text-[12px] font-medium text-[#1E293B]">
                    {row.clientRef}
                  </td>
                  <td className="px-6 py-3 border-r border-[#E2E8F0] text-[12px] font-medium text-[#1E293B]">
                    {row.serviceRef}
                  </td>
                  <td className="px-6 py-3 border-r border-[#E2E8F0] text-[12px] font-medium text-[#1E293B]">
                    {row.staffRef}
                  </td>
                  <td className="px-6 py-3 border-r border-[#E2E8F0] text-[12px] font-medium text-[#1E293B]">
                    {row.status}
                  </td>
                  <td className="px-6 py-3 border-r border-[#E2E8F0] text-[12px] font-medium text-[#1E293B]">
                    {row.note}
                  </td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        className="w-7 h-7 rounded bg-[#FFE4E6] text-[#F43F5E] flex items-center justify-center hover:bg-[#FECDD3] transition-colors cursor-pointer"
                        title="Reject"
                        onClick={() => alert(`Reject appointment ${row.id}`)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        className="w-7 h-7 rounded bg-[#CCFBF1] text-[#14B8A6] flex items-center justify-center hover:bg-[#99F6E4] transition-colors cursor-pointer"
                        title="Approve"
                        onClick={() => alert(`Approve appointment ${row.id}`)}
                      >
                        <Check className="w-4 h-4 stroke-[3px]" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleExpandRow(row.id);
                        }}
                        className="w-7 h-7 rounded-lg hover:bg-slate-50 flex items-center justify-center text-[#635BFF] transition-colors cursor-pointer"
                      >
                        {expandedRowId === row.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>

                {expandedRowId === row.id && (
                  <tr className="bg-[#F8FAFC]/60">
                    <td
                      colSpan={10}
                      className="px-6 py-6 border-b border-[#E2E8F0]"
                    >
                      <BookingOrderStepper
                        status={row.status}
                        onPrintReceipt={() => onOpenReceipt(row)}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={data.length}
        itemsPerPage={ITEMS_PER_PAGE}
        itemName="appointments"
        onPageChange={onPageChange}
      />
    </div>
  );
}
