import React, { useRef, useEffect } from "react";
import { Users, Zap, Calendar } from "lucide-react";
import CustomSearch from "@/components/customComponent/CustomSearch";
import { CalendarRangePicker } from "./CalendarRangePicker";

interface MediaFilterBarProps {
  search: string;
  setSearch: (val: string) => void;
  selectedClients: string[];
  selectedServices: string[];
  fromDate: string;
  toDate: string;
  setFromDate: (val: string) => void;
  setToDate: (val: string) => void;
  setActiveModal: (modal: "clients" | "services" | null) => void;
  setClientSearch: (val: string) => void;
  setServiceSearch: (val: string) => void;
  clearFilters: () => void;
  showDatePicker: boolean;
  setShowDatePicker: React.Dispatch<React.SetStateAction<boolean>>;
}

export function MediaFilterBar({
  search,
  setSearch,
  selectedClients,
  selectedServices,
  fromDate,
  toDate,
  setFromDate,
  setToDate,
  setActiveModal,
  setClientSearch,
  setServiceSearch,
  clearFilters,
  showDatePicker,
  setShowDatePicker
}: MediaFilterBarProps) {
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(e.target as Node)) {
        setShowDatePicker(false);
      }
    };
    if (showDatePicker) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showDatePicker, setShowDatePicker]);

  const dateLabel = fromDate || toDate
    ? `${fromDate || "..."} → ${toDate || "..."}`
    : "Select Date Range";

  return (
    <div className="bg-white rounded-xl">
      <h4 className="px-6 pt-6 pb-3 text-lg font-bold text-[#29343D] font-manrope">
        Media Library
      </h4>

      <div className="px-6 pb-4">
        <CustomSearch
          value={search}
          onChange={setSearch}
          placeholder="Search by name, ID, files, service, date, or description..."
          className="w-full bg-white border border-[#E0E6EB] rounded-lg text-sm"
        />
      </div>

      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between px-6 pb-6 gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full">
          <button
            onClick={() => { setClientSearch(""); setActiveModal("clients"); }}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#E0E6EB] rounded-lg text-sm font-semibold text-[#29343D] bg-white cursor-pointer"
          >
            <Users size={16} className="text-gray-400" /> {selectedClients.length} Clients
          </button>

          <button
            onClick={() => { setServiceSearch(""); setActiveModal("services"); }}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#E0E6EB] rounded-lg text-sm font-semibold text-[#29343D] bg-white cursor-pointer"
          >
            <Zap size={16} className="text-gray-400" /> {selectedServices.length} Services
          </button>

          <div className="relative" ref={datePickerRef}>
            <button
              onClick={() => setShowDatePicker(v => !v)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg text-sm font-semibold bg-white transition-colors cursor-pointer
                                    ${showDatePicker || fromDate || toDate
                  ? "border-[#635BFF] text-[#635BFF]"
                  : "border-[#E0E6EB] text-[#29343D]"
                }`}
            >
              <Calendar size={16} className="text-[#635BFF]" />
              {dateLabel}
            </button>

            {showDatePicker && (
              <CalendarRangePicker
                fromDate={fromDate}
                toDate={toDate}
                onFromChange={setFromDate}
                onToChange={setToDate}
                onDone={() => setShowDatePicker(false)}
                onClear={() => { setFromDate(""); setToDate(""); }}
              />
            )}
          </div>

          <button onClick={clearFilters} className="text-[#FF6692] text-sm font-bold border border-[#E0E6EB] px-4 py-2.5 rounded-lg cursor-pointer">
            Clear All Filters
          </button>
        </div>
      </div>
    </div>
  );
}
