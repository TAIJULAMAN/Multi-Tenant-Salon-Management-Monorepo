"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useRescheduleDate } from "./hooks/useRescheduleDate";
import { useRescheduleDragDrop } from "./hooks/useRescheduleDragDrop";
import { useFullscreen } from "./hooks/useFullscreen";
import { STAFF, SERVICES, SLOTS, TIME_W, ROW_H, MIN_COL, Service } from "./utils";
import RescheduleToolbar from "./RescheduleToolbar";
import RescheduleBody from "./RescheduleBody";

export default function RescheduleAppointmentContent() {
  const router = useRouter();
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>(
    STAFF.map((m) => m.id)
  );
  const [servicesList, setServicesList] = useState<Service[]>(SERVICES);
  const [saveToast, setSaveToast] = useState(false);
  const calendarWrapperRef = useRef<HTMLDivElement>(null);

  const {
    currentDate,
    activePeriod,
    setActivePeriod,
    fmt,
    prev,
    next,
  } = useRescheduleDate(new Date(2025, 8, 2));

  const {
    appointments,
    hoverCell,
    onDragStart,
    onDragStartAppt,
    onDragEnd,
    onOver,
    onDragEnter,
    onDrop,
    removeAppt,
    selectedService,
    setSelectedService,
    placeSelectedService,
    isDragging,
    draggingService,
    draggingAppt,
  } = useRescheduleDragDrop();

  const toggleFullscreen = useFullscreen(calendarWrapperRef);

  const handleSave = () => {
    setSaveToast(true);
    setTimeout(() => {
      setSaveToast(false);
      router.back();
    }, 800);
  };

  return (
    <div className="h-full font-manrope flex flex-col gap-5 relative">
      <div
        ref={calendarWrapperRef}
        className="flex-1 min-h-0 bg-white rounded-2xl border border-[#EEF2F8] flex flex-col overflow-hidden shadow-xs"
      >
        {/* Toolbar */}
        <RescheduleToolbar
          prevDay={prev}
          nextDay={next}
          activePeriod={activePeriod}
          setActivePeriod={setActivePeriod}
          formatDate={fmt}
          currentDate={currentDate}
          onToggleFullscreen={toggleFullscreen}
          selectedTeamIds={selectedTeamIds}
          setSelectedTeamIds={setSelectedTeamIds}
          teamMembers={STAFF}
        />

        {/* Two-column body */}
        <RescheduleBody
          activePeriod={activePeriod}
          STAFF={STAFF}
          SERVICES={servicesList}
          SLOTS={SLOTS}
          appointments={appointments}
          TIME_W={TIME_W}
          ROW_H={ROW_H}
          MIN_COL={MIN_COL}
          hoverCell={hoverCell}
          onOver={onOver}
          onDragEnter={onDragEnter}
          onDrop={onDrop}
          removeAppt={removeAppt}
          currentDate={currentDate}
          selectedTeamIds={selectedTeamIds}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragStartAppt={onDragStartAppt}
          selectedService={selectedService}
          onSelectService={setSelectedService}
          onPlaceSelectedService={placeSelectedService}
          onUpdateServices={setServicesList}
          isDragging={isDragging}
          draggingService={draggingService}
          draggingAppt={draggingAppt}
        />

        <div className="shrink-0 flex items-center justify-between p-[24px_30px] pt-0">
          <div className="text-xs text-[#98A4AE] font-manrope">
            {appointments.length} appointment{appointments.length === 1 ? "" : "s"} scheduled
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 text-[#526B7A] hover:text-[#29343D] border border-[#E0E6EB] hover:bg-[#F4F6FA] font-semibold font-manrope rounded-[12px] transition-colors cursor-pointer text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 text-white bg-[#635BFF] hover:bg-[#4f49e0] font-semibold font-manrope rounded-[12px] transition-colors cursor-pointer shadow-sm text-sm flex items-center gap-2"
            >
              {saveToast ? "Saved!" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
