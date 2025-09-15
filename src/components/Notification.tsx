"use client";

import { useState, useEffect, useCallback } from "react";
import { CheckCircle, XCircle, AlertCircle, ExternalLink, X } from "lucide-react";
import { getBaseSepoliaTxUrl } from "@/utils/transactionUtils";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface NotificationData {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    txHash?: string;
    duration?: number;
}

interface NotificationProps {
    notification: NotificationData;
    onClose: (id: string) => void;
}

export function Notification({ notification, onClose }: NotificationProps) {
    const [isVisible, setIsVisible] = useState(false);

    const handleClose = useCallback(() => {
        setIsVisible(false);
        setTimeout(() => onClose(notification.id), 300);
    }, [onClose, notification.id]);

    useEffect(() => {
        // Trigger animation
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        // Auto-close after duration
        if (notification.duration !== 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, notification.duration || 5000);
            return () => clearTimeout(timer);
        }
    }, [notification.duration, handleClose]);

    const getIcon = () => {
        switch (notification.type) {
            case "success":
                return <CheckCircle className="h-5 w-5 text-green-400" />;
            case "error":
                return <XCircle className="h-5 w-5 text-red-400" />;
            case "warning":
                return <AlertCircle className="h-5 w-5 text-yellow-400" />;
            case "info":
                return <AlertCircle className="h-5 w-5 text-blue-400" />;
            default:
                return <AlertCircle className="h-5 w-5 text-gray-400" />;
        }
    };

    const getBackgroundColor = () => {
        switch (notification.type) {
            case "success":
                return "bg-green-900/20 border-green-500/30";
            case "error":
                return "bg-red-900/20 border-red-500/30";
            case "warning":
                return "bg-yellow-900/20 border-yellow-500/30";
            case "info":
                return "bg-blue-900/20 border-blue-500/30";
            default:
                return "bg-gray-900/20 border-gray-500/30";
        }
    };

    const getBaseSepoliaUrl = (txHash: string) => {
        return getBaseSepoliaTxUrl(txHash);
    };

    return (
        <div
            className={`
        fixed top-4 right-4 z-50 max-w-sm w-full
        ${getBackgroundColor()}
        backdrop-blur-sm rounded-lg border p-4
        transform transition-all duration-300 ease-in-out
        ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
        >
            <div className="flex items-start space-x-3">
                {getIcon()}
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-white mb-1">
                        {notification.title}
                    </h4>
                    <p className="text-sm text-gray-300 mb-2">
                        {notification.message}
                    </p>
                    {notification.txHash && (
                        <a
                            href={getBaseSepoliaUrl(notification.txHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <span>View on Base Sepolia</span>
                            <ExternalLink className="h-3 w-3" />
                        </a>
                    )}
                </div>
                <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-white transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

interface NotificationContainerProps {
    notifications: NotificationData[];
    onClose: (id: string) => void;
}

export function NotificationContainer({ notifications, onClose }: NotificationContainerProps) {
    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map((notification) => (
                <Notification
                    key={notification.id}
                    notification={notification}
                    onClose={onClose}
                />
            ))}
        </div>
    );
}
