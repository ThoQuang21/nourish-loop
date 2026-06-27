import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { BarChart3, History, LayoutDashboard, PackagePlus, Inbox } from "lucide-react";

export const Route = createFileRoute("/provider")({
  component: ProviderLayout,
});

function ProviderLayout() {
  return (
    <AppShell
      role="provider"
      nav={[
        { to: "/provider", label: "Tổng quan", icon: <LayoutDashboard className="size-5" /> },
        { to: "/provider/create", label: "Đăng thực phẩm", icon: <PackagePlus className="size-5" /> },
        { to: "/provider/posts", label: "Bài đăng", icon: <History className="size-5" /> },
        { to: "/provider/requests", label: "Yêu cầu nhận", icon: <Inbox className="size-5" /> },
        { to: "/provider/esg", label: "ESG", icon: <BarChart3 className="size-5" /> },
      ]}
    >
      <Outlet />
    </AppShell>
  );
}
