import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import {
  confirmReceived,
  getCurrentUser,
  listMyRequests,
  type ReceiverRequestDTO,
} from "@/lib/api";

export const Route = createFileRoute("/receiver/requests")({
  component: MyRequests,
});

const TABS = [
  { k: "PENDING", label: "Đang chờ" },
  { k: "ACCEPTED", label: "Đã chấp nhận" },
  { k: "COMPLETED", label: "Hoàn thành" },
  { k: "CANCELLED", label: "Đã hủy" },
];

function MyRequests() {
  const [tab, setTab] = useState("PENDING");
  const [items, setItems] = useState<ReceiverRequestDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const me = getCurrentUser();

  async function load() {
    if (!me) {
      setLoading(false);
      setError("Vui lòng đăng nhập để xem yêu cầu của bạn.");
      return;
    }
    try {
      setItems(await listMyRequests({ receiverId: me.id }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được yêu cầu");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function confirm(id: string) {
    setBusy(id);
    setError(null);
    try {
      await confirmReceived(id);
      setTab("COMPLETED");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Xác nhận thất bại");
    } finally {
      setBusy(null);
    }
  }

  const list = items.filter((i) => i.status === tab);
  const countOf = (k: string) => items.filter((i) => i.status === k).length;

  return (
    <div className="p-6 lg:p-10 max-w-4xl mx-auto">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Yêu cầu của tôi</h1>
        <p className="text-muted-foreground mt-1">Theo dõi các yêu cầu nhận thực phẩm.</p>
      </header>

      <div className="flex flex-wrap gap-1 bg-card border border-border rounded-full p-1 mb-6 w-fit">
        {TABS.map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              tab === t.k ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label} <span className="opacity-70">({countOf(t.k)})</span>
          </button>
        ))}
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {loading ? (
        <div className="text-sm text-muted-foreground p-10 text-center">Đang tải...</div>
      ) : list.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-3xl p-16 text-center text-sm text-muted-foreground">
          Không có yêu cầu nào.
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((i) => (
            <div
              key={i.id}
              className="bg-card border border-border rounded-2xl p-4 flex gap-4 items-center"
            >
              <Link
                to="/receiver/food/$id"
                params={{ id: i.postId }}
                className="flex gap-4 items-center flex-1 min-w-0 hover:opacity-90"
              >
                <img
                  src={i.post?.imageUrl ?? ""}
                  alt=""
                  className="size-20 rounded-xl object-cover bg-muted shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold line-clamp-1">{i.post?.title ?? "Tin đã xoá"}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {i.post?.weightKg ?? "?"}kg · {i.post?.district ?? "—"}
                  </div>
                  {i.message && (
                    <div className="text-xs text-muted-foreground mt-1 line-clamp-1">“{i.message}”</div>
                  )}
                </div>
              </Link>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <StatusBadge status={i.status} />
                {i.status === "ACCEPTED" && (
                  <button
                    onClick={() => confirm(i.id)}
                    disabled={busy === i.id}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-60"
                  >
                    <Check className="size-3.5" /> {busy === i.id ? "Đang xác nhận..." : "Xác nhận đã nhận"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { l: string; c: string }> = {
    PENDING: { l: "Đang chờ", c: "bg-accent-soft text-accent-foreground" },
    ACCEPTED: { l: "Đã chấp nhận", c: "bg-primary-soft/40 text-primary" },
    COMPLETED: { l: "Hoàn thành", c: "bg-secondary text-muted-foreground" },
    REJECTED: { l: "Bị từ chối", c: "bg-destructive/15 text-destructive" },
    CANCELLED: { l: "Đã hủy", c: "bg-destructive/15 text-destructive" },
  };
  const s = map[status] ?? { l: status, c: "bg-secondary text-muted-foreground" };
  return <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${s.c}`}>{s.l}</span>;
}
