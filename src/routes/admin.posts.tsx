import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Ban, Eye, Scale } from "lucide-react";
import { foodPosts, getProvider, type FoodPost } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/posts")({
  component: AdminPostsPage,
});

const STATUS: Record<FoodPost["status"], { label: string; cls: string }> = {
  open: { label: "Đang mở", cls: "bg-primary-soft/40 text-primary" },
  matched: { label: "Đã có người nhận", cls: "bg-accent-soft text-accent-foreground" },
  completed: { label: "Hoàn thành", cls: "bg-muted text-muted-foreground" },
  expired: { label: "Hết hạn", cls: "bg-destructive/15 text-destructive" },
};

function AdminPostsPage() {
  const [posts, setPosts] = useState(foodPosts);
  const [filter, setFilter] = useState<string>("all");

  const list = filter === "all" ? posts : posts.filter((p) => p.status === filter);

  function forceExpire(id: string) {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: "expired" as const } : p)));
  }

  function removePost(id: string) {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Kiểm duyệt bài đăng</h1>
        <p className="text-muted-foreground mt-1">
          {posts.length} bài đăng trên nền tảng · {posts.filter((p) => p.status === "open").length} đang mở
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-6">
        {(
          [
            ["all", "Tất cả"],
            ["open", "Đang mở"],
            ["matched", "Đã có người nhận"],
            ["completed", "Hoàn thành"],
            ["expired", "Hết hạn"],
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

      <div className="space-y-3">
        {list.map((p) => {
          const provider = getProvider(p.providerId);
          const s = STATUS[p.status];
          return (
            <div
              key={p.id}
              className="bg-card border border-border rounded-2xl p-4 shadow-card flex flex-wrap gap-4 items-center"
            >
              <img src={p.image} alt="" className="size-16 rounded-xl object-cover" />
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold">{p.title}</h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.cls}`}>
                    {s.label}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {provider.org} · {p.district} · {p.category}
                </div>
                <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1">
                    <Scale className="size-3" /> {p.weightKg}kg
                  </span>
                  <span>{p.pickupWindow}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/receiver/food/$id"
                  params={{ id: p.id }}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-secondary text-xs font-semibold hover:bg-secondary/80"
                >
                  <Eye className="size-3.5" /> Xem
                </Link>
                {p.status === "open" && (
                  <button
                    onClick={() => forceExpire(p.id)}
                    className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-xs font-semibold hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Ban className="size-3.5" /> Hết hạn
                  </button>
                )}
                <button
                  onClick={() => removePost(p.id)}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-destructive/30 text-destructive text-xs font-semibold hover:bg-destructive/10"
                >
                  Gỡ bài
                </button>
              </div>
            </div>
          );
        })}
        {list.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">Không có bài đăng nào.</div>
        )}
      </div>
    </div>
  );
}
