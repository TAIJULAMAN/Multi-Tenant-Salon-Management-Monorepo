"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
import CustomCloseButton from "@/components/customComponent/CustomCloseButton";
import {
  Service,
  StaffMember,
  ScheduledAppointment,
  Slot,
  formatDateKey,
  formatSlotTime,
  getSlotEndTime,
  BUSINESS_START_SLOT,
} from "./utils";

interface RescheduleDayViewProps {
  STAFF: StaffMember[];
  SERVICES: Service[];
  SLOTS: Slot[];
  appointments: ScheduledAppointment[];
  TIME_W: number;
  ROW_H: number;
  MIN_COL: number;
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
  selectedService?: Service | null;
  onPlaceSelectedService?: (
    staffId: string,
    slotIdx: number,
    dateStr: string
  ) => void;
  onDragStartAppt?: (e: React.DragEvent, appt: ScheduledAppointment) => void;
  onDragEnd?: () => void;
  draggingAppt?: ScheduledAppointment | null;
  isDragging?: boolean;
}

export default function RescheduleDayView({
  STAFF,
  SERVICES,
  SLOTS,
  appointments,
  TIME_W,
  ROW_H,
  MIN_COL,
  hoverCell,
  onOver,
  onDragEnter,
  onDrop,
  removeAppt,
  currentDate,
  selectedService,
  onPlaceSelectedService,
  onDragStartAppt,
  onDragEnd,
  draggingAppt,
  isDragging,
}: RescheduleDayViewProps) {
  const [selectedStaff, setSelectedStaff] = useState<string>(
    STAFF[0]?.id || "1"
  );
  const [colW, setColW] = useState<number>(MIN_COL);

  const headRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentDateStr = formatDateKey(currentDate);

  // Filter appointments for current date
  const dayAppointments = appointments.filter(
    (appt) => !appt.date || appt.date === currentDateStr
  );

  useEffect(() => {
    function recalc() {
      if (!containerRef.current || STAFF.length === 0) return;
      const avail = containerRef.current.offsetWidth - TIME_W;
      setColW(Math.max(Math.floor(avail / STAFF.length), MIN_COL));
    }
    recalc();
    const ro = new ResizeObserver(recalc);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [STAFF.length, TIME_W, MIN_COL]);

  // Auto-scroll to business hours (9:00 AM) on mount
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = Math.max(
        0,
        BUSINESS_START_SLOT * ROW_H - ROW_H * 2
      );
    }
  }, [ROW_H]);

  const totalW = colW * STAFF.length;

  function slide(dir: "l" | "r") {
    const body = bodyRef.current;
    const head = headRef.current;
    if (!body) return;
    body.scrollLeft += dir === "l" ? -(colW * 2) : colW * 2;
    if (head) head.scrollLeft = body.scrollLeft;
  }

  const onBodyScroll = useCallback(() => {
    if (headRef.current && bodyRef.current)
      headRef.current.scrollLeft = bodyRef.current.scrollLeft;
  }, []);

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
    <div
      ref={containerRef}
      className="flex-1 min-w-0 flex flex-col overflow-hidden bg-white"
    >
      {/* Staff header row */}
      <div className="shrink-0 bg-[#F3F3FF] relative h-[88px] border-b border-[#E0E6EB]">
        {/* Left arrow */}
        <button
          type="button"
          onClick={() => slide("l")}
          className="absolute z-30 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-white border border-[#DDE3EC] shadow-sm hover:bg-[#F4F6FA] transition-colors cursor-pointer"
          style={{ left: TIME_W - 14 }}
          title="Scroll left"
        >
          <ChevronLeft size={14} strokeWidth={2} className="text-[#7A8FA6]" />
        </button>

        {/* Header: synced via ref */}
        <div
          ref={headRef}
          style={{
            position: "absolute",
            left: TIME_W,
            right: 36,
            top: 0,
            bottom: 0,
            overflowX: "hidden",
          }}
        >
          <div
            className="flex h-full border-l border-[#E0E6EB]"
            style={{ width: totalW }}
          >
            {STAFF.map((staff) => (
              <div
                key={staff.id}
                onClick={() => setSelectedStaff(staff.id)}
                className="shrink-0 flex flex-col items-center justify-center gap-[6px] border-r border-[#E0E6EB] last:border-r-0 cursor-pointer hover:bg-[#FAFAFE] transition-colors"
                style={{ width: colW }}
              >
                <div
                  className="relative overflow-hidden shrink-0 transition-all"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    outline:
                      selectedStaff === staff.id
                        ? "2px dashed #635BFF"
                        : "2px solid transparent",
                    outlineOffset: "2px",
                  }}
                >
                  <Image
                    src={staff.avatar}
                    alt={staff.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <span className="text-[12px] font-semibold font-manrope text-[#29343D] text-center w-full px-1 truncate">
                  {staff.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right arrow */}
        <button
          type="button"
          onClick={() => slide("r")}
          className="absolute z-30 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded-full bg-white border border-[#DDE3EC] shadow-sm hover:bg-[#F4F6FA] transition-colors cursor-pointer"
          style={{ right: 6 }}
          title="Scroll right"
        >
          <ChevronRight size={14} strokeWidth={2} className="text-[#7A8FA6]" />
        </button>
      </div>

      {/* ── Grid ── */}
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
                            idx
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
              appt.startSlot
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
    </div>
  );
}
