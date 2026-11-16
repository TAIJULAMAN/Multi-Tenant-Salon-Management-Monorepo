import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WeekNavigatorProps {
  currentWeekStart: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export default function WeekNavigator({ currentWeekStart, onPrevWeek, onNextWeek }: WeekNavigatorProps) {
  const fullMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  const formatHeaderDateRange = () => {
    const startMonth = fullMonthNames[currentWeekStart.getMonth()];
    const startDay = currentWeekStart.getDate();
    const endMonth = fullMonthNames[weekEnd.getMonth()];
    const endDay = weekEnd.getDate();

    return `${startMonth} ${startDay} – ${endMonth} ${endDay}`;
  };

  return (
    <div className="inline-flex items-center bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-1.5">
      <button onClick={onPrevWeek} className="p-2 text-[#64748B] hover:text-[#635BFF] hover:bg-[#F1F5F9] rounded-lg transition-colors">
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="px-6 text-[13px] font-bold text-[#635BFF]">
        {formatHeaderDateRange()}
      </span>
      <button onClick={onNextWeek} className="p-2 text-[#64748B] hover:text-[#635BFF] hover:bg-[#F1F5F9] rounded-lg transition-colors">
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
