import React, { useRef, useEffect } from "react";
import { Edit2, Trash2 } from "lucide-react";
import Pagination from "@/components/saloonOwner/common/CustomPagination";

type Shift = {
  time: string;
};

export type MemberSchedule = {
  id: string;
  name: string;
  hours: string;
  avatarBg: string;
  avatarUrl: string;
  shifts: (Shift | null)[];
};

type ClosedPeriod = { id: string; startDate: string; endDate: string; reason: string };
type OverriddenSlot = { memberId: string; dateString: string };

interface WeeklyShiftsTableProps {
  currentWeekStart: Date;
  schedules: MemberSchedule[];
  closedPeriods: ClosedPeriod[];
  overriddenClosedSlots: OverriddenSlot[];
  activeShiftMenu: { memberId: string, dayIndex: number } | null;
  activeClosedSlotMenu: { memberId: string, dateString: string, periodId: string } | null;
  currentPage: number;
  itemsPerPage: number;
  onShiftClick: (e: React.MouseEvent, memberId: string, dayIndex: number) => void;
  onClosedSlotClick: (e: React.MouseEvent, memberId: string, dateString: string, periodId: string) => void;
  onEditShift: (memberId: string, dayIndex: number, time: string) => void;
  onDeleteShift: (memberId: string, dayIndex: number, time: string) => void;
  onReactivateSlot: (memberId: string, dateString: string) => void;
  onReopenPeriod: (periodId: string) => void;
  onPageChange: (page: number) => void;
  shiftMenuRef: React.RefObject<HTMLDivElement | null>;
}

export default function WeeklyShiftsTable({
  currentWeekStart,
  schedules,
  closedPeriods,
  overriddenClosedSlots,
  activeShiftMenu,
  activeClosedSlotMenu,
  currentPage,
  itemsPerPage,
  onShiftClick,
  onClosedSlotClick,
  onEditShift,
  onDeleteShift,
  onReactivateSlot,
  onReopenPeriod,
  onPageChange,
  shiftMenuRef,
}: WeeklyShiftsTableProps) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const daysOfWeek = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + i);
    const dayName = dayNames[date.getDay()];
    const dateNum = date.getDate();
    const monthName = monthNames[date.getMonth()];
    return `${dayName}, ${dateNum} ${monthName}`;
  });

  const totalPages = Math.ceil(schedules.length / itemsPerPage);
  const paginatedSchedules = schedules.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1200px]">
          <thead>
            <tr className="bg-[#F8F9FE] border-b border-[#E2E8F0]">
              <th className="px-6 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] w-64">Member</th>
              {daysOfWeek.map((day, idx) => (
                <th key={idx} className="px-4 py-5 text-[13px] font-bold text-[#1E293B] font-manrope border-r border-[#E2E8F0] text-center w-[160px] last:border-r-0">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedSchedules.map((schedule, rowIdx) => {
              const isBottomRow = rowIdx >= paginatedSchedules.length - 2 && paginatedSchedules.length > 2;
              return (
              <tr key={schedule.id} className="border-b border-[#E2E8F0] last:border-b-0 hover:bg-[#F8FAFC] transition-colors">
                <td className="px-6 py-4 border-r border-[#E2E8F0] bg-white">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden shrink-0 ${schedule.avatarBg}`}>
                      <img src={schedule.avatarUrl} alt={schedule.name} className="w-8 h-8 object-cover mix-blend-multiply" />
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-[#1E293B] leading-tight">{schedule.name}</div>
                      <div className="text-[11px] text-[#94A3B8] font-medium mt-0.5">{schedule.hours}</div>
                    </div>
                  </div>
                </td>
                {schedule.shifts.map((shift, idx) => {
                  const cellDate = new Date(currentWeekStart);
                  cellDate.setDate(cellDate.getDate() + idx);
                  cellDate.setHours(0, 0, 0, 0);
                  const dateString = cellDate.toLocaleDateString('en-CA');

                  const activeClosedPeriod = closedPeriods.find(p => {
                    const start = new Date(p.startDate);
                    start.setHours(0, 0, 0, 0);
                    const end = new Date(p.endDate);
                    end.setHours(0, 0, 0, 0);
                    return cellDate >= start && cellDate <= end;
                  });

                  const isOverridden = overriddenClosedSlots.some(
                    slot => slot.memberId === schedule.id && slot.dateString === dateString
                  );

                  const isClosed = activeClosedPeriod && !isOverridden;

                  if (isClosed) {
                    return (
                      <td key={idx} className="px-4 py-3 border-r border-[#E2E8F0] bg-white last:border-r-0 relative">
                        <div className="relative group w-full">
                          <button
                            onClick={(e) => onClosedSlotClick(e, schedule.id, dateString, activeClosedPeriod.id)}
                            className="w-full py-2 px-3 rounded-lg text-[11px] font-bold transition-colors bg-[#F1F5F9] text-[#94A3B8] hover:bg-[#E2E8F0] hover:text-[#64748B] border border-[#CBD5E1] border-dashed"
                          >
                            Closed
                          </button>
                          
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 bg-[#1E293B] text-white text-[11px] font-medium p-2.5 rounded-lg shadow-lg z-20 before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-[#1E293B]">
                            <div className="flex items-center gap-1.5 mb-1 text-[#FCD34D]">
                              ⚠️ <span className="font-bold">Business Closed</span>
                            </div>
                            <span className="text-[#CBD5E1]">{activeClosedPeriod.reason || "No reason provided"}</span>
                          </div>

                          {activeClosedSlotMenu?.memberId === schedule.id && activeClosedSlotMenu?.dateString === dateString && (
                            <div
                              ref={shiftMenuRef}
                              className={`absolute ${isBottomRow ? 'bottom-full mb-2' : 'top-full mt-2'} left-1/2 -translate-x-1/2 w-[180px] bg-white rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-[#E2E8F0] py-1.5 z-30`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onReactivateSlot(schedule.id, dateString);
                                }}
                                className="w-full text-left px-4 py-2.5 text-[12px] font-semibold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B] transition-colors flex items-center gap-2"
                              >
                                Reactivate slot
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onReopenPeriod(activeClosedPeriod.id);
                                }}
                                className="w-full text-left px-4 py-2.5 text-[12px] font-semibold text-[#EF4444] hover:bg-[#FEF2F2] transition-colors flex items-center gap-2"
                              >
                                Reopen business period
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td key={idx} className="px-4 py-3 border-r border-[#E2E8F0] bg-white last:border-r-0 relative">
                      {shift && (
                        <div className="relative">
                          <button
                            onClick={(e) => onShiftClick(e, schedule.id, idx)}
                            className={`w-full py-2 px-3 rounded-lg text-[11px] font-bold transition-colors ${activeShiftMenu?.memberId === schedule.id && activeShiftMenu?.dayIndex === idx
                              ? "bg-[#C7D2FE] text-[#4F46E5]"
                              : "bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#635BFF]"
                              }`}
                          >
                            {shift.time}
                          </button>

                          {activeShiftMenu?.memberId === schedule.id && activeShiftMenu?.dayIndex === idx && (
                            <div
                              ref={shiftMenuRef}
                              className={`absolute ${isBottomRow ? 'bottom-full mb-2' : 'top-full mt-2'} left-1/2 -translate-x-1/2 w-40 bg-white rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-[#E2E8F0] py-1.5 z-30`}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditShift(schedule.id, idx, shift.time);
                                }}
                                className="w-full text-left px-4 py-2.5 text-[12px] font-semibold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B] transition-colors flex items-center gap-3"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                                Edit Shift
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteShift(schedule.id, idx, shift.time);
                                }}
                                className="w-full text-left px-4 py-2.5 text-[12px] font-semibold text-[#475569] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors flex items-center gap-3"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-[#EF4444]" />
                                Delete Shift
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={schedules.length}
        itemsPerPage={itemsPerPage}
        itemName="members"
        onPageChange={onPageChange}
      />
    </div>
  );
}
