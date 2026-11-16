import React from "react";
import Link from "next/link";
import { Calendar as CalendarIcon, Clock, ChevronRight, Trash2 } from "lucide-react";
import { RecordShift } from "./types";

interface RecordShiftsTableProps {
  shifts: RecordShift[];
  selectedMonth: string;
  selectedYear: string;
  daysWorkedDisplay: number;
  totalShiftsDisplay: number;
  totalHoursDisplay: string;
  onDeleteShift?: (id: string) => void;
}

export const RecordShiftsTable: React.FC<RecordShiftsTableProps> = ({
  shifts,
  selectedMonth,
  selectedYear,
  daysWorkedDisplay,
  totalShiftsDisplay,
  totalHoursDisplay,
  onDeleteShift,
}) => {
  const hasShifts = shifts.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-7 font-manrope">
      {/* Card Title */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[15px] sm:text-[16px] font-bold text-[#1E293B]">
          Daily Recorded Shifts — {selectedMonth} {selectedYear}
        </h2>
        <span className="text-xs font-semibold text-[#64748B]">
          {shifts.length} {shifts.length === 1 ? "record" : "records"} found
        </span>
      </div>

      {hasShifts ? (
        <div className="space-y-6">
          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[850px]">
                <thead>
                  <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">
                      Date
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">
                      Day of Week
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">
                      Schedule Type
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">
                      Time In
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">
                      Time Out
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">
                      Break
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">
                      Hours Worked
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">
                      Status
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#1E293B] text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {shifts.map((shift, idx) => (
                    <tr
                      key={shift.id || idx}
                      className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="px-5 py-4 text-[13px] font-semibold text-[#1E293B] border-r border-[#E2E8F0]">
                        {shift.date}
                      </td>
                      <td className="px-5 py-4 text-[13px] font-medium text-[#1E293B] border-r border-[#E2E8F0]">
                        {shift.dayOfWeek}
                      </td>
                      <td className="px-5 py-4 border-r border-[#E2E8F0]">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-semibold bg-[#F1F5F9] text-[#475569]">
                          {shift.scheduleType || "Regular Shift"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-[13px] font-medium text-[#1E293B] border-r border-[#E2E8F0]">
                        {shift.timeIn}
                      </td>
                      <td className="px-5 py-4 text-[13px] font-medium text-[#1E293B] border-r border-[#E2E8F0]">
                        {shift.timeOut}
                      </td>
                      <td className="px-5 py-4 text-[13px] font-medium text-[#64748B] border-r border-[#E2E8F0]">
                        {shift.breakDuration || "None"}
                      </td>
                      <td className="px-5 py-4 text-[13px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">
                        {shift.hoursWorked}
                      </td>
                      <td className="px-5 py-4 border-r border-[#E2E8F0]">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            shift.status === "Approved"
                              ? "bg-[#DCFCE7] text-[#16A34A]"
                              : shift.status === "Pending"
                              ? "bg-[#FEF3C7] text-[#D97706]"
                              : "bg-[#EEF2FF] text-[#635BFF]"
                          }`}
                        >
                          {shift.status || "Recorded"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/record-shifts/${shift.id}`}
                            className="p-1.5 text-[#64748B] hover:text-[#635BFF] hover:bg-[#EEF2FF] rounded-lg transition-colors"
                            title="View shift details"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                          {onDeleteShift && (
                            <button
                              onClick={() => onDeleteShift(shift.id)}
                              className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-lg transition-colors cursor-pointer"
                              title="Delete shift"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Summary Bar */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="text-[13px] font-bold text-[#1E293B]">Total:</span>
              <span className="text-[12px] font-semibold text-[#64748B]">
                {daysWorkedDisplay} Days
              </span>
              <span className="text-[#CBD5E1]">•</span>
              <span className="text-[12px] font-semibold text-[#64748B]">
                {totalShiftsDisplay} Shifts
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[12px] font-bold text-[#64748B]">
                Total Hours:
              </span>
              <span className="text-[14px] font-extrabold text-[#635BFF]">
                {totalHoursDisplay}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-[#E2E8F0] rounded-xl">
          <div className="w-12 h-12 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#94A3B8] mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-[14px] font-bold text-[#1E293B] mb-1">
            No Recorded Shifts Found
          </p>
          <p className="text-[12px] text-[#64748B] max-w-sm mb-4">
            No shift entries were found for this period. Click the Record Shift button to log your hours.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecordShiftsTable;
