import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertCircle, ArrowLeft, Bell, CheckCircle2, Clock, Inbox } from "lucide-react";
import {
  getCurrentUser,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationDTO,
} from "@/lib/api";

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
  const [items, setItems] = useState<NotificationDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const me = getCurrentUser();
  const nav = useNavigate();

  function openNotif(n: NotificationDTO) {
    if (n.unread) void markOne(n.id);
    if (n.postId) {
      if (me?.role === "PROVIDER") {
        nav({ to: "/provider/post/$id", params: { id: n.postId } });
      } else {
        nav({ to: "/receiver/food/$id", params: { id: n.postId } });
      }
    }
  }

  async function load() {
    setError(null);
    try {
      setItems(await listNotifications());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được thông báo");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!me) {
      setLoading(false);
      setError("Vui lòng đăng nhập để xem thông báo.");
      return;
    }
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function markAll() {
    await markAllNotificationsRead().catch(() => undefined);
    await load();
  }

  async function markOne(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    await markNotificationRead(id).catch(() => undefined);
  }

  const unreadCount = items.filter((n) => n.unread).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-6 lg:p-10">
        <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground mb-5">
          <ArrowLeft className="size-4" /> Quay lại
        </Link>
        <header className="flex items-end justify-between mb-6">
          <h1 className="text-3xl font-bold">
            Thông báo {unreadCount > 0 && <span className="text-primary">({unreadCount})</span>}
          </h1>
          {unreadCount > 0 && (
            <button onClick={markAll} className="text-sm font-semibold text-primary hover:underline">
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </header>

        {error && <p className="text-sm text-destructive mb-4">{error}</p>}

        {loading ? (
          <div className="text-sm text-muted-foreground p-10 text-center">Đang tải...</div>
        ) : items.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-3xl p-16 text-center text-sm text-muted-foreground">
            Chưa có thông báo nào.
          </div>
        ) : (
          <div className="bg-card border border-border rounded-3xl divide-y divide-border shadow-card overflow-hidden">
            {items.map((n) => (
              <button
                key={n.id}
                onClick={() => openNotif(n)}
                className={`w-full text-left p-4 flex gap-4 transition ${n.unread ? "bg-primary-soft/10 hover:bg-primary-soft/20" : "hover:bg-secondary/40"}`}
              >
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
                  {n.postId && (
                    <div className="text-xs font-semibold text-primary mt-1">Xem bài đăng →</div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
