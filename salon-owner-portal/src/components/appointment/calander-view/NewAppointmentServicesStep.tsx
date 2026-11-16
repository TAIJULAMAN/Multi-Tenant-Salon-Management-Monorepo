"use client";

import React from "react";
import { Search } from "lucide-react";
import CustomTimePicker from "./CustomTimePicker";
import CustomSelect from "@/components/customComponent/CustomSelect";
import { DUMMY_SERVICES } from "@/components/appointment/data";
import { BookingOrderItem } from "@/components/appointment/types";

interface NewAppointmentServicesStepProps {
  serviceSearch: string;
  setServiceSearch: (s: string) => void;
  selectedServiceIds: string[];
  handleServiceToggle: (id: string) => void;
  formattedTotalDuration: string;
  bookingOrder: BookingOrderItem[];
  updateServiceTime: (
    serviceId: string,
    field: "startTime" | "endTime",
    value: string,
  ) => void;
  updateServiceEmployee: (serviceId: string, empId: string) => void;
  teamMembers: { id: string; name: string; avatar: string }[];
}

export default function NewAppointmentServicesStep({
  serviceSearch,
  setServiceSearch,
  selectedServiceIds,
  handleServiceToggle,
  formattedTotalDuration,
  bookingOrder,
  updateServiceTime,
  updateServiceEmployee,
  teamMembers,
}: NewAppointmentServicesStepProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <section className="space-y-3">
        <label className="text-[12px] font-bold text-[#999]">Services *</label>
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999]"
            size={18}
          />
          <input
            type="text"
            placeholder="Search"
            value={serviceSearch}
            onChange={(e) => setServiceSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-[8px] text-[15px] text-[#29343D] outline-none focus:border-[#635BFF] transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto custom-scrollbar pr-2">
          {DUMMY_SERVICES.filter((s) =>
            s.name.toLowerCase().includes(serviceSearch.toLowerCase()),
          ).map((s) => {
            const isSelected = selectedServiceIds.includes(s.id);
            return (
              <div
                key={s.id}
                onClick={() => handleServiceToggle(s.id)}
                className={`flex items-center justify-between p-4 border rounded-[8px] cursor-pointer transition-colors ${
                  isSelected
                    ? "border-[#635BFF] bg-indigo-50/10"
                    : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-[4px] border flex flex-none items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-[#635BFF] border-[#635BFF]"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isSelected && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#29343D]">
                      {s.name}
                    </p>
                    <p className="text-[11px] text-[#999]">{s.duration}</p>
                  </div>
                </div>
                <span className="text-[14px] font-bold text-[#29343D]">
                  {s.price}
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-[13px] font-bold text-[#29343D] pt-2">
          Total duration:{" "}
          <span className="font-extrabold">{formattedTotalDuration}</span>
        </p>
      </section>

      {/* Appointment Time Editor */}
      {bookingOrder.length > 0 && (
        <section className="space-y-3">
          <label className="text-[12px] font-bold text-[#999]">
            Appointment Timeline
          </label>
          <div className="bg-slate-50 border border-slate-200 rounded-[12px] p-4 space-y-3">
            {bookingOrder.map((item, idx) => {
              const srv = DUMMY_SERVICES.find((s) => s.id === item.serviceId);
              return (
                <div
                  key={item.serviceId}
                  className="flex items-center justify-between gap-4"
                >
                  <p className="text-[13px] font-bold text-[#29343D] truncate max-w-[150px]">
                    {idx + 1}. {srv?.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <CustomTimePicker
                      value={item.startTime || "23:17"}
                      onChange={(val) =>
                        updateServiceTime(item.serviceId, "startTime", val)
                      }
                    />
                    <span className="text-[12px] text-[#999] font-bold">-</span>
                    <CustomTimePicker
                      value={item.endTime || "23:47"}
                      onChange={(val) =>
                        updateServiceTime(item.serviceId, "endTime", val)
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Booking Order Timeline */}
      {bookingOrder.length > 0 && (
        <section className="space-y-6">
          <label className="text-[12px] font-bold text-[#999]">
            Booking Order
          </label>
          <div className="bg-[#F8FAFC] p-6 sm:p-8 rounded-[12px] border border-slate-200 overflow-x-auto custom-scrollbar">
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-start gap-8 sm:gap-4 relative z-10 sm:min-w-max pb-2">
              {/* Connecting Line - ONLY IF MORE THAN 1 ORDER */}
              {bookingOrder.length > 1 && (
                <div
                  className="hidden sm:block absolute top-[18px] left-[70px] h-[2px] bg-slate-200 z-0"
                  style={{ width: `${(bookingOrder.length - 1) * 156}px` }}
                />
              )}

              {bookingOrder.map((item, index) => {
                const srv = DUMMY_SERVICES.find((s) => s.id === item.serviceId);
                return (
                  <div
                    key={item.serviceId}
                    className="flex flex-col items-center text-center w-full sm:w-[140px] flex-shrink-0 space-y-2 relative z-10"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#29343D] text-white flex items-center justify-center text-[15px] font-bold shadow-sm">
                      {index + 1}
                    </div>
                    <span className="bg-[#635BFF]/10 text-[#635BFF] text-[10px] font-extrabold px-2 py-0.5 rounded-[4px] uppercase tracking-wider">
                      To Do
                    </span>
                    <div className="space-y-0.5">
                      <p className="text-[11px] text-[#999] font-bold">
                        {item.startTime || "23:17"} - {item.endTime || "23:47"}
                      </p>
                      <p className="text-[13px] font-bold text-[#29343D] leading-tight px-1">
                        {srv?.name}
                      </p>
                    </div>
                    <CustomSelect
                      value={
                        teamMembers.find((m) => m.id === item.employeeId)
                          ?.name || "Select Employee"
                      }
                      options={teamMembers.map((m) => ({
                        label: m.name,
                        value: m.name,
                        icon: m.avatar,
                      }))}
                      onChange={(val) => {
                        const selected = teamMembers.find(
                          (m) => m.name === val,
                        );
                        if (selected) {
                          updateServiceEmployee(item.serviceId, selected.id);
                        }
                      }}
                      buttonClassName="whitespace-nowrap mt-1 w-full flex items-center justify-between text-[12px] font-bold text-[#29343D] bg-white border border-slate-200 rounded-[12px] px-3 py-1 outline-none cursor-pointer hover:border-[#635BFF]"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
