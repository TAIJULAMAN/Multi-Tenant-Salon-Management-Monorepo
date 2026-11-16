"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import SubPageHeader from "@/components/saloonOwner/customComponent/CustomSubPageHeader";
import TenantPermissions from "@/components/roles/TenantPermissions";
import CalendarPermissions from "@/components/roles/CalendarPermissions";
import SubmitButton from "@/components/customComponent/SubmitButton";
import CancelButton from "@/components/customComponent/CancelButton";
import ViewRoleBasicDetails from "@/components/roles/ViewRoleBasicDetails";
import UsersAssignedList from "@/components/roles/UsersAssignedList";

export default function ViewRolePage() {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    manageSalonProfile: true,
    manageSubscription: true,
    manageRoles: true,
    viewAuditLog: true,
    viewTeamCalendars: true,
    viewAllCalendars: true,
    createAppointments: true,
    editOwnAppointments: true,
    editOthersAppointments: true,
    approveRejectBookings: true,
    overrideConflicts: true,
    blockTime: true,
    manageShiftScheduling: true,
    configureServiceDurations: true,
    exportCalendar: true,
    viewClientNotes: true,
  });

  const togglePermission = (key: string) => {
    setPermissions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const users = [
    { id: 1, name: "Maria Rodriguez", avatar: "/avatar/icon1.png" },
    { id: 2, name: "Shah Aman", avatar: "/avatar/icon2.png" },
  ];

  return (
    <div className="w-full flex flex-col gap-6 pb-10">
      <SubPageHeader title="Owner" badgeCount={users.length} backUrl="/dashboard/roles" />
      <ViewRoleBasicDetails
        name="Audience 02"
        description="This role represents the business owner or top administrator of the salon. It has complete read and write access to all features, including profile settings, subscriptions, team scheduling, financial reports, and system permissions configurations."
      />
      <UsersAssignedList users={users} />
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6 flex flex-col gap-6">
        <h2 className="text-[15px] font-bold text-[#1E293B] font-manrope">Permissions</h2>
        <TenantPermissions
          permissions={permissions}
          onToggle={togglePermission}
        />
        <CalendarPermissions
          permissions={permissions}
          onToggle={togglePermission}
        />
        <div className="pt-2 flex items-center justify-end gap-3">
          <Link href="/dashboard/roles">
            <CancelButton>Cancel</CancelButton>
          </Link>
          <SubmitButton type="button">Save Changes</SubmitButton>
        </div>
      </div>
    </div>
  );
}
