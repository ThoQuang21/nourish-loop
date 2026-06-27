import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { foodPosts } from "@/lib/mock-data";

export const Route = createFileRoute("/receiver/requests")({
  component: MyRequests,
});

const TABS = [
  { k: "pending", label: "Đang chờ", count: 2 },
  { k: "accepted", label: "Đã chấp nhận", count: 1 },
  { k: "completed", label: "Hoàn thành", count: 8 },
  { k: "cancelled", label: "Đã hủy", count: 1 },
];

const ITEMS = [
  { postId: "f2", status: "pending", time: "10 phút trước" },
  { postId: "f3", status: "pending", time: "1 giờ trước" },
  { postId: "f4", status: "accepted", time: "Hôm nay 13:20" },
  { postId: "f7", status: "completed", time: "Hôm qua" },
  { postId: "f1", status: "completed", time: "3 ngày trước" },
];

function MyRequests() {
  const [tab, setTab] = useState("pending");
  const list = ITEMS.filter((i) => i.status === tab);

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
            {t.label} <span className="opacity-70">({t.count})</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-3xl p-16 text-center text-sm text-muted-foreground">
          Không có yêu cầu nào.
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((i, idx) => {
            const p = foodPosts.find((x) => x.id === i.postId)!;
            return (
              <Link
                key={idx}
                to="/receiver/food/$id"
                params={{ id: p.id }}
                className="bg-card border border-border rounded-2xl p-4 flex gap-4 items-center hover:shadow-soft transition"
              >
                <img src={p.image} alt="" className="size-20 rounded-xl object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold line-clamp-1">{p.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{p.weightKg}kg · {p.district}</div>
                  <div className="text-xs text-muted-foreground mt-1">Cập nhật: {i.time}</div>
                </div>
                <StatusBadge status={i.status} />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { l: string; c: string }> = {
    pending: { l: "Đang chờ", c: "bg-accent-soft text-accent-foreground" },
    accepted: { l: "Đã chấp nhận", c: "bg-primary-soft/40 text-primary" },
    completed: { l: "Hoàn thành", c: "bg-secondary text-muted-foreground" },
    cancelled: { l: "Đã hủy", c: "bg-destructive/15 text-destructive" },
  };
  const s = map[status];
  return <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${s.c}`}>{s.l}</span>;
}
