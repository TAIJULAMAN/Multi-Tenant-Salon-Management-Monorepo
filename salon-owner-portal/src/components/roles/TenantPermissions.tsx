"use client";

import React from "react";
import PermissionItem from "./PermissionItem";
import { PermissionSectionProps } from "./types";

export default function TenantPermissions({
  permissions,
  onToggle,
}: PermissionSectionProps) {
  return (
    <div className="border border-[#E2E8F0] rounded-lg p-5 space-y-5">
      <h3 className="text-[14px] font-bold text-[#1E293B] font-manrope">Tenant & Users</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
        <PermissionItem
          title="Manage salon profile"
          subtitle="Branding, name, header and business info"
          checked={permissions.manageSalonProfile}
          onChange={() => onToggle("manageSalonProfile")}
        />
        <PermissionItem
          title="Manage subscription & feature toggles"
          subtitle="Allow subscription & feature toggles"
          checked={permissions.manageSubscription}
          onChange={() => onToggle("manageSubscription")}
        />
        <PermissionItem
          title="Manage roles & member invites"
          subtitle="Add/remove users, set permissions"
          checked={permissions.manageRoles}
          onChange={() => onToggle("manageRoles")}
        />
        <PermissionItem
          title="View audit log / user operation history"
          checked={permissions.viewAuditLog}
          onChange={() => onToggle("viewAuditLog")}
        />
      </div>
    </div>
  );
}
