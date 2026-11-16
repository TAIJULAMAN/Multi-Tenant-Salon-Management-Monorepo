"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import RescheduleStaffHeader from "./RescheduleStaffHeader";
import RescheduleGrid from "./RescheduleGrid";
import {
  Service,
  StaffMember,
  ScheduledAppointment,
  Slot,
  formatDateKey,
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
      <RescheduleStaffHeader
        STAFF={STAFF}
        selectedStaff={selectedStaff}
        setSelectedStaff={setSelectedStaff}
        colW={colW}
        totalW={totalW}
        TIME_W={TIME_W}
        headRef={headRef}
        onSlide={slide}
      />

      {/* Grid */}
      <RescheduleGrid
        bodyRef={bodyRef}
        onBodyScroll={onBodyScroll}
        TIME_W={TIME_W}
        ROW_H={ROW_H}
        colW={colW}
        totalW={totalW}
        SLOTS={SLOTS}
        STAFF={STAFF}
        SERVICES={SERVICES}
        dayAppointments={dayAppointments}
        hoverCell={hoverCell}
        selectedService={selectedService}
        currentDateStr={currentDateStr}
        handleDragEnter={handleDragEnter}
        onOver={onOver}
        onDrop={onDrop}
        onPlaceSelectedService={onPlaceSelectedService}
        onDragStartAppt={onDragStartAppt}
        onDragEnd={onDragEnd}
        removeAppt={removeAppt}
        draggingAppt={draggingAppt}
        isDragging={isDragging}
      />
    </div>
  );
}
