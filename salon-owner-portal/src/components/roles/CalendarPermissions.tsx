"use client";

import React from "react";
import PermissionItem from "./PermissionItem";
import { PermissionSectionProps } from "./types";

export default function CalendarPermissions({
  permissions,
  onToggle,
}: PermissionSectionProps) {
  return (
    <div className="border border-[#E2E8F0] rounded-lg p-5 space-y-5">
      <h3 className="text-[14px] font-bold text-[#1E293B] font-manrope">Calendar & Bookings</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
        <PermissionItem
          title="View team calendars (same salon)"
          checked={permissions.viewTeamCalendars}
          onChange={() => onToggle("viewTeamCalendars")}
        />
        <PermissionItem
          title="View all salon calendars (incl. private slots)"
          checked={permissions.viewAllCalendars}
          onChange={() => onToggle("viewAllCalendars")}
        />
        <PermissionItem
          title="Create appointments"
          checked={permissions.createAppointments}
          onChange={() => onToggle("createAppointments")}
        />
        <PermissionItem
          title="Edit appointments (own)"
          checked={permissions.editOwnAppointments}
          onChange={() => onToggle("editOwnAppointments")}
        />
        <PermissionItem
          title="Edit appointments (others)"
          checked={permissions.editOthersAppointments}
          onChange={() => onToggle("editOthersAppointments")}
        />
        <PermissionItem
          title="Approve/reject client self-bookings"
          checked={permissions.approveRejectBookings}
          onChange={() => onToggle("approveRejectBookings")}
        />
        <PermissionItem
          title="Override conflicts/overbook"
          checked={permissions.overrideConflicts}
          onChange={() => onToggle("overrideConflicts")}
        />
        <PermissionItem
          title="Block time / set breaks"
          checked={permissions.blockTime}
          onChange={() => onToggle("blockTime")}
        />
        <PermissionItem
          title="Manage shift scheduling & rotations"
          subtitle="(recurring, Saturday rotation rules)"
          checked={permissions.manageShiftScheduling}
          onChange={() => onToggle("manageShiftScheduling")}
        />
        <PermissionItem
          title="Configure service durations & availability logic"
          checked={permissions.configureServiceDurations}
          onChange={() => onToggle("configureServiceDurations")}
        />
        <PermissionItem
          title="Export calendar / sync"
          checked={permissions.exportCalendar}
          onChange={() => onToggle("exportCalendar")}
        />
        <PermissionItem
          title="View client notes from calendar"
          checked={permissions.viewClientNotes}
          onChange={() => onToggle("viewClientNotes")}
        />
      </div>
    </div>
  );
}
