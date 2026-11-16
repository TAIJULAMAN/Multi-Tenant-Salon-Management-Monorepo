"use client";

import React, { useState } from "react";
import Link from "next/link";
import SubmitButton from "@/components/customComponent/SubmitButton";
import CancelButton from "@/components/customComponent/CancelButton";
import RoleBasicDetails from "@/components/roles/RoleBasicDetails";
import TenantPermissions from "@/components/roles/TenantPermissions";
import CalendarPermissions from "@/components/roles/CalendarPermissions";
import SubPageHeader from "@/components/saloonOwner/customComponent/CustomSubPageHeader";

export default function CreateRolePage() {
  const [formData, setFormData] = useState({
    roleName: "",
    description: "",
  });

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

  const handleBasicDetailsChange = (
    field: "roleName" | "description",
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full space-y-6 pb-10">
      <SubPageHeader title="Create Role" backUrl="/dashboard/roles" />
      <RoleBasicDetails
        roleName={formData.roleName}
        description={formData.description}
        onChange={handleBasicDetailsChange}
      />
      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] p-6 space-y-6">
        <h2 className="text-[15px] font-bold text-[#1E293B] font-manrope">
          Permissions
        </h2>
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
