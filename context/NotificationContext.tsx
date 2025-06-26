import React, { createContext, useContext, useState } from 'react';

const NotificationContext = createContext<any>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<any[]>([]);

  const addNotification = (notification: { message: string; type?: string }) => {
    setNotifications((prev: any[]) => [
      { ...notification, read: false, timestamp: new Date().toISOString() },
      ...prev,
    ]);
  };

  const markAllAsRead = () => {
    setNotifications((prev: any[]) => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, addNotification, markAllAsRead, clearNotifications, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
} 