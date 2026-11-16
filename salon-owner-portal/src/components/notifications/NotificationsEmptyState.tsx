import React from "react";
import { Bell } from "lucide-react";

export default function NotificationsEmptyState() {
  return (
    <div className="p-12 text-center">
      <div className="w-16 h-16 bg-[#F8FAFC] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E2E8F0]">
        <Bell className="w-8 h-8 text-[#94A3B8]" />
      </div>
      <h3 className="text-[16px] font-bold text-[#1E293B] font-manrope mb-1">
        No notifications yet
      </h3>
      <p className="text-[13px] text-[#64748B] font-medium">
        You're all caught up! New alerts will appear here.
      </p>
    </div>
  );
}
