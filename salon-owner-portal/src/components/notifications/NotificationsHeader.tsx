"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface NotificationsHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
}

export default function NotificationsHeader({
  unreadCount,
  onMarkAllAsRead,
}: NotificationsHeaderProps) {
  return (
    <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-[#E2E8F0]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-[#1E293B] font-manrope">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <Badge variant="danger" size="sm">
                {unreadCount} New
              </Badge>
            )}
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Stay updated with appointments, sales, and alerts.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={onMarkAllAsRead}
            disabled={unreadCount === 0}
            className="bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#1E293B] px-5 py-2.5 rounded-lg font-bold text-[13px] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-[#E2E8F0]"
          >
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            Mark all as read
          </button>
        </div>
      </div>
    </div>
  );
}
