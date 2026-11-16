"use client";

import React from "react";
import { GripVertical } from "lucide-react";
import CustomCloseButton from "@/components/customComponent/CustomCloseButton";
import {
  Service,
  StaffMember,
  ScheduledAppointment,
  Slot,
  formatSlotTime,
  getSlotEndTime,
} from "./utils";

interface RescheduleGridProps {
  bodyRef: React.RefObject<HTMLDivElement | null>;
  onBodyScroll: () => void;
  TIME_W: number;
  ROW_H: number;
  colW: number;
  totalW: number;
  SLOTS: Slot[];
  STAFF: StaffMember[];
  SERVICES: Service[];
  dayAppointments: ScheduledAppointment[];
  hoverCell: { sid: string; idx: number } | null;
  selectedService?: Service | null;
  currentDateStr: string;
  handleDragEnter: (e: React.DragEvent, sid: string, idx: number) => void;
  onOver: (e: React.DragEvent, sid: string, idx: number) => void;
  onDrop: (
    e: React.DragEvent,
    sid: string,
    idx: number,
    dateStr?: string,
  ) => void;
  onPlaceSelectedService?: (
    staffId: string,
    slotIdx: number,
    dateStr: string,
  ) => void;
  onDragStartAppt?: (e: React.DragEvent, appt: ScheduledAppointment) => void;
  onDragEnd?: () => void;
  removeAppt: (idOrIndex: string | number) => void;
  draggingAppt?: ScheduledAppointment | null;
  isDragging?: boolean;
}

export default function RescheduleGrid({
  bodyRef,
  onBodyScroll,
  TIME_W,
  ROW_H,
  colW,
  totalW,
  SLOTS,
  STAFF,
  SERVICES,
  dayAppointments,
  hoverCell,
  selectedService,
  currentDateStr,
  handleDragEnter,
  onOver,
  onDrop,
  onPlaceSelectedService,
  onDragStartAppt,
  onDragEnd,
  removeAppt,
  draggingAppt,
  isDragging,
}: RescheduleGridProps) {
  return (
    <div
      ref={bodyRef}
      className="flex-1 overflow-auto"
      onScroll={onBodyScroll}
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#D1D9E8 transparent",
      }}
    >
      <div
        className="relative"
        style={{
          width: TIME_W + totalW,
          height: SLOTS.length * ROW_H,
        }}
        onDragOver={(e) => e.preventDefault()}
      >
        {SLOTS.map((slot, idx) => (
          <div
            key={idx}
            className="absolute flex w-full"
            style={{ top: idx * ROW_H, height: ROW_H }}
          >
            {/* Time gutter */}
            <div
              className={`shrink-0 relative border-r ${
                slot.isHour ? "border-t" : ""
              } border-[#E0E6EB] bg-[#FAFBFD] select-none`}
              style={{ width: TIME_W }}
            >
              {slot.isHour && (
                <span
                  className="absolute right-3 text-[11px] font-semibold font-manrope text-[#8898AA] whitespace-nowrap leading-none pointer-events-none"
                  style={{ top: 7 }}
                >
                  {slot.label}
                </span>
              )}
            </div>

            {/* Staff cells */}
            {STAFF.map((staff) => {
              const isHover =
                hoverCell?.sid === staff.id && hoverCell?.idx === idx;
              const canClickToPlace = Boolean(selectedService);

              return (
                <div
                  key={staff.id}
                  className={`shrink-0 border-r border-[#EEF2F8] last:border-r-0 transition-colors
                    ${
                      slot.isHour
                        ? "border-t border-t-[#DDE3EC]"
                        : "border-t border-t-[#F2F4F7]"
                    }
                    ${
                      isHover
                        ? "bg-[#DCD6FF] ring-2 ring-inset ring-[#635BFF]"
                        : canClickToPlace
                          ? "hover:bg-[#F5F3FF] cursor-pointer"
                          : "hover:bg-[#FAFAFE]"
                    }`}
                  style={{ width: colW, height: ROW_H }}
                  onDragEnter={(e) => handleDragEnter(e, staff.id, idx)}
                  onDragOver={(e) => onOver(e, staff.id, idx)}
                  onDrop={(e) => onDrop(e, staff.id, idx, currentDateStr)}
                  onClick={() => {
                    if (canClickToPlace) {
                      onPlaceSelectedService?.(staff.id, idx, currentDateStr);
                    }
                  }}
                  title={
                    canClickToPlace
                      ? `Click to schedule ${selectedService?.name} at ${formatSlotTime(
                          idx,
                        )}`
                      : undefined
                  }
                />
              );
            })}
          </div>
        ))}

        {/* Appointment overlays */}
        {dayAppointments.map((appt) => {
          const ci = STAFF.findIndex((s) => s.id === appt.staffId);
          if (ci === -1) return null;
          const svc = SERVICES.find((s) => s.id === appt.serviceId);
          const serviceName = appt.serviceName || svc?.name || "Service";
          const servicePrice = appt.price || svc?.price || "€ 170";
          const timeRange = `${formatSlotTime(
            appt.startSlot,
          )} - ${getSlotEndTime(appt.startSlot, appt.duration)}`;

          const isThisApptDragging = draggingAppt?.id === appt.id;

          return (
            <div
              key={appt.id}
              draggable
              onDragStart={(e) => {
                onDragStartAppt?.(e, appt);
              }}
              onDragEnd={onDragEnd}
              className={`group absolute z-10 bg-[#E6F8F3] hover:bg-[#DCF5EE] rounded-[0px_8px_8px_0px] px-2.5 py-1.5 overflow-hidden flex flex-col justify-between shadow-sm hover:shadow transition-all border-l-4 border-l-[#16CDC7] select-none ${
                isDragging
                  ? "pointer-events-none"
                  : "cursor-grab active:cursor-grabbing"
              } ${
                isThisApptDragging
                  ? "opacity-30 ring-2 ring-dashed ring-[#16CDC7] scale-[0.98]"
                  : ""
              }`}
              style={{
                top: appt.startSlot * ROW_H + 1,
                left: TIME_W + ci * colW + 3,
                width: colW - 6,
                height: Math.max(38, appt.duration * ROW_H - 2),
              }}
              title={`Drag to reschedule • ${serviceName} (${timeRange})`}
            >
              <div className="flex items-start justify-between min-w-0 pointer-events-none">
                <div className="min-w-0 flex-1 flex items-start gap-1">
                  <GripVertical
                    size={12}
                    className="text-[#16CDC7] opacity-40 group-hover:opacity-100 shrink-0 mt-0.5"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-bold font-manrope text-[#0E9490] leading-tight truncate">
                      {serviceName}
                    </p>
                    <p className="text-[11px] font-medium font-manrope text-[#16CDC7] truncate mt-0.5">
                      {timeRange}
                    </p>
                  </div>
                </div>
                <div className="pointer-events-auto">
                  <CustomCloseButton
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAppt(appt.id);
                    }}
                    className="text-[#16CDC7] opacity-60 hover:opacity-100 text-sm leading-none cursor-pointer shrink-0 ml-1 hover:bg-[#c9f0e6] rounded p-0.5 transition-colors"
                    size={14}
                  />
                </div>
              </div>

              {appt.duration >= 2 && (
                <div className="flex items-center justify-between text-[10px] font-manrope text-[#0E9490] opacity-80 pt-1 border-t border-[#c6f2e8] mt-1 pointer-events-none">
                  <span>{appt.duration * 15} min</span>
                  <span className="font-semibold">{servicePrice}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
