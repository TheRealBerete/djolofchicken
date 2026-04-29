import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { NotificationToast } from "./NotificationToast";
import { useNotifications } from "@/hooks/useNotifications";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { notifications, dismiss } = useNotifications();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
      <NotificationToast notifications={notifications} onDismiss={dismiss} />
    </div>
  );
}
