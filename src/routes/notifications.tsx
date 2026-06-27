import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, Bell, CheckCircle2, Clock, Inbox } from "lucide-react";
import { notifications } from "@/lib/mock-data";

export const Route = createFileRoute("/notifications")({
  component: NotificationsPage,
});

const icon = (t: string) => {
  switch (t) {
    case "request": return <Inbox className="size-5" />;
    case "accepted": return <CheckCircle2 className="size-5" />;
    case "reminder": return <Clock className="size-5" />;
    case "expiring": return <AlertCircle className="size-5" />;
    default: return <Bell className="size-5" />;
  }
};

function NotificationsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6 lg:p-10">
        <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground mb-5">
          <ArrowLeft className="size-4" /> Quay lại
        </Link>
        <header className="flex items-end justify-between mb-6">
          <h1 className="text-3xl font-bold">Thông báo</h1>
          <button className="text-sm font-semibold text-primary">Đánh dấu tất cả đã đọc</button>
        </header>

        <div className="bg-card border border-border rounded-3xl divide-y divide-border shadow-card overflow-hidden">
          {notifications.map((n) => (
            <div key={n.id} className={`p-4 flex gap-4 ${n.unread ? "bg-primary-soft/10" : ""}`}>
              <div className={`size-10 rounded-xl grid place-items-center flex-shrink-0 ${
                n.type === "expiring" ? "bg-destructive/15 text-destructive" :
                n.type === "accepted" ? "bg-primary-soft/40 text-primary" :
                n.type === "reminder" ? "bg-accent-soft text-accent-foreground" :
                "bg-secondary text-foreground"
              }`}>
                {icon(n.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <div className="font-semibold">{n.title}</div>
                  {n.unread && <span className="size-2 rounded-full bg-primary" />}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>
                <div className="text-xs text-muted-foreground mt-2">{n.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
