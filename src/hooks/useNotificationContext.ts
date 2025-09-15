"use client";

import { useNotificationContext } from "@/components/NotificationProvider";

export function useNotifications() {
  return useNotificationContext();
}
