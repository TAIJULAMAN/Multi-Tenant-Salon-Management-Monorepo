"use client";

import React, { useState } from "react";
import NotificationsHeader from "@/components/notifications/NotificationsHeader";
import NotificationItemRow from "@/components/notifications/NotificationItemRow";
import NotificationsEmptyState from "@/components/notifications/NotificationsEmptyState";
import { MOCK_NOTIFICATIONS } from "@/components/notifications/data";
import { NotificationItem } from "@/components/notifications/types";

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  return (
    <div className="w-full space-y-6 pb-12">
      <NotificationsHeader
        unreadCount={unreadCount}
        onMarkAllAsRead={markAllAsRead}
      />

      <div className="bg-white rounded-lg shadow-sm border border-[#E2E8F0] overflow-hidden">
        {notifications.length > 0 ? (
          <div className="divide-y divide-[#E2E8F0]">
            {notifications.map((notification) => (
              <NotificationItemRow
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
              />
            ))}
          </div>
        ) : (
          <NotificationsEmptyState />
        )}
      </div>
    </div>
  );
}
