import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { WorkedShift } from "./types";

interface WorkedShiftsTableProps {
  shifts: WorkedShift[];
  selectedMonth: string;
  selectedYear: string;
  daysWorkedDisplay: number;
  totalShiftsDisplay: number;
  totalHoursDisplay: string;
}

export const WorkedShiftsTable: React.FC<WorkedShiftsTableProps> = ({
  shifts,
  selectedMonth,
  selectedYear,
  daysWorkedDisplay,
  totalShiftsDisplay,
  totalHoursDisplay,
}) => {
  const hasShifts = shifts.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-7 font-manrope">
      {/* Card Title */}
      <h2 className="text-[15px] sm:text-[16px] font-bold text-[#1E293B] mb-5">
        Daily Shifts - {selectedMonth} {selectedYear}
      </h2>

      {hasShifts ? (
        <div className="space-y-6">
          <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">
                      Date
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">
                      Day of Week
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">
                      Shifts
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">
                      Time In
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">
                      Time Out
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#1E293B] border-r border-[#E2E8F0]">
                      Hours Worked
                    </th>
                    <th className="px-5 py-3.5 text-[12px] font-bold text-[#1E293B]">
                      Daily Total
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
                        <div className="flex items-center gap-2 text-[13px] font-medium text-[#1E293B]">
                          <span className="w-2 h-2 rounded-full bg-[#635BFF] shrink-0" />
                          <span>{shift.shiftsCount}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[13px] font-medium text-[#1E293B] border-r border-[#E2E8F0]">
                        {shift.timeIn}
                      </td>
                      <td className="px-5 py-4 text-[13px] font-medium text-[#1E293B] border-r border-[#E2E8F0]">
                        {shift.timeOut}
                      </td>
                      <td className="px-5 py-4 text-[13px] font-medium text-[#1E293B] border-r border-[#E2E8F0]">
                        {shift.hoursWorked}
                      </td>
                      <td className="px-5 py-4 text-[13px] font-bold text-[#1E293B]">
                        {shift.dailyTotal}
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
              <span className="text-[13px] font-bold text-[#1E293B]">
                Total Days Worked
              </span>
              <span className="bg-[#635BFF] text-white text-[12px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                {daysWorkedDisplay} Days
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[13px] font-bold text-[#1E293B]">
                Total Shifts
              </span>
              <span className="bg-[#635BFF] text-white text-[12px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                {totalShiftsDisplay}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[13px] font-bold text-[#1E293B]">
                Monthly Total
              </span>
              <span className="bg-[#635BFF] text-white text-[12px] font-bold px-2.5 py-1 rounded-lg shadow-sm">
                {totalHoursDisplay}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State Box */
        <div className="border border-[#E2E8F0] rounded-2xl py-20 px-6 flex flex-col items-center justify-center gap-3.5 bg-white text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-[#64748B]">
            <CalendarIcon className="w-10 h-10 stroke-[1.5]" />
          </div>
          <p className="text-[14px] font-semibold text-[#1E293B]">
            No shifts recorded
          </p>
        </div>
      )}
    </div>
  );
};

export default WorkedShiftsTable;
