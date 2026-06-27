import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  BookOpen,
  ClipboardList,
  LayoutDashboard,
  Package,
  ShieldCheck,
  Users,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AppShell
      role="admin"
      nav={[
        { to: "/admin", label: "Tổng quan", icon: <LayoutDashboard className="size-5" /> },
        { to: "/admin/verifications", label: "Xác minh", icon: <ShieldCheck className="size-5" /> },
        { to: "/admin/users", label: "Người dùng", icon: <Users className="size-5" /> },
        { to: "/admin/posts", label: "Bài đăng", icon: <Package className="size-5" /> },
        { to: "/admin/requests", label: "Giao dịch", icon: <ClipboardList className="size-5" /> },
        { to: "/admin/stories", label: "Câu chuyện", icon: <BookOpen className="size-5" /> },
      ]}
    >
      <Outlet />
    </AppShell>
  );
}
