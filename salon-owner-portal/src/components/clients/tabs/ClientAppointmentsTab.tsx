"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import CustomDateRangePickerWithPresets from "@/components/customComponent/CustomDateRangePickerWithPresets";
import {
  mockAppointments,
  mockAppointmentServices,
  APPOINTMENT_STATUS_OPTIONS as statusOptions,
} from "@/components/clients/data";

interface ClientAppointmentsTabProps {
  clientName: string;
}

export default function ClientAppointmentsTab({
  clientName,
}: ClientAppointmentsTabProps) {
  const [minSpent, setMinSpent] = useState(0);
  const [maxSpent, setMaxSpent] = useState(200);
  const maxPossibleSpent = 500;

  const [selectedDateFilter, setSelectedDateFilter] = useState("Last 7 days");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isCustomRangeModalOpen, setIsCustomRangeModalOpen] = useState(false);

  const [expandedAppointment, setExpandedAppointment] = useState<number | null>(
    0,
  );
  const [isServicesModalOpen, setIsServicesModalOpen] = useState(false);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), maxSpent - 1);
    setMinSpent(value);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.max(Number(e.target.value), minSpent + 1);
    setMaxSpent(value);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h2 className="text-[1.35rem] font-bold text-[#1E293B] font-manrope">
          Appointments
        </h2>

        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 w-full md:w-auto">
          {/* Amount Spent Functional Slider */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-3 w-full sm:w-auto">
            <span className="text-[14px] font-medium text-[#64748B] whitespace-nowrap mb-1 sm:mb-2.5">
              Amount Spent
            </span>
            <div className="flex flex-col w-full sm:w-[170px]">
              {/* Slider Track */}
              <div className="px-2 mb-3 relative">
                <div className="relative h-[7px] bg-[#E0E7FF] rounded-full w-full">
                  <div
                    className="absolute h-full bg-[#635BFF] rounded-full"
                    style={{
                      left: `${(minSpent / maxPossibleSpent) * 100}%`,
                      right: `${100 - (maxSpent / maxPossibleSpent) * 100}%`,
                    }}
                  ></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxPossibleSpent}
                  value={minSpent}
                  onChange={handleMinChange}
                  className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[7px] pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#635BFF] z-10"
                />
                <input
                  type="range"
                  min="0"
                  max={maxPossibleSpent}
                  value={maxSpent}
                  onChange={handleMaxChange}
                  className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-[7px] pointer-events-none appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#635BFF] z-20"
                />
              </div>
              {/* Inputs */}
              <div className="flex items-center justify-between gap-2">
                <input
                  type="number"
                  value={minSpent}
                  onChange={handleMinChange}
                  className="bg-white border border-[#E2E8F0] rounded-[8px] px-2 py-1.5 text-[14px] font-medium text-[#94A3B8] w-20 text-center outline-none focus:border-[#635BFF] transition-colors"
                />
                <span className="text-[#1E293B] font-medium">-</span>
                <input
                  type="number"
                  value={maxSpent}
                  onChange={handleMaxChange}
                  className="bg-white border border-[#E2E8F0] rounded-[8px] px-2 py-1.5 text-[14px] font-medium text-[#94A3B8] w-20 text-center outline-none focus:border-[#635BFF] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Date Filter with presets & calendar */}
          <div className="relative w-full sm:w-auto">
            <CustomDateRangePickerWithPresets
              value={selectedDateFilter}
              onChange={(val) => setSelectedDateFilter(val)}
              presets={[
                "Last 7 days",
                "Last 14 days",
                "Last Month",
                "Last 3 Months",
                "Last Year",
              ]}
            />
          </div>

          {/* Status Dropdown */}
          <div className="relative w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                setIsStatusDropdownOpen(!isStatusDropdownOpen);
                setIsDateDropdownOpen(false);
              }}
              className="flex items-center justify-between gap-3 bg-white border border-[#E2E8F0] rounded-lg px-4 py-2.5 text-[15px] text-[#334155] shadow-sm hover:border-[#CBD5E1] transition-colors w-full sm:min-w-[120px] cursor-pointer"
            >
              <span>{selectedStatusFilter}</span>
              <ChevronDown
                className="w-5 h-5 text-[#334155]"
                strokeWidth={2.5}
              />
            </button>
            {isStatusDropdownOpen && (
              <div className="absolute top-full right-0 md:left-0 md:right-auto mt-2 w-[160px] bg-white border border-[#F1F5F9] rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {statusOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setSelectedStatusFilter(opt);
                      setIsStatusDropdownOpen(false);
                    }}
                    className="w-full text-left px-5 py-2.5 text-[16px] text-[#334155] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(isDateDropdownOpen || isStatusDropdownOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsDateDropdownOpen(false);
            setIsStatusDropdownOpen(false);
          }}
        />
      )}

      {/* Appointments List */}
      <div className="space-y-3">
        {mockAppointments.map((apt, index) => {
          const isExpanded = expandedAppointment === index;
          return (
            <div
              key={index}
              className="bg-[#F8FAFC] rounded-lg border border-[#F1F5F9] overflow-hidden transition-all duration-300"
            >
              <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedAppointment(isExpanded ? null : index)
                    }
                    className="p-1 text-[#94A3B8] hover:text-[#635BFF] transition-colors cursor-pointer"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                  <div className="bg-[#635BFF] text-white rounded-lg p-2 text-center w-14 h-14 flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[10px] font-bold uppercase leading-tight">
                      {apt.dateLine1}
                    </span>
                    <span className="text-[12px] font-bold leading-tight">
                      {apt.dateLine2}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-[14px] font-bold text-[#1E293B]">
                        {apt.title}
                      </h4>
                      <span
                        className={`${apt.statusColor} text-[10px] font-bold px-2.5 py-1 rounded-[6px] border inline-flex items-center`}
                      >
                        {apt.status}
                      </span>
                    </div>
                    <div className="text-[11px] font-medium text-[#64748B] flex items-center gap-1">
                      {apt.details} •
                      <button
                        type="button"
                        onClick={() => setIsServicesModalOpen(true)}
                        className="text-[#635BFF] hover:underline font-bold cursor-pointer"
                      >
                        List of Services
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-[#F1F5F9] pt-4 sm:pt-0 mt-4 sm:mt-0">
                  <div className="text-left sm:text-right">
                    <div className="text-[15px] font-bold text-[#1E293B]">
                      {apt.price}
                    </div>
                    <div className="text-[11px] text-[#94A3B8] font-medium">
                      {apt.priceStatus}
                    </div>
                  </div>
                  {["Completed", "Canceled", "No-show"].includes(apt.status) ? (
                    <button
                      disabled
                      className="bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed px-4 py-2 rounded-lg text-[12px] font-bold transition-colors select-none"
                      title={`Appointment is ${apt.status}`}
                    >
                      Checkout
                    </button>
                  ) : (
                    <Link
                      href={`/dashboard/checkout?clientName=${encodeURIComponent(clientName)}&serviceName=${encodeURIComponent(apt.title)}&servicePrice=170`}
                      className="bg-[#EEF2FF] text-[#635BFF] hover:bg-[#E0E7FF] px-4 py-2 rounded-lg text-[12px] font-bold transition-colors shadow-sm inline-block"
                    >
                      Checkout
                    </Link>
                  )}
                </div>
              </div>

              {/* Expanded Booking Order UI */}
              {isExpanded && (
                <div className="border-t border-[#F1F5F9] bg-[#F8FAFC] p-6 pb-10 animate-in slide-in-from-top-2 duration-300 rounded-b-xl">
                  <h5 className="text-[13px] font-semibold text-[#334155] text-center mb-8">
                    Booking Order
                  </h5>

                  <div className="flex items-start justify-center max-w-sm mx-auto relative">
                    {/* Connecting Line */}
                    <div className="absolute top-[14px] left-[16.66%] right-[16.66%] h-[1.5px] bg-[#E2E8F0] z-0"></div>

                    {/* Step 1 */}
                    <div className="flex flex-col items-center flex-1 relative z-10">
                      <div className="w-[30px] h-[30px] rounded-full bg-[#FFFBEB] text-[#FBBF24] flex items-center justify-center text-[13px] font-medium mb-3 shadow-[0_0_0_4px_#F8FAFC]">
                        1
                      </div>
                      <div className="bg-[#FFFBEB] text-[#FBBF24] text-[11px] font-medium px-3.5 py-1 rounded-[10px] mb-3">
                        Overdue
                      </div>
                      <div className="text-[10px] text-[#94A3B8] font-medium mb-1">
                        12:00-12:05
                      </div>
                      <div className="text-[12px] font-semibold text-[#334155]">
                        Shampoo
                      </div>
                      <div className="text-[11px] text-[#94A3B8] font-medium">
                        Angelica
                      </div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center flex-1 relative z-10">
                      <div className="w-[30px] h-[30px] rounded-full bg-[#94A3B8] text-white flex items-center justify-center text-[13px] font-medium mb-3 shadow-[0_0_0_4px_#F8FAFC]">
                        2
                      </div>
                      <div className="bg-[#F1F5F9] text-[#475569] text-[11px] font-medium px-4 py-1 rounded-[10px] mb-3">
                        To Do
                      </div>
                      <div className="text-[10px] text-[#94A3B8] font-medium mb-1">
                        12:00-12:05
                      </div>
                      <div className="text-[12px] font-semibold text-[#334155]">
                        Shampoo
                      </div>
                      <div className="text-[11px] text-[#94A3B8] font-medium">
                        Angelica
                      </div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center flex-1 relative z-10">
                      <div className="w-[30px] h-[30px] rounded-full bg-[#94A3B8] text-white flex items-center justify-center text-[13px] font-medium mb-3 shadow-[0_0_0_4px_#F8FAFC]">
                        3
                      </div>
                      <div className="bg-[#F1F5F9] text-[#475569] text-[11px] font-medium px-4 py-1 rounded-[10px] mb-3">
                        To Do
                      </div>
                      <div className="text-[10px] text-[#94A3B8] font-medium mb-1">
                        12:00-12:05
                      </div>
                      <div className="text-[12px] font-semibold text-[#334155]">
                        Shampoo
                      </div>
                      <div className="text-[11px] text-[#94A3B8] font-medium">
                        Angelica
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* List of Services Modal */}
      {isServicesModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-lg w-full max-w-[500px] p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[1.1rem] font-bold text-[#1E293B] font-manrope">
                List of Services
              </h3>
              <button
                type="button"
                onClick={() => setIsServicesModalOpen(false)}
                className="text-[#94A3B8] hover:text-[#1E293B] hover:bg-[#F1F5F9] p-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {mockAppointmentServices.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-[#F8FAFC] rounded-lg border border-[#F1F5F9]"
                >
                  <div>
                    <div className="text-[14px] font-bold text-[#1E293B] mb-0.5">
                      {service.title}
                    </div>
                    <div className="text-[12px] font-medium text-[#94A3B8]">
                      {service.time} • {service.staff}
                    </div>
                  </div>
                  <div className="text-[14px] font-bold text-[#1E293B]">
                    {service.price}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Custom Range Date Picker Modal */}
      {isCustomRangeModalOpen && (
        <div
          className="fixed inset-0 bg-[#0F172A]/20 z-50 flex items-center justify-center p-4 backdrop-blur-[1px] animate-in fade-in duration-200"
          onClick={() => setIsCustomRangeModalOpen(false)}
        >
          <div
            className="bg-white rounded-[24px] w-full max-w-[800px] max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 duration-300 border border-[#F1F5F9] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8 px-2">
              <button
                type="button"
                className="w-[36px] h-[36px] rounded-full border border-[#E0E7FF] flex items-center justify-center text-[#A5B4FC] hover:bg-[#EEF2FF] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 flex justify-center text-[17px] font-bold text-[#334155] tracking-wide">
                June 2024
              </div>
              <div className="flex-1 flex justify-center text-[17px] font-bold text-[#334155] tracking-wide">
                July 2024
              </div>
              <button
                type="button"
                className="w-[36px] h-[36px] rounded-full border border-[#E0E7FF] flex items-center justify-center text-[#A5B4FC] hover:bg-[#EEF2FF] transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 md:gap-10">
              {/* June */}
              <div className="flex-1">
                <div className="grid grid-cols-7 mb-5">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-[13px] font-medium text-[#94A3B8]"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-2">
                  {[
                    2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                    18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
                  ].map((date) => {
                    const isSelected = date >= 4 && date <= 8;
                    return (
                      <div
                        key={date}
                        className="flex justify-center items-center h-12"
                      >
                        <button
                          type="button"
                          className={`w-[42px] h-[42px] flex items-center justify-center rounded-full text-[16px] transition-colors cursor-pointer ${isSelected ? "bg-[#635BFF] text-white font-medium shadow-sm" : "text-[#334155] hover:bg-[#F1F5F9]"}`}
                        >
                          {date}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* July */}
              <div className="flex-1">
                <div className="grid grid-cols-7 mb-5">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div
                      key={day}
                      className="text-center text-[13px] font-medium text-[#94A3B8]"
                    >
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-y-2">
                  {[
                    2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                    18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
                  ].map((date) => {
                    return (
                      <div
                        key={date}
                        className="flex justify-center items-center h-12"
                      >
                        <button
                          type="button"
                          className="w-[42px] h-[42px] flex items-center justify-center rounded-full text-[16px] text-[#334155] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
                        >
                          {date}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
