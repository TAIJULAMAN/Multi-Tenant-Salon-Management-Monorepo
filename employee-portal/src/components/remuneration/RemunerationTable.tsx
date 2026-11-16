import React from "react";
import Pagination from "@/components/customComponent/Pagination";
import { RemunerationRecord } from "./types";

interface RemunerationTableProps {
  paginatedData: RemunerationRecord[];
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const RemunerationTable: React.FC<RemunerationTableProps> = ({
  paginatedData,
  totalRecords,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-7 font-manrope">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-[16px] font-bold text-[#1E293B]">
            Remuneration History
          </h2>
          <p className="text-[12px] text-[#94A3B8] font-medium mt-0.5">
            Overview of your monthly payslips, gross compensation, and
            contribution records.
          </p>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
        <table className="w-full text-left border-collapse min-w-[750px]">
          <thead>
            <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
              <th className="px-6 py-4.5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[35%]">
                Data
              </th>
              <th className="px-6 py-4.5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[14%]">
                Net
              </th>
              <th className="px-6 py-4.5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[14%]">
                Gross
              </th>
              <th className="px-6 py-4.5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[14%]">
                Contributions
              </th>
              <th className="px-6 py-4.5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-[11%]">
                TFR
              </th>
              <th className="px-6 py-4.5 text-[13px] font-bold text-[#1E293B] font-manrope text-center w-[12%]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors"
              >
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-[13px] font-bold text-[#1E293B]">
                  {item.date}
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-[13px] font-semibold text-[#64748B]">
                  {item.net}
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-[13px] font-semibold text-[#64748B]">
                  {item.gross}
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-[13px] font-semibold text-[#64748B]">
                  {item.contributions}
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-[13px] font-semibold text-[#64748B]">
                  {item.tfr}
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                      item.status === "Pending"
                        ? "bg-[#FEF9C3] text-[#D97706]"
                        : "bg-[#DCFCE7] text-[#16A34A]"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-[13px] font-medium text-[#94A3B8]"
                >
                  No remuneration records found for the selected period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalRecords > 0 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalRecords}
            itemsPerPage={itemsPerPage}
            itemsName="records"
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default RemunerationTable;
