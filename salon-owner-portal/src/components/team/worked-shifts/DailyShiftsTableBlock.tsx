"use client";

import React from "react";
import { CalendarDays, Edit2, Trash2, ChevronDown, Plus } from "lucide-react";
import { DailyShiftRecord } from "@/components/team/types";

interface DailyShiftsTableBlockProps {
  shifts: DailyShiftRecord[];
  filterMonth: string;
  setFilterMonth: (value: string) => void;
  filterYear: string;
  setFilterYear: (value: string) => void;
  filterRange: string;
  setFilterRange: (value: string) => void;
  onOpenAddModal: () => void;
  onEditShift: (shift: DailyShiftRecord) => void;
  onDeleteShift: (shift: DailyShiftRecord) => void;
}

export default function DailyShiftsTableBlock({
  shifts,
  filterMonth,
  setFilterMonth,
  filterYear,
  setFilterYear,
  filterRange,
  setFilterRange,
  onOpenAddModal,
  onEditShift,
  onDeleteShift,
}: DailyShiftsTableBlockProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-hidden">
      <div className="p-4 sm:p-6 pb-4 flex flex-col xl:flex-row justify-between items-start xl:items-end gap-4">
        <h3 className="text-[15px] font-bold text-[#1E293B] mb-2 xl:mb-0 shrink-0">
          Daily Shifts
        </h3>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto">
          {/* Filter Group */}
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none sm:w-[130px]">
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-2 rounded-lg border border-[#E2E8F0] text-[13px] font-bold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors bg-white cursor-pointer"
              >
                <option>All Months</option>
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
                <option>May</option>
                <option>June</option>
                <option>July</option>
                <option>August</option>
                <option>September</option>
                <option>October</option>
                <option>November</option>
                <option>December</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <div className="relative flex-1 sm:flex-none sm:w-[100px]">
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-2 rounded-lg border border-[#E2E8F0] text-[13px] font-bold text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors bg-white cursor-pointer"
              >
                <option>All</option>
                <option>2023</option>
                <option>2024</option>
                <option>2025</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#94A3B8] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="relative w-full sm:w-auto">
            <CalendarDays className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Custom range..."
              value={filterRange}
              onChange={(e) => setFilterRange(e.target.value)}
              className="w-full sm:w-56 pl-9 pr-4 py-2 rounded-lg border border-[#E2E8F0] text-[13px] font-medium text-[#1E293B] outline-none focus:border-[#635BFF] transition-colors"
            />
          </div>

          <button
            onClick={onOpenAddModal}
            className="w-full sm:w-auto justify-center bg-[#635BFF] hover:bg-[#524be0] text-white px-4 py-2 rounded-lg font-semibold text-[13px] flex items-center gap-1.5 transition-colors shadow-sm shadow-[#635BFF]/20 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            Add Shift
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                Date
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                Day of Week
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                Shifts
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                Time In
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                Time Out
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                Hours Worked
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0]">
                Daily Total
              </th>
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr
                key={shift.id}
                className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors"
              >
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-[13px] text-[#1E293B] font-medium">
                  {shift.date}
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-[13px] text-[#1E293B] font-medium">
                  {shift.day}
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0]">
                  <div className="flex items-center gap-2 text-[13px] font-medium text-[#1E293B]">
                    <div className="w-2 h-2 rounded-full bg-[#635BFF]" />
                    {shift.shifts}
                  </div>
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-[13px] text-[#1E293B] font-medium">
                  {shift.timeIn}
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-[13px] text-[#1E293B] font-medium">
                  {shift.timeOut}
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-[13px] text-[#1E293B] font-medium">
                  {shift.hours}
                </td>
                <td className="px-6 py-4 border-r border-[#E2E8F0] text-[13px] text-[#1E293B] font-medium">
                  {shift.total}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onEditShift(shift)}
                      className="text-[#64748B] hover:text-[#635BFF] transition-colors p-1.5 rounded-lg hover:bg-[#F1F5F9] inline-flex items-center justify-center"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteShift(shift)}
                      className="text-[#64748B] hover:text-[#EF4444] transition-colors p-1.5 rounded-lg hover:bg-[#F1F5F9] inline-flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Stats Bar */}
      <div className="bg-[#F8FAFC] p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-4">
          <span className="text-[14px] font-bold text-[#1E293B]">
            Total Days Worked
          </span>
          <span className="bg-[#635BFF] text-white px-4 py-1.5 rounded-full text-[12px] font-bold">
            21 Days
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[14px] font-bold text-[#1E293B]">
            Total Shifts
          </span>
          <span className="bg-[#635BFF] text-white px-4 py-1.5 rounded-full text-[12px] font-bold">
            2
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[14px] font-bold text-[#1E293B]">
            Monthly Total
          </span>
          <span className="bg-[#635BFF] text-white px-4 py-1.5 rounded-full text-[12px] font-bold">
            165h
          </span>
        </div>
      </div>
    </div>
  );
}

