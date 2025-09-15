"use client";

import { useState, useCallback } from "react";
import { NotificationData } from "@/components/Notification";

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);

  const addNotification = useCallback((notification: Omit<NotificationData, "id">) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newNotification: NotificationData = {
      id,
      duration: 5000, // 5 seconds default
      ...notification,
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Helper functions for common notification types
  const showSuccess = useCallback((title: string, message: string, txHash?: string) => {
    return addNotification({
      type: "success",
      title,
      message,
      txHash,
      duration: 7000, // Success notifications stay longer
    });
  }, [addNotification]);

  const showError = useCallback((title: string, message: string) => {
    return addNotification({
      type: "error",
      title,
      message,
      duration: 8000, // Error notifications stay longer
    });
  }, [addNotification]);

  const showWarning = useCallback((title: string, message: string) => {
    return addNotification({
      type: "warning",
      title,
      message,
      duration: 6000,
    });
  }, [addNotification]);

  const showInfo = useCallback((title: string, message: string) => {
    return addNotification({
      type: "info",
      title,
      message,
      duration: 5000,
    });
  }, [addNotification]);

  // Investment-specific notification helpers
  const showInvestmentSuccess = useCallback((amount: number, trackTitle: string, txHash: string) => {
    return showSuccess(
      "Investment Successful! 🎉",
      `You've invested $${amount} USDC in "${trackTitle}". Funds sent to artist wallet (0x44eAD8980ea70901206dd72Ea452E2F336CE9452). You'll receive ${15}% of streaming royalties!`,
      txHash
    );
  }, [showSuccess]);

  const showInsufficientFunds = useCallback((required: number, available: number) => {
    return showError(
      "Insufficient Funds 💸",
      `You need $${required} USDC but only have $${available} USDC. Please add more USDC to your wallet.`
    );
  }, [showError]);

  const showInvestmentError = useCallback((error: string) => {
    return showError(
      "Investment Failed ❌",
      `Something went wrong: ${error}. Please try again.`
    );
  }, [showError]);

  const showApprovalSuccess = useCallback((amount: number) => {
    return showSuccess(
      "USDC Approved ✅",
      `You've approved $${amount} USDC for investment. You can now invest in tracks!`
    );
  }, [showSuccess]);

  const showApprovalError = useCallback((error: string) => {
    return showError(
      "Approval Failed ❌",
      `USDC approval failed: ${error}. Please try again.`
    );
  }, [showError]);

  const showTipSuccess = useCallback((amount: number, artistName: string, txHash: string) => {
    return showSuccess(
      "Tip Sent! 💝",
      `You've tipped $${amount} USDC to ${artistName} (0x44eAD8980ea70901206dd72Ea452E2F336CE9452). They'll love your support!`,
      txHash
    );
  }, [showSuccess]);

  const showTipError = useCallback((error: string) => {
    return showError(
      "Tip Failed ❌",
      `Failed to send tip: ${error}. Please try again.`
    );
  }, [showError]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showInvestmentSuccess,
    showInsufficientFunds,
    showInvestmentError,
    showApprovalSuccess,
    showApprovalError,
    showTipSuccess,
    showTipError,
  };
}
