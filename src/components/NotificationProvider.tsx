"use client";

import { createContext, useContext, ReactNode } from "react";
import { useNotifications } from "@/hooks/useNotifications";
import { NotificationContainer } from "./Notification";

interface NotificationContextType {
    notifications: ReturnType<typeof useNotifications>["notifications"];
    addNotification: ReturnType<typeof useNotifications>["addNotification"];
    removeNotification: ReturnType<typeof useNotifications>["removeNotification"];
    clearAllNotifications: ReturnType<typeof useNotifications>["clearAllNotifications"];
    showSuccess: ReturnType<typeof useNotifications>["showSuccess"];
    showError: ReturnType<typeof useNotifications>["showError"];
    showWarning: ReturnType<typeof useNotifications>["showWarning"];
    showInfo: ReturnType<typeof useNotifications>["showInfo"];
    showInvestmentSuccess: ReturnType<typeof useNotifications>["showInvestmentSuccess"];
    showInsufficientFunds: ReturnType<typeof useNotifications>["showInsufficientFunds"];
    showInvestmentError: ReturnType<typeof useNotifications>["showInvestmentError"];
    showApprovalSuccess: ReturnType<typeof useNotifications>["showApprovalSuccess"];
    showApprovalError: ReturnType<typeof useNotifications>["showApprovalError"];
    showTipSuccess: ReturnType<typeof useNotifications>["showTipSuccess"];
    showTipError: ReturnType<typeof useNotifications>["showTipError"];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotificationContext() {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error("useNotificationContext must be used within a NotificationProvider");
    }
    return context;
}

interface NotificationProviderProps {
    children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
    const notificationHooks = useNotifications();

    return (
        <NotificationContext.Provider value={notificationHooks}>
            {children}
            <NotificationContainer
                notifications={notificationHooks.notifications}
                onClose={notificationHooks.removeNotification}
            />
        </NotificationContext.Provider>
    );
}
