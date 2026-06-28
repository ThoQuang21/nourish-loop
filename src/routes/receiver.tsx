import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Heart, History, Map, MessageCircle, QrCode, Settings } from "lucide-react";

export const Route = createFileRoute("/receiver")({
  component: ReceiverLayout,
});

function ReceiverLayout() {
  return (
    <AppShell
      role="receiver"
      nav={[
        { to: "/receiver", label: "Bản đồ", icon: <Map className="size-5" /> },
        { to: "/receiver/requests", label: "Yêu cầu", icon: <Heart className="size-5" /> },
        { to: "/receiver/scan", label: "Nhận hàng", icon: <QrCode className="size-5" /> },
        { to: "/receiver/history", label: "Lịch sử", icon: <History className="size-5" /> },
        { to: "/receiver/stories", label: "Câu chuyện", icon: <MessageCircle className="size-5" /> },
        { to: "/receiver/settings", label: "Cài đặt", icon: <Settings className="size-5" /> },
      ]}
    >
      <Outlet />
    </AppShell>
  );
}
