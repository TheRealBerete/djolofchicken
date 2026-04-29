import { useEffect, useState } from "react";
import { X, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/hooks/useNotifications";

interface Props {
  notifications: AppNotification[];
  onDismiss: (id: number) => void;
}

export function NotificationToast({ notifications, onDismiss }: Props) {
  const visible = notifications.filter((n) => !n.dismissed);

  if (visible.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {visible.map((n) => (
        <div
          key={n.id}
          className={cn(
            "flex items-start gap-3 rounded-lg border bg-card p-4 shadow-lg animate-slide-up",
            "border-brand/40 dark:border-brand/20"
          )}
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand/20">
            <Bell className="h-4 w-4 text-brand-dark dark:text-brand" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Nouvelle commande !</p>
            <p className="text-sm text-muted-foreground truncate">
              #{n.orderId} — {n.customerName}
            </p>
          </div>
          <button
            onClick={() => onDismiss(n.id)}
            className="flex-shrink-0 rounded p-1 hover:bg-muted transition-colors"
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>
      ))}
    </div>
  );
}
