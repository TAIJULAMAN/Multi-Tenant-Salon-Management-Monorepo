import React from "react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import TeamDropdown from "./TeamDropdown";
import CustomDatePicker from "../customComponent/CustomDatePicker";

interface AppointmentTableToolbarProps {
  setSearchOpen: (val: boolean) => void;
  selectedSearchMember?: { name: string; phone: string; clientAvatar: string } | null;
  onClearSearch?: () => void;
  dateLabel: string;
  handleNavigate: (dir: number) => void;
  activePeriod: "Month" | "Week" | "Day";
  setActivePeriod: (val: "Month" | "Week" | "Day") => void;
  selectedTeamMembers: string[];
  setSelectedTeamMembers: (members: string[]) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
}

export default function AppointmentTableToolbar({
  setSearchOpen,
  selectedSearchMember,
  onClearSearch,
  dateLabel,
  handleNavigate,
  activePeriod,
  setActivePeriod,
  selectedTeamMembers,
  setSelectedTeamMembers,
  currentDate,
  setCurrentDate,
}: AppointmentTableToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
      <div className="flex items-center gap-2">
        <TeamDropdown
          selected={selectedTeamMembers}
          onChange={setSelectedTeamMembers}
        />
        {selectedSearchMember ? (
          <div className="h-10 flex items-center justify-between gap-2 border border-[#635BFF] bg-[#F4F6FA] rounded-[8px] px-3">
            <span className="text-sm font-manrope font-semibold text-[#635BFF]">
              {selectedSearchMember.name}
            </span>
            <button
              onClick={onClearSearch}
              className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-[#E0E6EB] transition-colors cursor-pointer text-[#635BFF]"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className="w-11 h-10 flex items-center justify-center border border-[#E0E6EB] rounded-[8px] hover:bg-[#F4F6FA] transition-colors cursor-pointer"
          >
            <Search size={18} className="text-[#0A2540]" />
          </button>
        )}
      </div>
      <div className="flex items-center border border-[#E8EEFF] rounded-[12px] overflow-hidden">
        <button
          onClick={() => handleNavigate(-1)}
          className="px-3 sm:px-4 py-2.5 border-r border-[#E8EEFF] hover:bg-[#F4F6FA] transition-colors cursor-pointer"
        >
          <ChevronLeft size={18} className="text-[#635BFF]" />
        </button>
        <div className="relative flex items-center h-full">
          <CustomDatePicker
            value={`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`}
            mode={activePeriod}
            onChange={(val) => {
              if (val) {
                const [y, m, d] = val.split('-');
                const newDate = new Date(currentDate);
                newDate.setFullYear(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
                setCurrentDate(newDate);
              }
            }}
            trigger={
              <span className="px-4 sm:px-6 py-2.5 text-sm font-semibold font-manrope text-[#635BFF] whitespace-nowrap cursor-pointer">
                {dateLabel}
              </span>
            }
          />
        </div>
        <button
          onClick={() => handleNavigate(1)}
          className="px-3 sm:px-4 py-2.5 border-l border-[#E8EEFF] hover:bg-[#F4F6FA] transition-colors cursor-pointer"
        >
          <ChevronRight size={18} className="text-[#635BFF]" />
        </button>
      </div>
      <div className="flex items-center border border-[#E0E6EB] rounded-[8px] overflow-hidden">
        {(["Month", "Week", "Day"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setActivePeriod(p)}
            className={`px-3 sm:px-4 py-2 text-sm font-manrope font-medium transition-colors cursor-pointer ${activePeriod === p
              ? "bg-[#EEEEFF] text-[#635BFF]"
              : "text-[#526B7A] hover:text-[#29343D]"
              }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
