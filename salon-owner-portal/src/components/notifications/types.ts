export type NotificationType = "appointment" | "system" | "sale" | "alert";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}
