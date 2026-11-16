"use client";

import { useState, useRef, useCallback } from "react";
import {
  Service,
  ScheduledAppointment,
  INITIAL_APPOINTMENTS,
  formatDateKey,
} from "../utils";

export function useRescheduleDragDrop() {
  const [appointments, setAppointments] =
    useState<ScheduledAppointment[]>(INITIAL_APPOINTMENTS);
  const [draggingService, setDraggingService] = useState<Service | null>(null);
  const [draggingAppt, setDraggingAppt] =
    useState<ScheduledAppointment | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [hoverCell, setHoverCell] = useState<{
    sid: string;
    idx: number;
  } | null>(null);

  // Synchronous refs to avoid any React state lag or closure stale issues during rapid DnD
  const draggingServiceRef = useRef<Service | null>(null);
  const draggingApptRef = useRef<ScheduledAppointment | null>(null);

  // Drag start for a service from the left panel
  const onDragStart = useCallback((e: React.DragEvent, svc: Service) => {
    draggingServiceRef.current = svc;
    draggingApptRef.current = null;
    setDraggingService(svc);
    setDraggingAppt(null);

    e.dataTransfer.effectAllowed = "all";
    const payload = JSON.stringify({ type: "service", service: svc });

    try {
      e.dataTransfer.setData("text/plain", payload);
      e.dataTransfer.setData("application/json", payload);
    } catch {
      // ignore
    }
  }, []);

  // Drag start for an existing appointment (rescheduling)
  const onDragStartAppt = useCallback(
    (e: React.DragEvent, appt: ScheduledAppointment) => {
      draggingApptRef.current = appt;
      draggingServiceRef.current = null;
      setDraggingAppt(appt);
      setDraggingService(null);

      e.dataTransfer.effectAllowed = "all";
      const payload = JSON.stringify({ type: "appointment", appt });

      try {
        e.dataTransfer.setData("text/plain", payload);
        e.dataTransfer.setData("application/json", payload);
      } catch {
        // ignore
      }
    },
    []
  );

  const onDragEnd = useCallback(() => {
    draggingServiceRef.current = null;
    draggingApptRef.current = null;
    setDraggingService(null);
    setDraggingAppt(null);
    setHoverCell(null);
  }, []);

  // Optimized onOver: Prevents default and avoids 60Hz state re-renders when hovering the same cell
  const onOver = useCallback((e: React.DragEvent, sid: string, idx: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer) {
      try {
        e.dataTransfer.dropEffect = draggingApptRef.current ? "move" : "copy";
      } catch {
        // ignore in case browser restricts
      }
    }

    setHoverCell((prev) => {
      if (prev?.sid === sid && prev?.idx === idx) {
        return prev; // Skip re-render if hovering the same cell
      }
      return { sid, idx };
    });
  }, []);

  const onDragEnter = useCallback(
    (e: React.DragEvent, sid: string, idx: number) => {
      e.preventDefault();
      e.stopPropagation();
      onOver(e, sid, idx);
    },
    [onOver]
  );

  const onDrop = useCallback(
    (
      e: React.DragEvent,
      targetStaffId: string,
      targetSlotIdx: number,
      targetDateStr?: string
    ) => {
      e.preventDefault();
      e.stopPropagation();

      let payloadType: "service" | "appointment" | null = null;
      let payloadService: Service | null =
        draggingServiceRef.current || draggingService;
      let payloadAppt: ScheduledAppointment | null =
        draggingApptRef.current || draggingAppt;

      // Fallback: Recover from dataTransfer if state was somehow cleared
      if (!payloadService && !payloadAppt) {
        try {
          const raw =
            e.dataTransfer.getData("application/json") ||
            e.dataTransfer.getData("text/plain");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.type === "appointment") {
              payloadType = "appointment";
              payloadAppt = parsed.appt;
            } else if (parsed.type === "service") {
              payloadType = "service";
              payloadService = parsed.service;
            }
          }
        } catch {
          // ignore
        }
      }

      if (payloadAppt) payloadType = "appointment";
      else if (payloadService) payloadType = "service";

      // Determine target staff and date
      let staffId = targetStaffId;
      let dateStr = targetDateStr || "2025-09-02";

      if (targetStaffId.includes("_month_")) {
        const parts = targetStaffId.split("_month_");
        staffId = parts[0];
        if (parts[1]) dateStr = parts[1];
      } else if (targetStaffId.includes("_week_")) {
        const parts = targetStaffId.split("_week_");
        staffId = parts[0];
        if (parts[1]) dateStr = parts[1];
      }

      if (payloadType === "appointment" && payloadAppt) {
        // Reschedule / move existing appointment
        const movedId = payloadAppt.id;
        setAppointments((prev) =>
          prev.map((a) =>
            a.id === movedId
              ? {
                  ...a,
                  staffId,
                  startSlot: targetSlotIdx,
                  date: dateStr,
                }
              : a
          )
        );
      } else if (payloadType === "service" && payloadService) {
        // Schedule new service
        const dur = Math.max(
          1,
          Math.ceil(parseInt(payloadService.duration) / 15) || 3
        );
        const newAppt: ScheduledAppointment = {
          id: `appt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          staffId,
          serviceId: payloadService.id,
          serviceName: payloadService.name,
          duration: dur,
          price: payloadService.price || "€ 170",
          startSlot: targetSlotIdx,
          date: dateStr,
        };
        setAppointments((prev) => [...prev, newAppt]);
      }

      draggingServiceRef.current = null;
      draggingApptRef.current = null;
      setDraggingService(null);
      setDraggingAppt(null);
      setHoverCell(null);
    },
    [draggingService, draggingAppt]
  );

  // Click-to-place helper (for touch/click booking)
  const placeSelectedService = useCallback(
    (staffId: string, slotIdx: number, dateStr: string) => {
      if (!selectedService) return;
      const dur = Math.max(
        1,
        Math.ceil(parseInt(selectedService.duration) / 15) || 3
      );
      const newAppt: ScheduledAppointment = {
        id: `appt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        staffId,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        duration: dur,
        price: selectedService.price || "€ 170",
        startSlot: slotIdx,
        date: dateStr,
      };
      setAppointments((prev) => [...prev, newAppt]);
      setSelectedService(null);
    },
    [selectedService]
  );

  const removeAppt = useCallback((idOrIndex: string | number) => {
    if (typeof idOrIndex === "number") {
      setAppointments((prev) => prev.filter((_, idx) => idx !== idOrIndex));
    } else {
      setAppointments((prev) => prev.filter((a) => a.id !== idOrIndex));
    }
  }, []);

  const editAppt = useCallback(
    (id: string, changes: Partial<ScheduledAppointment>) => {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...changes } : a))
      );
    },
    []
  );

  const isDragging = Boolean(draggingService || draggingAppt);

  return {
    appointments,
    setAppointments,
    dragging: draggingService,
    draggingService,
    draggingAppt,
    isDragging,
    selectedService,
    setSelectedService,
    hoverCell,
    onDragStart,
    onDragStartAppt,
    onDragEnd,
    onOver,
    onDragEnter,
    onDrop,
    placeSelectedService,
    removeAppt,
    editAppt,
  };
}
