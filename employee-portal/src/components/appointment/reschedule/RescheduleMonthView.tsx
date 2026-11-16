"use client";

import React, { useState } from "react";
import Image from "next/image";
import CustomCloseButton from "@/components/customComponent/CustomCloseButton";
import {
  Service,
  StaffMember,
  ScheduledAppointment,
  formatDateKey,
  formatSlotTime,
} from "./utils";

interface RescheduleMonthViewProps {
  STAFF: StaffMember[];
  SERVICES: Service[];
  appointments: ScheduledAppointment[];
  hoverCell: { sid: string; idx: number } | null;
  onOver: (e: React.DragEvent, sid: string, idx: number) => void;
  onDragEnter?: (e: React.DragEvent, sid: string, idx: number) => void;
  onDrop: (
    e: React.DragEvent,
    sid: string,
    idx: number,
    dateStr?: string
  ) => void;
  removeAppt: (idOrIndex: string | number) => void;
  currentDate: Date;
  selectedTeamIds: string[];
  selectedService?: Service | null;
  onPlaceSelectedService?: (
    staffId: string,
    slotIdx: number,
    dateStr: string
  ) => void;
  isDragging?: boolean;
}

export default function RescheduleMonthView({
  STAFF,
  SERVICES,
  appointments,
  hoverCell,
  onOver,
  onDragEnter,
  onDrop,
  removeAppt,
  currentDate,
  selectedTeamIds,
  selectedService,
  onPlaceSelectedService,
  isDragging,
}: RescheduleMonthViewProps) {
  // "all" or specific staff ID
  const [activeStaffId, setActiveStaffId] = useState<string>("all");

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null); // Empty padding cells
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const monthDays = getMonthDays(currentDate);
  const targetDropStaffId =
    activeStaffId === "all" ? STAFF[0]?.id || "1" : activeStaffId;

  const handleDragEnter = (e: React.DragEvent, sid: string, idx: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDragEnter) {
      onDragEnter(e, sid, idx);
    } else {
      onOver(e, sid, idx);
    }
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-white">
      {/* Staff switcher strip */}
      {STAFF.length > 1 && (
        <div className="shrink-0 flex items-center justify-between px-4 py-2 bg-[#FAFBFF] border-b border-[#E8EDF5] text-xs">
          <span className="font-semibold font-manrope text-[#526B7A]">
            Staff Filter:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveStaffId("all")}
              className={`px-3 py-1 rounded-full text-xs font-semibold font-manrope transition-all cursor-pointer ${
                activeStaffId === "all"
                  ? "bg-[#635BFF] text-white shadow-sm"
                  : "bg-white text-[#526B7A] border border-[#E0E6EB] hover:bg-[#F4F6FA]"
              }`}
            >
              All Staff
            </button>
            {STAFF.map((staff) => {
              const isSelected = staff.id === activeStaffId;
              return (
                <button
                  key={staff.id}
                  type="button"
                  onClick={() => setActiveStaffId(staff.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-manrope transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#635BFF] text-white shadow-sm"
                      : "bg-white text-[#526B7A] border border-[#E0E6EB] hover:bg-[#F4F6FA]"
                  }`}
                >
                  <div className="relative w-4 h-4 rounded-full overflow-hidden shrink-0">
                    <Image
                      src={staff.avatar}
                      alt={staff.name}
                      fill
                      sizes="16px"
                      className="object-cover"
                    />
                  </div>
                  <span>{staff.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Month Days Header */}
      <div className="shrink-0 border-b border-[#E0E6EB] bg-[#F3F3FF] px-4 py-3 select-none">
        <div className="grid grid-cols-7 w-full text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-xs font-bold font-manrope text-[#29343D]"
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-auto bg-[#F7F9FC] p-3">
        <div className="grid grid-cols-7 gap-2 min-h-full auto-rows-[minmax(110px,1fr)]">
          {monthDays.map((day, idx) => {
            if (!day) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="bg-transparent rounded-lg border border-dashed border-[#EAEFF5] min-h-[110px] opacity-40"
                />
              );
            }

            const dayDateStr = formatDateKey(day);
            const isToday = dayDateStr === formatDateKey(new Date());
            const uniqueDropId = `month_day_${dayDateStr}`;
            const isHover =
              hoverCell?.sid === uniqueDropId && hoverCell?.idx === 40;
            const canClickToPlace = Boolean(selectedService);

            // Filter appointments for this date and active staff filter
            const cellAppointments = appointments.filter(
              (appt) =>
                appt.date === dayDateStr &&
                (activeStaffId === "all" || appt.staffId === activeStaffId)
            );

            return (
              <div
                key={dayDateStr}
                className={`relative flex flex-col bg-white border rounded-xl p-2.5 overflow-hidden transition-all min-h-[110px] select-none ${
                  isHover
                    ? "bg-[#DCD6FF] border-[#635BFF] shadow-md ring-2 ring-[#635BFF]"
                    : canClickToPlace
                    ? "hover:bg-[#F8F7FF] hover:border-[#635BFF] cursor-pointer"
                    : "border-[#E0E6EB] hover:shadow-sm"
                }`}
                onDragEnter={(e) => handleDragEnter(e, uniqueDropId, 40)}
                onDragOver={(e) => onOver(e, uniqueDropId, 40)}
                onDrop={(e) => {
                  onDrop(e, targetDropStaffId, 40, dayDateStr);
                }}
                onClick={() => {
                  if (canClickToPlace) {
                    onPlaceSelectedService?.(targetDropStaffId, 40, dayDateStr);
                  }
                }}
              >
                <div className="flex items-center justify-between mb-1.5 shrink-0 pointer-events-none">
                  <span
                    className={`text-xs font-bold font-manrope px-1.5 py-0.5 rounded-full ${
                      isToday
                        ? "bg-[#635BFF] text-white"
                        : "text-[#29343D]"
                    }`}
                  >
                    {day.getDate()}
                  </span>
                  {cellAppointments.length > 0 && (
                    <span className="text-[10px] font-semibold text-[#635BFF] bg-[#ECEAFF] px-1.5 py-0.5 rounded-full">
                      {cellAppointments.length}
                    </span>
                  )}
                </div>

                {/* Appointments for this day */}
                <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 no-scrollbar pointer-events-auto">
                  {cellAppointments.map((appt) => {
                    const svc = SERVICES.find((s) => s.id === appt.serviceId);
                    const staff = STAFF.find((st) => st.id === appt.staffId);
                    const serviceName =
                      appt.serviceName || svc?.name || "Service";

                    return (
                      <div
                        key={appt.id}
                        onDragEnter={(e) => handleDragEnter(e, uniqueDropId, 40)}
                        onDragOver={(e) => onOver(e, uniqueDropId, 40)}
                        onDrop={(e) => {
                          onDrop(e, appt.staffId, appt.startSlot, dayDateStr);
                        }}
                        className="bg-[#E6F8F3] hover:bg-[#d8f5ec] rounded-[0px_6px_6px_0px] px-2 py-1 flex items-center justify-between shadow-xs transition-colors border-l-2 border-l-[#16CDC7]"
                        title={`${serviceName} at ${formatSlotTime(
                          appt.startSlot
                        )}${staff ? ` • ${staff.name}` : ""}`}
                      >
                        <div className="min-w-0 flex-1 pointer-events-none">
                          <p className="text-[10px] font-bold font-manrope text-[#0E9490] truncate leading-tight">
                            {serviceName}
                          </p>
                          <p className="text-[9px] font-medium font-manrope text-[#16CDC7]">
                            {formatSlotTime(appt.startSlot)}
                            {activeStaffId === "all" && staff
                              ? ` (${staff.name.split(" ")[0]})`
                              : ""}
                          </p>
                        </div>
                        <div className="pointer-events-auto">
                          <CustomCloseButton
                            onClick={(e) => {
                              e.stopPropagation();
                              removeAppt(appt.id);
                            }}
                            className="text-[#16CDC7] opacity-60 hover:opacity-100 ml-1 shrink-0 cursor-pointer p-0.5"
                            size={11}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
