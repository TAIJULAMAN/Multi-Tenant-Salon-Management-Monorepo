"use client";
import { useRouter } from "next/navigation";
import {
  AppStatus,
  CalAppointment,
} from "@/@types/salon-owner/CalAppointment.type";
import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import AppPill from "./AppPill";
import PreviewCard from "./PreviewCard";
import NewAppointmentModal from "./NewAppointmentModal";
import EditAppointmentModal from "./EditAppointmentModal";
import DeleteAppointmentModal from "../DeleteAppointmentModal";

// import DragGhost from "./DragGhost";

export default function DayView({
  date,
  selectedMemberIds,
  teamMembers,
  allAppointments,
  isSameDay,
  HOURS,
  HOUR_HEIGHT,
  formatHour,
  timeToMinutes,
  statusColor,
  statusBadgeColor,
  onAppointmentCreate,
  onAppointmentUpdate,
  slotDuration,
  offsetTop = 160,
}: {
  date: Date;
  selectedMemberIds: string[];
  teamMembers: { id: string; name: string; avatar: string }[];
  allAppointments: CalAppointment[];
  isSameDay: (a: Date, b: Date) => boolean;
  HOURS: number[];
  HOUR_HEIGHT: number;
  formatHour: (hour: number) => string;
  timeToMinutes: (time: string) => number;
  statusColor: Record<AppStatus, { bg: string; text: string; border: string }>;
  statusBadgeColor?: Record<AppStatus, string>;
  onAppointmentCreate?: (appts: CalAppointment[]) => void;
  onAppointmentUpdate?: (appts: CalAppointment | CalAppointment[], oldIdsToRemove?: string[]) => void;
  slotDuration: number;
  offsetTop?: number;
}) {
  const router = useRouter();
  const [preview, setPreview] = useState<{
    appt: CalAppointment;
    x: number;
    y: number;
  } | null>(null);
  const [deleteAppt, setDeleteAppt] = useState<CalAppointment | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    startTime: string;
    endTime: string;
    memberId: string;
  } | null>(null);

  const [editingAppts, setEditingAppts] = useState<CalAppointment[] | null>(null);

  const lastDragEndTimeRef = useRef<number>(0);

  const [dragState, setDragState] = useState<{
    appt: CalAppointment;
    ghostX: number;
    ghostY: number;
    ghostWidth: number;
    ghostHeight: number;
    snappedStartMin: number;
    snappedEndMin: number;
    targetMemberId: string;
    grabOffsetY: number;
    startX: number;
    startY: number;
    hasMoved: boolean;
  } | null>(null);

  const isDraggingApptRef = useRef(false);
  const dragStateRef = useRef(dragState);
  useEffect(() => {
    dragStateRef.current = dragState;
  }, [dragState]);

  const [selectionPreview, setSelectionPreview] = useState<{
    startMin: number;
    endMin: number;
    memberId: string;
  } | null>(null);
  const isSelectingRef = useRef(false);
  const selectionDataRef = useRef<{
    startMin: number;
    endMin: number;
    memberId: string;
  } | null>(null);
  const justSelectedRef = useRef(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const slotsPerHour = 60 / slotDuration;
  const slotPxHeight = HOUR_HEIGHT / slotsPerHour;
  const visibleMembers = teamMembers.filter((m) =>
    selectedMemberIds.includes(m.id),
  );
  const safeIsSameDay = (a: Date | string, b: Date | string) => {
    try {
      const da = typeof a === "string" ? new Date(a) : a;
      const db = typeof b === "string" ? new Date(b) : b;
      return isSameDay(da, db);
    } catch {
      return false;
    }
  };
  const dayAppts = allAppointments.filter((a) => safeIsSameDay(a.date, date));

  const minutesToTime = (mins: number): string => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const formatDuration = (s: number, e: number) => {
    const d = e - s;
    if (d <= 0) return "0 min";
    if (d < 60) return `${d} min`;
    const h = Math.floor(d / 60),
      m = d % 60;
    return m === 0 ? `${h}h` : `${h}h ${m}m`;
  };

  const clientYToSnappedMin = useCallback(
    (clientY: number, colEl: HTMLElement, grabOffsetY = 0) => {
      const rect = colEl.getBoundingClientRect();
      const offsetY = clientY - rect.top - grabOffsetY;
      const rawMin = HOURS[0] * 60 + (offsetY / HOUR_HEIGHT) * 60;
      return Math.round(rawMin / 5) * 5;
    },
    [HOURS, HOUR_HEIGHT],
  );

  useEffect(() => {
    const onMove = (ev: MouseEvent) => {
      if (!isDraggingApptRef.current || !dragStateRef.current) return;
      const ds = dragStateRef.current;
      const colEls =
        gridRef.current?.querySelectorAll<HTMLElement>("[data-member-col]");
      let targetMemberId = ds.targetMemberId;
      let targetColEl: HTMLElement | null = null;
      colEls?.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (ev.clientX >= r.left && ev.clientX <= r.right) {
          targetMemberId = el.dataset.memberId ?? ds.targetMemberId;
          targetColEl = el;
        }
      });

      if (!targetColEl && targetMemberId) {
        targetColEl =
          gridRef.current?.querySelector<HTMLElement>(
            `[data-member-id="${targetMemberId}"]`
          ) ?? null;
      }

      if (!ds.hasMoved) {
        if (Math.abs(ev.clientX - ds.startX) < 3 && Math.abs(ev.clientY - ds.startY) < 3) {
          return;
        }
      }

      // Auto-scroll scrollContainer if dragging near top/bottom
      if (scrollContainerRef.current) {
        const scRect = scrollContainerRef.current.getBoundingClientRect();
        if (ev.clientY < scRect.top + 60 && scrollContainerRef.current.scrollTop > 0) {
          scrollContainerRef.current.scrollTop -= 10;
        } else if (ev.clientY > scRect.bottom - 60) {
          scrollContainerRef.current.scrollTop += 10;
        }
      }

      const duration = ds.snappedEndMin - ds.snappedStartMin;
      let snappedStart = ds.snappedStartMin;
      if (targetColEl) {
        const rawStart = clientYToSnappedMin(
          ev.clientY,
          targetColEl,
          ds.grabOffsetY,
        );
        const maxStart = (HOURS[HOURS.length - 1] + 1) * 60 - duration;
        snappedStart = Math.min(
          Math.max(HOURS[0] * 60, rawStart),
          Math.max(HOURS[0] * 60, maxStart)
        );
      }
      setDragState((prev) =>
        prev
          ? {
            ...prev,
            ghostX: ev.clientX - ds.grabOffsetY * 0.3,
            ghostY: ev.clientY - ds.grabOffsetY,
            snappedStartMin: snappedStart,
            snappedEndMin: snappedStart + duration,
            targetMemberId,
            hasMoved: true,
          }
          : null,
      );
    };
    const onUp = () => {
      if (!isDraggingApptRef.current) return;
      const ds = dragStateRef.current;

      if (!ds || !ds.hasMoved) {
        isDraggingApptRef.current = false;
      } else {
        lastDragEndTimeRef.current = Date.now();
        setTimeout(() => {
          isDraggingApptRef.current = false;
        }, 200);

        const oldStartMin = timeToMinutes(ds.appt.startTime);
        const deltaMins = ds.snappedStartMin - oldStartMin;
        if (ds.appt.groupId && deltaMins !== 0) {
          const groupAppts = allAppointments.filter(
            (a) => a.groupId === ds.appt.groupId,
          );
          const updatedGroup = groupAppts.map((part) => {
            if (part.id === ds.appt.id) {
              return {
                ...part,
                date,
                startTime: minutesToTime(ds.snappedStartMin),
                endTime: minutesToTime(ds.snappedEndMin),
                employeeId: ds.targetMemberId,
                employeeName:
                  teamMembers.find((m) => m.id === ds.targetMemberId)?.name ??
                  part.employeeName,
              };
            } else {
              const partStartMin = timeToMinutes(part.startTime);
              const partEndMin = timeToMinutes(part.endTime);
              return {
                ...part,
                date,
                startTime: minutesToTime(partStartMin + deltaMins),
                endTime: minutesToTime(partEndMin + deltaMins),
              };
            }
          });
          onAppointmentUpdate?.(updatedGroup, groupAppts.map((a) => a.id));
        } else {
          onAppointmentUpdate?.({
            ...ds.appt,
            date,
            startTime: minutesToTime(ds.snappedStartMin),
            endTime: minutesToTime(ds.snappedEndMin),
            employeeId: ds.targetMemberId,
            employeeName:
              teamMembers.find((m) => m.id === ds.targetMemberId)?.name ??
              ds.appt.employeeName,
          });
        }
      }

      setDragState(null);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [clientYToSnappedMin, HOURS, onAppointmentUpdate, teamMembers, allAppointments, date]);

  useEffect(() => {
    const onMove = (ev: MouseEvent) => {
      if (!isSelectingRef.current || !selectionDataRef.current) return;
      const colEls =
        gridRef.current?.querySelectorAll<HTMLElement>("[data-member-col]");
      colEls?.forEach((el) => {
        if (el.dataset.memberId !== selectionDataRef.current!.memberId) return;
        const rect = el.getBoundingClientRect();
        if (ev.clientX < rect.left || ev.clientX > rect.right) return;
        const offsetY = ev.clientY - rect.top;
        const rawMin = HOURS[0] * 60 + (offsetY / HOUR_HEIGHT) * 60;
        const currentMin =
          HOURS[0] * 60 + Math.floor(offsetY / (HOUR_HEIGHT / 60) / 5) * 5;
        if (currentMin >= selectionDataRef.current!.startMin) {
          selectionDataRef.current!.endMin = Math.max(
            selectionDataRef.current!.startMin + 15,
            currentMin + 5
          );
          setSelectionPreview({ ...selectionDataRef.current! });
        }
      });
    };
    const onUp = () => {
      if (!isSelectingRef.current || !selectionDataRef.current) return;
      isSelectingRef.current = false;
      justSelectedRef.current = true;
      const { startMin, endMin, memberId } = selectionDataRef.current;
      setSelectedSlot({
        startTime: minutesToTime(startMin),
        endTime: minutesToTime(endMin),
        memberId,
      });
      setSelectionPreview(null);
      selectionDataRef.current = null;
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, [HOURS, slotPxHeight]);

  const handlePillMouseDown = (
    appt: CalAppointment,
    e: React.MouseEvent,
    pillEl: HTMLElement,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const pillRect = pillEl.getBoundingClientRect();
    const grabOffsetY = e.clientY - pillRect.top;
    const duration =
      timeToMinutes(appt.endTime) - timeToMinutes(appt.startTime);
    const pillHeight = Math.max((duration / 60) * HOUR_HEIGHT, 28);
    isDraggingApptRef.current = true;
    setDragState({
      appt,
      ghostX: e.clientX - grabOffsetY * 0.3,
      ghostY: e.clientY - grabOffsetY,
      ghostWidth: pillRect.width,
      ghostHeight: pillHeight,
      snappedStartMin: timeToMinutes(appt.startTime),
      snappedEndMin: timeToMinutes(appt.endTime),
      targetMemberId: appt.employeeId,
      grabOffsetY,
      startX: e.clientX,
      startY: e.clientY,
      hasMoved: false,
    });
  };

  const handleColumnMouseDown = (
    e: React.MouseEvent,
    memberId: string,
    colEl: HTMLElement,
  ) => {
    if (e.button !== 0) return;
    if (preview) {
      setPreview(null);
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    const rect = colEl.getBoundingClientRect();
    const offsetY = e.clientY - rect.top;
    const rawMin = HOURS[0] * 60 + (offsetY / HOUR_HEIGHT) * 60;
    const startMin =
      HOURS[0] * 60 + Math.floor(offsetY / (HOUR_HEIGHT / 60) / 5) * 5;
    isSelectingRef.current = true;
    selectionDataRef.current = {
      startMin,
      endMin: startMin + 15,
      memberId,
    };
    setSelectionPreview({
      startMin,
      endMin: startMin + 15,
      memberId,
    });
  };

  const handlePillClick = (appt: CalAppointment, e: React.MouseEvent) => {
    if (isDraggingApptRef.current || Date.now() - lastDragEndTimeRef.current < 200) return;
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    setPreview({
      appt,
      x: rect.left - containerRect.left + rect.width + 8,
      y: rect.top - containerRect.top,
    });
  };

  const handleResizeEnd = (appt: CalAppointment, newEndTime: string) => {
    onAppointmentUpdate?.({ ...appt, endTime: newEndTime });
  };

  const handleCreateAppointment = (appts: CalAppointment[]) => {
    if (!selectedSlot) return;
    onAppointmentCreate?.(appts);
    setSelectedSlot(null);
  };

  const ghostStartTime = dragState
    ? minutesToTime(dragState.snappedStartMin)
    : "";
  const ghostEndTime = dragState ? minutesToTime(dragState.snappedEndMin) : "";

  return (
    <>
      {/* {dragState && dragState.hasMoved && (
        <DragGhost
          appt={dragState.appt}
          statusColor={statusColor}
          x={dragState.ghostX}
          y={dragState.ghostY}
          width={dragState.ghostWidth}
          height={dragState.ghostHeight}
          startTime={ghostStartTime}
          endTime={ghostEndTime}
        />
      )} */}

      <div
        ref={containerRef}
        className="relative"
        onContextMenu={(e) => e.preventDefault()}
        onClick={() => {
          if (justSelectedRef.current) {
            justSelectedRef.current = false;
            return;
          }
          setPreview(null);
          setSelectedSlot(null);
        }}
      >
        <div className="border border-[#E0E6EB] mx-[15px] my-[10px] rounded-xl overflow-hidden">
          <div
            ref={scrollContainerRef}
            className="overflow-y-auto overflow-x-auto overscroll-none"
            style={{ height: `calc(100svh - ${offsetTop}px)` }}
            css-scrollbar=""
          >
            <style>{`
              [css-scrollbar]::-webkit-scrollbar {
                width: 0px;
                height: 0px;
              }
              /* Firefox */
              [css-scrollbar] {
                scrollbar-width: none;
              }
            `}</style>
            <div className="min-w-[1000px]">
              <div className="sticky top-0 z-20 bg-[#F3F3FF] border-b border-[#E0E6EB]">
                <div className="flex">
                  <div className="w-[72px] shrink-0 border-r border-[#E0E6EB]" />
                  <div className="flex-1 flex">
                    {visibleMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex-1 min-w-[120px] flex flex-col items-center py-3 border-r border-[#E0E6EB] last:border-r-0"
                      >
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover mb-1.5"
                        />
                        <p className="text-xs font-semibold font-manrope text-[#29343D] text-center">
                          {member.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div ref={gridRef} className="flex">
                <div className="w-[72px] shrink-0 border-r border-[#E0E6EB]">
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      className="relative border-b border-[#E0E6EB]"
                      style={{ height: HOUR_HEIGHT }}
                    >
                      <span className="absolute top-0 left-2 text-[10px] font-manrope text-[#98A4AE] px-2 whitespace-nowrap">
                        {formatHour(h)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Member columns */}
                <div className="flex-1 flex">
                  {visibleMembers.map((member) => {
                    const memberAppts = dayAppts.filter(
                      (a) => a.employeeId === member.id,
                    );
                    const colHeight = HOURS.length * HOUR_HEIGHT;

                    return (
                      <div
                        key={member.id}
                        data-member-col
                        data-member-id={member.id}
                        className="flex-1 min-w-[120px] border-r border-[#E0E6EB] last:border-r-0 relative"
                        style={{ height: colHeight }}
                        onMouseDown={(e) => {
                          if ((e.target as HTMLElement).closest("[data-pill]"))
                            return;
                          handleColumnMouseDown(e, member.id, e.currentTarget);
                        }}
                      >
                        {/* Hour grid lines */}
                        {HOURS.map((h) => (
                          <div
                            key={h}
                            className="absolute left-0 right-0 border-b border-[#E0E6EB]"
                            style={{
                              top: (h - HOURS[0]) * HOUR_HEIGHT,
                              height: HOUR_HEIGHT,
                            }}
                          >
                            <div className="absolute inset-0 flex flex-col pointer-events-none">
                              {Array.from({ length: slotsPerHour }).map(
                                (_, i) => (
                                  <div
                                    key={i}
                                    className="flex-1 border-b border-[#E0E6EB]/50 last:border-b-0"
                                  />
                                ),
                              )}
                            </div>
                          </div>
                        ))}

                        {dragState?.targetMemberId === member.id && dragState.hasMoved && (
                          <div
                            className="absolute left-0.5 right-0.5 pointer-events-none z-20"
                            style={{
                              top: Math.max(
                                0,
                                ((dragState.snappedStartMin - HOURS[0] * 60) /
                                  60) *
                                HOUR_HEIGHT,
                              ),
                              height: Math.max(
                                28,
                                ((dragState.snappedEndMin -
                                  dragState.snappedStartMin) /
                                  60) *
                                HOUR_HEIGHT,
                              ),
                            }}
                          >
                            <div className="w-full h-full border-2 border-dashed border-[#635BFF] bg-[#635BFF]/8 rounded-[0px_8px_8px_0px] flex flex-col justify-center px-2 py-1">
                              <p className="font-manrope text-[10px] text-[#635BFF]/70">
                                {ghostStartTime} - {ghostEndTime}
                              </p>
                            </div>
                          </div>
                        )}

                        {selectionPreview?.memberId === member.id && (
                          <div
                            className="absolute left-0 right-0 pointer-events-none z-10"
                            style={{
                              top: Math.max(
                                0,
                                ((selectionPreview.startMin - HOURS[0] * 60) /
                                  60) *
                                HOUR_HEIGHT,
                              ),
                              height: Math.max(
                                (15 / 60) * HOUR_HEIGHT,
                                ((selectionPreview.endMin -
                                  selectionPreview.startMin) /
                                  60) *
                                HOUR_HEIGHT,
                              ),
                            }}
                          >
                            <div className="w-full h-full border-2 border-[#635BFF] bg-[#635BFF]/10 flex flex-col justify-between px-2 py-1">
                              <span className="text-[10px] font-bold font-manrope text-[#635BFF] bg-white/90 rounded px-1 self-start leading-none py-0.5">
                                {minutesToTime(selectionPreview.startMin)}
                              </span>
                              <span className="text-[11px] font-semibold font-manrope text-[#635BFF] bg-white/90 rounded px-1 self-center leading-none py-0.5">
                                {formatDuration(
                                  selectionPreview.startMin,
                                  selectionPreview.endMin,
                                )}
                              </span>
                              <span className="text-[10px] font-bold font-manrope text-[#635BFF] bg-white/90 rounded px-1 self-end leading-none py-0.5">
                                {minutesToTime(selectionPreview.endMin)}
                              </span>
                            </div>
                          </div>
                        )}

                        {memberAppts.map((appt) => {
                          const startMin = timeToMinutes(appt.startTime);
                          const endMin = timeToMinutes(appt.endTime);
                          const top =
                            ((startMin - HOURS[0] * 60) / 60) * HOUR_HEIGHT;
                          const height = Math.max(
                            ((endMin - startMin) / 60) * HOUR_HEIGHT,
                            28,
                          );
                          const isBeingDragged = dragState?.appt.id === appt.id && dragState.hasMoved;

                          return (
                            <div
                              key={appt.id}
                              data-pill
                              style={{
                                position: "absolute",
                                top,
                                left: 2,
                                right: 2,
                                height,
                                opacity: isBeingDragged ? 0.4 : 1,
                                transition: "opacity 0.1s",
                                zIndex: isBeingDragged ? 1 : 10,
                              }}
                              onMouseDown={(e) => {
                                if (
                                  (e.target as HTMLElement).closest(
                                    "[data-resize]",
                                  )
                                )
                                  return;
                                handlePillMouseDown(appt, e, e.currentTarget);
                              }}
                            >
                              <AppPill
                                appt={appt}
                                statusColor={statusColor}
                                onClick={handlePillClick}
                                onResizeEnd={handleResizeEnd}
                                slotDuration={slotDuration}
                                slotPxHeight={slotPxHeight}
                                baseMinutes={HOURS[0] * 60}
                                HOUR_HEIGHT={HOUR_HEIGHT}
                              />
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview card */}
        {preview && (
          <PreviewCard
            appt={preview.appt}
            onClose={() => setPreview(null)}
            statusBadgeColor={statusBadgeColor}
            onViewDetails={() => {
              router.push("/appointment/view-appointment");
            }}
            onDelete={() => {
              setDeleteAppt(preview.appt);
              setPreview(null);
            }}
            onEdit={() => {
              const toEdit = preview.appt.groupId
                ? allAppointments.filter((a) => a.groupId === preview.appt.groupId)
                : [preview.appt];
              setEditingAppts(toEdit);
              setPreview(null);
            }}
            style={{
              top: Math.min(preview.y, 300),
              left: Math.min(preview.x, 400),
            }}
          />
        )}

        {/* Edit Appointment Modal */}
        {editingAppts && (
          <EditAppointmentModal
            memberId={editingAppts[0].employeeId}
            startTime={editingAppts[0].startTime}
            endTime={editingAppts[0].endTime}
            date={editingAppts[0].date}
            teamMembers={teamMembers}
            onClose={() => setEditingAppts(null)}
            editingAppts={editingAppts}
            onUpdate={(appts) => {
              onAppointmentUpdate?.(appts, editingAppts.map(a => a.id));
              setEditingAppts(null);
            }}
          />
        )}

        {/* New Appointment Modal */}
        {selectedSlot && (
          <NewAppointmentModal
            memberId={selectedSlot.memberId}
            startTime={selectedSlot.startTime}
            endTime={selectedSlot.endTime}
            date={date}
            teamMembers={teamMembers}
            onClose={() => setSelectedSlot(null)}
            onConfirm={handleCreateAppointment}
          />
        )}

        {/* Delete Appointment Modal */}
        {deleteAppt && (
          <DeleteAppointmentModal
            onClose={() => setDeleteAppt(null)}
            onConfirm={() => {
              if (onAppointmentUpdate) {
                onAppointmentUpdate([], [deleteAppt.id]);
              }
              setDeleteAppt(null);
            }}
          />
        )}
      </div>
    </>
  );
}
