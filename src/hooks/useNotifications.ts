import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { playNotificationSound } from "@/lib/notifications";

export interface AppNotification {
  id: number;
  orderId: number;
  reference: string | null;
  customerName: string;
  createdAt: number;
  dismissed: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "djolof_orders" },
        (payload) => {
          const order = payload.new as { id: number; reference: string | null; customer_name: string };
          const notification: AppNotification = {
            id: Date.now(),
            orderId: order.id,
            reference: order.reference || null,
            customerName: order.customer_name,
            createdAt: Date.now(),
            dismissed: false,
          };

          playNotificationSound();
          setNotifications((prev) => [notification, ...prev].slice(0, 10));

          // Auto-dismiss after 8 seconds
          setTimeout(() => {
            setNotifications((prev) =>
              prev.map((n) =>
                n.id === notification.id ? { ...n, dismissed: true } : n
              )
            );
          }, 8000);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const dismiss = useCallback((id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, dismissed: true } : n))
    );
  }, []);

  return { notifications, dismiss };
}
