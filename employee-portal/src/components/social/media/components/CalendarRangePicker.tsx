import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

interface CalendarRangePickerProps {
  fromDate: string;
  toDate: string;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
  onDone: () => void;
  onClear: () => void;
}

export function CalendarRangePicker({ fromDate, toDate, onFromChange, onToChange, onDone, onClear }: CalendarRangePickerProps) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [hovered, setHovered] = useState<string | null>(null);

  const toYMD = (d: Date) => d.toISOString().split("T")[0];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const handleDayClick = (ymd: string) => {
    if (!fromDate || (fromDate && toDate)) {
      onFromChange(ymd);
      onToChange("");
    } else {
      if (ymd < fromDate) {
        onToChange(fromDate);
        onFromChange(ymd);
      } else {
        onToChange(ymd);
      }
    }
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: (string | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) =>
      toYMD(new Date(viewYear, viewMonth, i + 1))
    ),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const activeEnd = toDate || hovered || null;

  const isRangeEdge = (ymd: string) => {
    if (!fromDate || !activeEnd) return false;
    const lo = fromDate <= activeEnd ? fromDate : activeEnd;
    const hi = fromDate <= activeEnd ? activeEnd : fromDate;
    return ymd === lo || ymd === hi;
  };
  const isInRange = (ymd: string) => {
    if (!fromDate || !activeEnd) return false;
    const lo = fromDate <= activeEnd ? fromDate : activeEnd;
    const hi = fromDate <= activeEnd ? activeEnd : fromDate;
    return ymd > lo && ymd < hi;
  };
  const isLoEdge = (ymd: string) => {
    if (!fromDate || !activeEnd) return false;
    return ymd === (fromDate <= activeEnd ? fromDate : activeEnd);
  };
  const isHiEdge = (ymd: string) => {
    if (!fromDate || !activeEnd) return false;
    return ymd === (fromDate <= activeEnd ? activeEnd : fromDate);
  };

  const fmt = (ymd: string) => {
    if (!ymd) return "—";
    const [y, m, d] = ymd.split("-");
    return `${MONTHS[parseInt(m) - 1].slice(0, 3)} ${parseInt(d)}, ${y}`;
  };

  return (
    <div
      className="absolute right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-[#E0E6EB]"
      style={{ width: 320 }}
    >
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft size={15} className="text-[#29343D]" />
        </button>
        <span className="text-sm font-bold text-[#0A2540]">
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight size={15} className="text-[#29343D]" />
        </button>
      </div>

      <div className="grid grid-cols-7 px-4 pb-1">
        {DAY_LABELS.map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 px-4 pb-3">
        {cells.map((ymd, idx) => {
          if (!ymd) return <div key={`empty-${idx}`} style={{ height: 36 }} />;

          const edge = isRangeEdge(ymd);
          const inRange = isInRange(ymd);
          const loEdge = isLoEdge(ymd);
          const hiEdge = isHiEdge(ymd);
          const singleSelected = fromDate === ymd && !activeEnd;

          return (
            <div
              key={ymd}
              onClick={() => handleDayClick(ymd)}
              onMouseEnter={() => { if (fromDate && !toDate) setHovered(ymd); }}
              onMouseLeave={() => setHovered(null)}
              className="relative flex items-center justify-center cursor-pointer"
              style={{ height: 36 }}
            >
              {inRange && <div className="absolute inset-0 bg-[#635BFF]/10" />}
              {loEdge && activeEnd && fromDate !== activeEnd && (
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#635BFF]/10" />
              )}
              {hiEdge && activeEnd && fromDate !== activeEnd && (
                <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#635BFF]/10" />
              )}
              <div
                className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full text-[13px] font-semibold transition-all select-none
                                    ${edge || singleSelected
                    ? "bg-[#635BFF] text-white"
                    : inRange
                      ? "text-[#635BFF]"
                      : "text-[#29343D] hover:bg-gray-100"
                  }`}
              >
                {parseInt(ymd.split("-")[2])}
              </div>
            </div>
          );
        })}
      </div>

      {(fromDate || toDate) && (
        <div className="mx-4 mb-3 flex items-center gap-2 px-3 py-2.5 bg-[#F4F4FF] rounded-xl">
          <div className="flex-1 text-center">
            <p className="text-[9px] font-bold text-[#635BFF] uppercase tracking-wider mb-0.5">From</p>
            <p className="text-[11px] font-semibold text-[#0A2540]">{fmt(fromDate)}</p>
          </div>
          <ChevronRight size={12} className="text-[#635BFF] shrink-0" />
          <div className="flex-1 text-center">
            <p className="text-[9px] font-bold text-[#635BFF] uppercase tracking-wider mb-0.5">To</p>
            <p className="text-[11px] font-semibold text-[#0A2540]">{fmt(toDate)}</p>
          </div>
        </div>
      )}

      <div className="flex gap-2 px-4 pb-4">
        <button
          onClick={onClear}
          style={{ width: "35%" }}
          className="py-2.5 text-sm font-bold text-[#FF6692] border border-[#FFD0DD] rounded-xl hover:bg-[#FFF0F4] transition-colors"
        >
          Clear
        </button>
        <button
          onClick={onDone}
          style={{ width: "65%" }}
          className="py-2.5 text-sm font-bold text-white bg-[#635BFF] rounded-xl hover:opacity-90 transition-opacity"
        >
          Done
        </button>
      </div>
    </div>
  );
}
