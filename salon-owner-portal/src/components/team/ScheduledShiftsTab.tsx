"use client";

import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  ChevronDown,
  Download
} from "lucide-react";
import CustomSelect from "@/components/customComponent/CustomSelect";
import CustomDatePicker from "@/components/customComponent/CustomDatePicker";
import { CustomTimePicker } from "@/components/customComponent/CustomTimePicker";
import { CustomCheckbox } from "@/components/customComponent/CustomCheckbox";
import Modal from "@/components/customComponent/Modal";
import AddShiftModal from "./AddShiftModal";
import AddClosedPeriodModal from "@/components/saloonOwner/team/AddClosedPeriodModal";

export default function ScheduledShiftsTab() {
  const [isMassEditMode, setIsMassEditMode] = useState(false);
  const [isMassEditModalOpen, setIsMassEditModalOpen] = useState(false);
  const [isAddShiftModalOpen, setIsAddShiftModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("CSV");
  const [openShiftId, setOpenShiftId] = useState<number | null>(null);
  const [massEditStartTime, setMassEditStartTime] = useState("");
  const [massEditEndTime, setMassEditEndTime] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 9, 1)); // October 2024

  // Closed period logic
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const addMenuRef = React.useRef<HTMLDivElement>(null);
  const [isClosedPeriodModalOpen, setIsClosedPeriodModalOpen] = useState(false);
  const [closedPeriods, setClosedPeriods] = useState<{ id: string; startDate: string; endDate: string; reason: string }[]>([
    { id: '1', startDate: '2024-10-15', endDate: '2024-10-16', reason: 'Staff Training' }
  ]);
  const [overriddenClosedDays, setOverriddenClosedDays] = useState<{ dateString: string }[]>([]);
  const [activeClosedDayMenu, setActiveClosedDayMenu] = useState<{ dateString: string; periodId: string } | null>(null);

  const handleSaveClosedPeriod = (startDate: string, endDate: string, reason: string) => {
    const newPeriod = {
      id: Date.now().toString(),
      startDate,
      endDate,
      reason
    };
    setClosedPeriods(prev => [...prev, newPeriod]);
  };

  const generateDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysArray = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const firstDayOfWeek = firstDay.getDay();

    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const date = new Date(prevMonthYear, prevMonth, d);
      daysArray.push({ day: d, isCurrentMonth: false, isHighlighted: false, date, dateString: date.toLocaleDateString('en-CA') });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const today = new Date();
      const date = new Date(year, month, i);
      daysArray.push({
        day: i,
        isCurrentMonth: true,
        isHighlighted: i === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
        date,
        dateString: date.toLocaleDateString('en-CA')
      });
    }

    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    const remaining = 42 - daysArray.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(nextMonthYear, nextMonth, i);
      daysArray.push({ day: i, isCurrentMonth: false, isHighlighted: false, date, dateString: date.toLocaleDateString('en-CA') });
    }

    return daysArray;
  };

  const days = generateDays();


  const shifts = [
    { id: 1, dayIndex: 1, time: "18:00 - 19:00" },
    { id: 2, dayIndex: 1, time: "18:00 - 19:00" },
    { id: 3, dayIndex: 2, time: "10:00 - 19:00" },
    { id: 4, dayIndex: 3, time: "10:00 - 19:00" },
    { id: 5, dayIndex: 3, time: "10:00 - 19:00" },
    { id: 6, dayIndex: 4, time: "18:00 - 19:00" },
    { id: 7, dayIndex: 5, time: "10:00 - 19:00" },
    { id: 8, dayIndex: 5, time: "10:00 - 19:00" },
  ];

  const toggleMassEdit = () => {
    setIsMassEditMode(!isMassEditMode);
  };

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!((e.target as Element).closest('.shift-container'))) {
        setOpenShiftId(null);
      }
      if (addMenuRef.current && !addMenuRef.current.contains(e.target as Node)) {
        setIsAddMenuOpen(false);
      }
      if (!((e.target as Element).closest('.closed-day-container'))) {
        setActiveClosedDayMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-4 sm:p-6">

      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-8">
        <h2 className="text-[18px] font-bold text-[#1E293B]">Scheduled Shifts</h2>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {!isMassEditMode ? (
            <>
              <button
                onClick={toggleMassEdit}
                className="px-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-[13px] font-bold text-[#1E293B] hover:bg-[#F1F5F9] transition-colors"
              >
                Edit Shifts
              </button>
              <div className="relative" ref={addMenuRef}>
                <button
                  onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                  className="bg-[#635BFF] text-white px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-[#524be0] transition-colors flex items-center gap-2"
                >
                  <span className="text-lg leading-none">+</span> Add <ChevronDown className="w-4 h-4 ml-1" />
                </button>
                {isAddMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-[#E2E8F0] py-2 z-20">
                    <button
                      onClick={() => { setIsAddShiftModalOpen(true); setIsAddMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-[13px] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B] transition-colors"
                    >
                      Add Shift
                    </button>
                    <button
                      onClick={() => { setIsClosedPeriodModalOpen(true); setIsAddMenuOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-[13px] text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B] transition-colors"
                    >
                      Business Closed Period
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={toggleMassEdit}
                className="px-4 py-2 bg-white border border-[#635BFF] rounded-lg text-[13px] font-bold text-[#635BFF] hover:bg-[#F8FAFC] transition-colors"
              >
                Continue Editing
              </button>
              <button className="px-4 py-2 bg-[#FFE4E6] rounded-lg text-[13px] font-bold text-[#E11D48] hover:bg-[#FECDD3] transition-colors">
                Mass Deletion
              </button>
              <button
                onClick={() => setIsAddShiftModalOpen(true)}
                className="bg-[#635BFF] text-white px-4 py-2 rounded-lg text-[13px] font-bold hover:bg-[#524be0] transition-colors flex items-center gap-2"
              >
                <span className="text-lg leading-none">+</span> Add Shift
              </button>
            </>
          )}
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0 mb-6">
        <div className="flex items-center gap-4 bg-white border border-[#E2E8F0] rounded-lg p-1 shadow-sm w-full sm:w-auto justify-between sm:justify-start">
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="p-1.5 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[13px] font-bold text-[#635BFF] px-2 uppercase whitespace-nowrap">
            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="p-1.5 text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] rounded-lg transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">

          <button onClick={() => setIsExportModalOpen(true)} className="w-full sm:w-auto justify-center bg-[#EEF2FF] hover:bg-[#E0E7FF] text-[#635BFF] px-4 py-2.5 rounded-lg font-bold text-[13px] flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export Data
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="w-full border border-[#E2E8F0] rounded-lg overflow-x-auto bg-white">
        <div className="min-w-[700px]">
          {/* Days of week header */}
          <div className="grid grid-cols-7 bg-[#F8FAFC] border-b border-[#E2E8F0]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-4 text-center text-[12px] font-bold text-[#64748B]">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 auto-rows-[minmax(120px,_auto)] sm:auto-rows-[minmax(140px,_auto)]">
            {days.map((dayObj, index) => {
              const dayShifts = shifts.filter(s => s.dayIndex === index);

              const activeClosedPeriod = closedPeriods.find(p => {
                const start = new Date(p.startDate);
                start.setHours(0, 0, 0, 0);
                const end = new Date(p.endDate);
                end.setHours(0, 0, 0, 0);
                const cellDate = new Date(dayObj.date);
                cellDate.setHours(0, 0, 0, 0);
                return cellDate >= start && cellDate <= end;
              });

              const isOverridden = overriddenClosedDays.some(d => d.dateString === dayObj.dateString);
              const isClosed = activeClosedPeriod && !isOverridden;

              if (isClosed) {
                return (
                  <div
                    key={index}
                    className={`border-b border-r border-[#E2E8F0] relative flex flex-col p-2 
                    ${(index + 1) % 7 === 0 ? 'border-r-0' : ''} 
                    ${index >= 35 ? 'border-b-0' : ''} 
                    bg-[#F8FAFC] overflow-visible closed-day-container group
                  `}
                  >
                    <div className="text-right text-[12px] font-medium mb-1 text-[#94A3B8]">
                      {dayObj.day}
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveClosedDayMenu(activeClosedDayMenu?.dateString === dayObj.dateString ? null : { dateString: dayObj.dateString, periodId: activeClosedPeriod.id });
                        }}
                        className="w-full py-3 px-3 rounded-lg text-[11px] font-bold transition-colors bg-[#F1F5F9] text-[#94A3B8] hover:bg-[#E2E8F0] hover:text-[#64748B] border border-[#CBD5E1] border-dashed"
                      >
                        Closed
                      </button>

                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full -mt-2 hidden group-hover:block w-48 bg-[#1E293B] text-white text-[11px] font-medium p-2.5 rounded-lg shadow-lg z-[50] before:content-[''] before:absolute before:top-full before:left-1/2 before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-[#1E293B]">
                        <div className="flex items-center gap-1.5 mb-1 text-[#FCD34D]">
                          ⚠️ <span className="font-bold">Business Closed</span>
                        </div>
                        <span className="text-[#CBD5E1]">{activeClosedPeriod.reason || "No reason provided"}</span>
                      </div>

                      {activeClosedDayMenu?.dateString === dayObj.dateString && (
                        <div
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-4 w-[180px] bg-white rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-[#E2E8F0] py-1.5 z-50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOverriddenClosedDays(prev => [...prev, { dateString: dayObj.dateString }]);
                              setActiveClosedDayMenu(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-[12px] font-semibold text-[#475569] hover:bg-[#F8FAFC] hover:text-[#1E293B] transition-colors flex items-center gap-2"
                          >
                            Reactivate day
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setClosedPeriods(prev => prev.filter(p => p.id !== activeClosedPeriod.id));
                              setActiveClosedDayMenu(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-[12px] font-semibold text-[#EF4444] hover:bg-[#FEF2F2] transition-colors flex items-center gap-2"
                          >
                            Reopen business period
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className={`border-b border-r border-[#E2E8F0] relative flex flex-col p-2 
                  ${(index + 1) % 7 === 0 ? 'border-r-0' : ''} 
                  ${index >= 35 ? 'border-b-0' : ''} 
                  ${dayObj.isHighlighted ? 'bg-[#F1F5F9]' : 'bg-white'}
                `}
                >
                  <div className={`text-right text-[12px] font-medium mb-1 ${dayObj.isCurrentMonth ? 'text-[#94A3B8]' : 'text-[#CBD5E1]'}`}>
                    {dayObj.day}
                  </div>

                  <div className="flex-1 flex flex-col gap-1.5">
                    {dayShifts.map(shift => (
                      <div
                        key={shift.id}
                        className="relative group shift-container"
                        onClick={() => !isMassEditMode && setOpenShiftId(openShiftId === shift.id ? null : shift.id)}
                      >
                        <div className="bg-[#E0E7FF] text-[#635BFF] rounded-lg px-2 py-1.5 text-[11px] font-bold flex items-center justify-center text-center cursor-pointer hover:bg-[#C7D2FE] transition-colors relative">
                          {isMassEditMode && (
                            <input
                              type="checkbox"
                              className="absolute left-2 w-3 h-3 rounded border-[#635BFF] text-[#635BFF] focus:ring-[#635BFF]"
                              defaultChecked={index === 1} // Mock check for first couple to match design
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                          {shift.time}
                        </div>

                        {/* Popover on click (Normal Mode) */}
                        {!isMassEditMode && openShiftId === shift.id && (
                          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[120px] bg-white rounded-lg shadow-lg border border-[#E2E8F0] py-1 z-50" onClick={(e) => e.stopPropagation()}>
                            <button className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#06B6D4] transition-colors">
                              <Edit2 className="w-3 h-3 text-[#06B6D4]" /> Edit Shift
                            </button>
                            <button className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-medium text-[#64748B] hover:bg-[#FFF1F2] hover:text-[#EF4444] transition-colors">
                              <Trash2 className="w-3 h-3 text-[#FCA5A5]" /> Delete Shift
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    {dayShifts.length > 0 && (
                      <div className="text-center text-[10px] text-[#94A3B8] font-medium mt-1">
                        Total: <span className="text-[#1E293B] font-bold">10h</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mass Editing Modal */}
      <Modal isOpen={isMassEditModalOpen} onClose={() => setIsMassEditModalOpen(false)} title="Mass Editing" maxWidth="max-w-[500px]">
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-lg border border-[#E2E8F0] p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-end gap-3 mb-4">
              <div className="w-full sm:flex-1">
                <CustomSelect
                  label="Start Time *"
                  value={massEditStartTime}
                  onChange={setMassEditStartTime}
                  options={["09:00", "09:30", "10:00"]}
                  placeholder="Select time"
                />
              </div>
              <div className="w-full sm:flex-1">
                <CustomSelect
                  label="End Time *"
                  value={massEditEndTime}
                  onChange={setMassEditEndTime}
                  options={["17:00", "17:30", "18:00"]}
                  placeholder="Select time"
                />
              </div>
              <button className="p-2.5 rounded-lg border border-[#FCA5A5] text-[#EF4444] hover:bg-[#FEE2E2] transition-colors sm:mb-0.5 w-full sm:w-auto flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <button className="text-[#635BFF] text-[13px] font-bold hover:underline">
              Add a Shift
            </button>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsMassEditModalOpen(false)}
              className="bg-[#635BFF] text-white text-[14px] font-bold px-8 py-2.5 rounded-lg hover:bg-[#4F46E5] transition-colors shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} title="Export Data" maxWidth="max-w-[400px]">
        <div className="flex flex-col gap-5 pt-2">
          <div>
            <CustomSelect
              label="Format"
              value={exportFormat}
              onChange={setExportFormat}
              options={["CSV", "PDF", "Excel"]}
            />
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setIsExportModalOpen(false)}
              className="bg-[#635BFF] text-white text-[14px] font-bold px-8 py-2.5 rounded-lg hover:bg-[#4F46E5] transition-colors shadow-sm"
            >
              Download
            </button>
          </div>
        </div>
      </Modal>

      <AddShiftModal
        isOpen={isAddShiftModalOpen}
        onClose={() => setIsAddShiftModalOpen(false)}
      />

      <AddClosedPeriodModal
        isOpen={isClosedPeriodModalOpen}
        onClose={() => setIsClosedPeriodModalOpen(false)}
        onSave={handleSaveClosedPeriod}
      />
    </div>
  );
}
