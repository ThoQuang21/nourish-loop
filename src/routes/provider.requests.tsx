import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, MapPin, ShieldCheck, Star, X } from "lucide-react";
import {
  listIncomingRequests,
  respondToRequest,
  type IncomingRequestDTO,
} from "@/lib/api";

export const Route = createFileRoute("/provider/requests")({
  component: RequestsPage,
});

function RequestsPage() {
  const [items, setItems] = useState<IncomingRequestDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setItems(await listIncomingRequests());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được yêu cầu");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function respond(id: string, status: "ACCEPTED" | "REJECTED") {
    setBusy(id);
    setError(null);
    try {
      await respondToRequest(id, status);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không cập nhật được yêu cầu");
    } finally {
      setBusy(null);
    }
  }

  const pendingCount = items.filter((r) => r.status === "pending").length;

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Quản lý yêu cầu nhận</h1>
        <p className="text-muted-foreground mt-1">{pendingCount} yêu cầu đang chờ phản hồi.</p>
      </header>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {loading ? (
        <div className="text-sm text-muted-foreground p-10 text-center">Đang tải...</div>
      ) : items.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-3xl p-16 text-center text-sm text-muted-foreground">
          Chưa có yêu cầu nào tới các bài đăng của bạn.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((r) => (
            <div
              key={r.id}
              className="bg-card border border-border rounded-2xl p-5 shadow-card flex flex-wrap gap-5 items-center"
            >
              <div className="flex-1 min-w-[200px]">
                <div className="font-bold text-lg">{r.receiverName}</div>
                <div className="text-sm text-muted-foreground">{r.receiverOrg}</div>
                <div className="flex flex-wrap gap-4 mt-3 text-xs">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <MapPin className="size-3.5" /> {r.distanceKm} km
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Star className="size-3.5 fill-accent text-accent" /> {r.trustScore} điểm uy tín
                  </span>
                  {r.verified && (
                    <span className="inline-flex items-center gap-1 text-primary font-semibold">
                      <ShieldCheck className="size-3.5" /> Đã xác minh
                    </span>
                  )}
                  <span className="text-muted-foreground">· {r.createdAt}</span>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                {r.status === "pending" ? (
                  <>
                    <button
                      onClick={() => respond(r.id, "ACCEPTED")}
                      disabled={busy === r.id}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 disabled:opacity-60"
                    >
                      <Check className="size-4" /> Chấp nhận
                    </button>
                    <button
                      onClick={() => respond(r.id, "REJECTED")}
                      disabled={busy === r.id}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-border font-semibold text-sm hover:bg-destructive/10 hover:text-destructive disabled:opacity-60"
                    >
                      <X className="size-4" /> Từ chối
                    </button>
                  </>
                ) : r.status === "accepted" ? (
                  <span className="text-sm font-semibold text-primary">
                    Đã chấp nhận{r.qrCode ? ` · QR: ${r.qrCode}` : ""}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground capitalize">{r.status}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
