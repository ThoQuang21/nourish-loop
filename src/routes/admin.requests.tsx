import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, MapPin, ShieldCheck, Star, X } from "lucide-react";
import { foodPosts, getProvider, requests, type Request } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/requests")({
  component: AdminRequestsPage,
});

const STATUS: Record<Request["status"], { label: string; cls: string }> = {
  pending: { label: "Chờ duyệt", cls: "bg-amber-500/15 text-amber-600" },
  accepted: { label: "Đã chấp nhận", cls: "bg-primary-soft/40 text-primary" },
  completed: { label: "Hoàn thành", cls: "bg-muted text-muted-foreground" },
  rejected: { label: "Từ chối", cls: "bg-destructive/15 text-destructive" },
  cancelled: { label: "Đã hủy", cls: "bg-muted text-muted-foreground" },
};

function AdminRequestsPage() {
  const [items, setItems] = useState(requests);
  const [filter, setFilter] = useState<Request["status"] | "all">("all");

  const list = filter === "all" ? items : items.filter((r) => r.status === filter);

  function updateStatus(id: string, status: Request["status"]) {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Theo dõi giao dịch</h1>
        <p className="text-muted-foreground mt-1">
          Giám sát toàn bộ yêu cầu nhận thực phẩm trên nền tảng.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-6">
        {(
          [
            ["all", "Tất cả"],
            ["pending", "Chờ duyệt"],
            ["accepted", "Đã chấp nhận"],
            ["completed", "Hoàn thành"],
            ["rejected", "Từ chối"],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              filter === k
                ? "bg-foreground text-background"
                : "bg-card border border-border hover:bg-secondary"
            }`}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {list.map((r) => {
          const post = foodPosts.find((p) => p.id === r.postId);
          const provider = post ? getProvider(post.providerId) : null;
          const s = STATUS[r.status];

          return (
            <div
              key={r.id}
              className="bg-card border border-border rounded-2xl p-5 shadow-card"
            >
              <div className="flex flex-wrap gap-5 items-start">
                {post && (
                  <img src={post.image} alt="" className="size-20 rounded-xl object-cover" />
                )}
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.cls}`}>
                      {s.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{r.createdAt}</span>
                  </div>
                  <div className="font-bold text-lg mt-2">{post?.title ?? "—"}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {provider?.org} → {r.receiverOrg}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs">
                    <span className="font-semibold">{r.receiverName}</span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <MapPin className="size-3.5" /> {r.distanceKm} km
                    </span>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Star className="size-3.5 fill-accent text-accent" /> {r.trustScore}
                    </span>
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 text-primary font-semibold">
                        <ShieldCheck className="size-3.5" /> Đã xác minh
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {r.status === "pending" && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <button
                    onClick={() => updateStatus(r.id, "accepted")}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
                  >
                    <Check className="size-4" /> Can thiệp: Chấp nhận
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, "rejected")}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-border font-semibold text-sm hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="size-4" /> Từ chối
                  </button>
                </div>
              )}

              {r.status === "accepted" && (
                <div className="mt-4 pt-4 border-t border-border">
                  <button
                    onClick={() => updateStatus(r.id, "completed")}
                    className="px-4 py-2 rounded-xl bg-accent text-accent-foreground font-semibold text-sm"
                  >
                    Đánh dấu hoàn thành
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {list.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">Không có giao dịch nào.</div>
        )}
      </div>
    </div>
  );
}
