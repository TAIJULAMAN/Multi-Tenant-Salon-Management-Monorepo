"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Check, X } from "lucide-react";
import Pagination from "@/components/saloonOwner/common/CustomPagination";
import { ImportedAppointment } from "../types";
import { MOCK_IMPORTED_APPOINTMENTS } from "../data";

interface AppointmentImportTableProps {
  onSelectReceipt: (row: ImportedAppointment) => void;
}

export default function AppointmentImportTable({
  onSelectReceipt,
}: AppointmentImportTableProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const toggleSelectAll = () => {
    if (selectedRows.length === MOCK_IMPORTED_APPOINTMENTS.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(MOCK_IMPORTED_APPOINTMENTS.map((r) => r.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const itemsPerPage = 5;
  const paginatedData = MOCK_IMPORTED_APPOINTMENTS.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6 space-y-6">
      {/* Table Header & Mass Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-[14px] font-bold text-[#1E293B]">
            Imported Appointments
          </h2>
          <p className="text-[12px] text-[#94A3B8] font-medium mt-0.5">
            Review and approve individual appointments
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedRows.length > 0 ? (
            <>
              <button
                onClick={() =>
                  alert(`Mass Rejecting ${selectedRows.length} items`)
                }
                className="bg-[#FFE4E6] text-[#F43F5E] hover:bg-[#FECDD3] px-4 py-1.5 rounded-lg text-[12px] font-bold transition-colors shadow-xs"
              >
                Mass Reject ({selectedRows.length})
              </button>
              <button
                onClick={() =>
                  alert(`Mass Approving ${selectedRows.length} items`)
                }
                className="bg-[#CCFBF1] text-[#14B8A6] hover:bg-[#99F6E4] px-4 py-1.5 rounded-lg text-[12px] font-bold transition-colors shadow-xs"
              >
                Mass Approve ({selectedRows.length})
              </button>
            </>
          ) : (
            <>
              <button className="border border-slate-100 text-slate-350 bg-slate-50/50 cursor-not-allowed px-4 py-1.5 rounded-lg text-[12px] font-medium">
                Mass Reject
              </button>
              <button className="border border-slate-100 text-slate-350 bg-slate-50/50 cursor-not-allowed px-4 py-1.5 rounded-lg text-[12px] font-medium">
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
                  onClick={toggleSelectAll}
                  className={`w-4 h-4 rounded-[4px] flex items-center justify-center border transition-colors ${
                    selectedRows.length === MOCK_IMPORTED_APPOINTMENTS.length
                      ? "bg-[#635BFF] border-[#635BFF] text-white"
                      : selectedRows.length > 0
                        ? "bg-[#635BFF] border-[#635BFF] text-white"
                        : "bg-white border-[#CBD5E1]"
                  }`}
                >
                  {selectedRows.length === MOCK_IMPORTED_APPOINTMENTS.length ? (
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path
                        d="M1 4L3.5 6.5L9 1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : selectedRows.length > 0 ? (
                    <svg width="10" height="2" viewBox="0 0 10 2" fill="none">
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
            {paginatedData.map((row, index) => (
              <React.Fragment key={index}>
                <tr className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors">
                  <td className="px-6 py-3 border-r border-[#E2E8F0]">
                    <button
                      onClick={() => toggleSelectRow(row.id)}
                      className={`w-4 h-4 rounded-[4px] flex items-center justify-center border transition-colors ${
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
                        className="w-7 h-7 rounded bg-[#FFE4E6] text-[#F43F5E] flex items-center justify-center hover:bg-[#FECDD3] transition-colors"
                        title="Reject"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <button
                        className="w-7 h-7 rounded bg-[#CCFBF1] text-[#14B8A6] flex items-center justify-center hover:bg-[#99F6E4] transition-colors"
                        title="Approve"
                      >
                        <Check className="w-4 h-4 stroke-[3px]" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedRowId(
                            expandedRowId === row.id ? null : row.id,
                          );
                        }}
                        className="w-7 h-7 rounded-lg hover:bg-slate-50 flex items-center justify-center text-[#635BFF] transition-colors"
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
                      <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        <h3 className="text-[13px] font-bold text-[#475569] tracking-wider uppercase">
                          Booking Order
                        </h3>

                        <div className="flex items-center justify-between w-full max-w-[620px] relative px-6">
                          <div className="absolute top-[28px] left-[50px] right-[50px] h-[2.5px] bg-slate-200 z-0"></div>

                          {/* Step 1 */}
                          <div className="flex flex-col items-center z-10 space-y-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide bg-amber-100 text-amber-700">
                              Overdue
                            </span>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] border-2 bg-white border-amber-500 text-amber-600">
                              1
                            </div>
                            <div className="text-center">
                              <div className="text-[11px] font-extrabold text-[#1E293B]">
                                12:00-12:05
                              </div>
                              <div className="text-[10px] font-bold text-[#475569]">
                                Haircut
                              </div>
                              <div className="text-[10px] font-medium text-slate-400">
                                Angelica
                              </div>
                            </div>
                          </div>

                          {/* Step 2 */}
                          <div className="flex flex-col items-center z-10 space-y-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide bg-slate-100 text-slate-500">
                              To Do
                            </span>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] border-2 bg-white border-slate-300 text-slate-500">
                              2
                            </div>
                            <div className="text-center">
                              <div className="text-[11px] font-extrabold text-[#1E293B]">
                                12:05-12:10
                              </div>
                              <div className="text-[10px] font-bold text-[#475569]">
                                Haircut
                              </div>
                              <div className="text-[10px] font-medium text-slate-400">
                                Angelica
                              </div>
                            </div>
                          </div>

                          {/* Step 3 */}
                          <div className="flex flex-col items-center z-10 space-y-2">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide bg-slate-100 text-slate-500">
                              To Do
                            </span>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] border-2 bg-white border-slate-300 text-slate-500">
                              3
                            </div>
                            <div className="text-center">
                              <div className="text-[11px] font-extrabold text-[#1E293B]">
                                12:10-12:15
                              </div>
                              <div className="text-[10px] font-bold text-[#475569]">
                                Haircut
                              </div>
                              <div className="text-[10px] font-medium text-slate-400">
                                Angelica
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => onSelectReceipt(row)}
                          className="bg-[#EEF2FF] hover:bg-[#D3DCFF] text-[#635BFF] px-6 py-2.5 rounded-xl font-bold text-[12px] transition-all flex items-center gap-2 shadow-sm border border-[#C7D2FE]"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Print Receipt
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(MOCK_IMPORTED_APPOINTMENTS.length / itemsPerPage)}
        totalItems={MOCK_IMPORTED_APPOINTMENTS.length}
        itemsPerPage={itemsPerPage}
        itemName="appointments"
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
