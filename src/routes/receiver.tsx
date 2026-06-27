import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Heart, Map, MessageCircle, QrCode, History } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/receiver")({
  component: ReceiverLayout,
});

function ReceiverLayout() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/auth/login" />;
  if (user?.role !== "receiver") return <Navigate to="/provider" />;

  return (
    <AppShell
      role="receiver"
      nav={[
        { to: "/receiver", label: "Bản đồ", icon: <Map className="size-5" /> },
        { to: "/receiver/requests", label: "Yêu cầu", icon: <Heart className="size-5" /> },
        { to: "/receiver/scan", label: "Nhận hàng", icon: <QrCode className="size-5" /> },
        { to: "/receiver/history", label: "Lịch sử", icon: <History className="size-5" /> },
        { to: "/receiver/stories", label: "Câu chuyện", icon: <MessageCircle className="size-5" /> },
      ]}
    >
      <Outlet />
    </AppShell>
  );
}
