"use client";

import React from "react";
import { Bell, Check, Calendar, AlertCircle, ShoppingBag } from "lucide-react";
import { NotificationItem, NotificationType } from "./types";

interface NotificationItemRowProps {
  notification: NotificationItem;
  onMarkAsRead: (id: string) => void;
}

export default function NotificationItemRow({
  notification,
  onMarkAsRead,
}: NotificationItemRowProps) {
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "appointment":
        return <Calendar className="w-5 h-5 text-[#635BFF]" />;
      case "sale":
        return <ShoppingBag className="w-5 h-5 text-[#10B981]" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-[#EF4444]" />;
      case "system":
        return <Bell className="w-5 h-5 text-[#64748B]" />;
      default:
        return <Bell className="w-5 h-5 text-[#64748B]" />;
    }
  };

  const getIconBg = (type: NotificationType) => {
    switch (type) {
      case "appointment":
        return "bg-[#E0E7FF]";
      case "sale":
        return "bg-[#D1FAE5]";
      case "alert":
        return "bg-[#FEE2E2]";
      case "system":
        return "bg-[#F1F5F9]";
      default:
        return "bg-[#F1F5F9]";
    }
  };

  return (
    <div
      className={`p-6 sm:p-8 transition-colors flex items-start gap-4 sm:gap-6 relative group ${
        notification.isRead ? "bg-white hover:bg-slate-50/50" : "bg-[#F8F9FE]"
      }`}
    >
      {!notification.isRead && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#635BFF]" />
      )}

      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getIconBg(
          notification.type,
        )}`}
      >
        {getIcon(notification.type)}
      </div>

      <div className="flex-1 min-w-0 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
          <h3
            className={`text-[15px] font-manrope truncate ${
              notification.isRead
                ? "font-semibold text-[#1E293B]"
                : "font-bold text-[#1E293B]"
            }`}
          >
            {notification.title}
          </h3>
          <span className="text-[12px] font-medium text-[#94A3B8] shrink-0 whitespace-nowrap">
            {notification.time}
          </span>
        </div>
        <p
          className={`text-[13px] leading-relaxed max-w-3xl ${
            notification.isRead
              ? "text-[#64748B] font-medium"
              : "text-[#475569] font-bold"
          }`}
        >
          {notification.message}
        </p>
      </div>

      {!notification.isRead && (
        <div className="shrink-0 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onMarkAsRead(notification.id)}
            className="p-1.5 text-[#94A3B8] hover:text-[#10B981] hover:bg-[#D1FAE5] rounded-full transition-colors"
            title="Mark as read"
          >
            <Check className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
