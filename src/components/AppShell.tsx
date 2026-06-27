import { Link, useRouterState } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

interface AppShellProps {
  role: "provider" | "receiver" | "admin";
  nav: NavItem[];
  children: ReactNode;
}

const ROLE_LABELS: Record<AppShellProps["role"], string> = {
  provider: "Nhà cung cấp",
  receiver: "Người nhận",
  admin: "Quản trị viên",
};

export function AppShell({ role, nav, children }: AppShellProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const roleLabel = ROLE_LABELS[role];

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar sticky top-0 h-screen">
        <Link to="/" className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <div className="size-9 rounded-xl bg-primary text-primary-foreground grid place-items-center">
            <Leaf className="size-5" />
          </div>
          <div>
            <div className="font-display font-bold text-lg leading-none">Food Life</div>
            <div className="text-xs text-muted-foreground mt-1">{roleLabel}</div>
          </div>
        </Link>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => {
            const active =
              pathname === item.to || (item.to !== `/${role}` && pathname.startsWith(item.to));
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  active
                    ? "bg-primary-soft/40 text-primary"
                    : "text-foreground/70 hover:bg-secondary hover:text-foreground",
                )}
              >
                <span className={cn("size-5", active && "text-primary")}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-border">
          <Link
            to={role === "admin" ? "/admin" : "/profile"}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-secondary transition-colors"
          >
            <img
              src={
                role === "admin"
                  ? "https://i.pravatar.cc/80?img=68"
                  : "https://i.pravatar.cc/80?img=11"
              }
              alt=""
              className="size-9 rounded-full object-cover"
            />
            <div className="text-sm">
              <div className="font-semibold leading-tight">
                {role === "admin" ? "Admin Food Life" : "Minh Anh"}
              </div>
              <div className="text-xs text-muted-foreground">
                {role === "admin" ? "Bảng điều khiển" : "Xem hồ sơ"}
              </div>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-border bg-card sticky top-0 z-30">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-primary text-primary-foreground grid place-items-center">
              <Leaf className="size-4" />
            </div>
            <span className="font-display font-bold">Food Life</span>
          </Link>
          <Link to="/notifications" className="text-sm text-primary font-medium">
            Thông báo
          </Link>
        </div>
        {children}

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-card border-t border-border z-40">
          <div className="grid grid-cols-5">
            {nav.slice(0, 5).map((item) => {
              const active =
                pathname === item.to || (item.to !== `/${role}` && pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 gap-0.5 text-[10px]",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <span className="size-5">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="md:hidden h-16" />
      </div>
    </div>
  );
}
