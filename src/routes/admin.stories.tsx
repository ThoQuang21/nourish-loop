import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, EyeOff, X } from "lucide-react";
import { stories, type Story } from "@/lib/mock-data";

export const Route = createFileRoute("/admin/stories")({
  component: AdminStoriesPage,
});

const STATUS: Record<Story["status"], { label: string; cls: string }> = {
  published: { label: "Đã đăng", cls: "bg-primary-soft/40 text-primary" },
  pending: { label: "Chờ duyệt", cls: "bg-amber-500/15 text-amber-600" },
  hidden: { label: "Đã ẩn", cls: "bg-muted text-muted-foreground" },
};

function AdminStoriesPage() {
  const [items, setItems] = useState(stories);
  const [filter, setFilter] = useState<Story["status"] | "all">("all");

  const list = filter === "all" ? items : items.filter((s) => s.status === filter);
  const pendingCount = items.filter((s) => s.status === "pending").length;

  function updateStatus(id: string, status: Story["status"]) {
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  }

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Kiểm duyệt câu chuyện</h1>
        <p className="text-muted-foreground mt-1">
          {pendingCount} câu chuyện chờ duyệt · {items.filter((s) => s.status === "published").length} đã đăng
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-6">
        {(
          [
            ["all", "Tất cả"],
            ["pending", "Chờ duyệt"],
            ["published", "Đã đăng"],
            ["hidden", "Đã ẩn"],
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
        {list.map((s) => {
          const st = STATUS[s.status];
          return (
            <article key={s.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <img src={s.avatar} alt="" className="size-11 rounded-full object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold">{s.org}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${st.cls}`}>
                        {st.label}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">{s.author} · {s.daysAgo} ngày trước</div>
                    <p className="text-sm mt-3 leading-relaxed">{s.text}</p>
                    <div className="text-xs font-semibold text-primary mt-2">❤️ Cảm ơn {s.thanksTo}</div>
                  </div>
                </div>
                <img src={s.image} alt="" className="w-full aspect-[16/10] object-cover rounded-xl mt-4" />

                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  {s.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(s.id, "published")}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
                      >
                        <Check className="size-4" /> Duyệt đăng
                      </button>
                      <button
                        onClick={() => updateStatus(s.id, "hidden")}
                        className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-border font-semibold text-sm hover:bg-destructive/10 hover:text-destructive"
                      >
                        <X className="size-4" /> Từ chối
                      </button>
                    </>
                  )}
                  {s.status === "published" && (
                    <button
                      onClick={() => updateStatus(s.id, "hidden")}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl border border-border font-semibold text-sm hover:bg-destructive/10 hover:text-destructive"
                    >
                      <EyeOff className="size-4" /> Ẩn bài
                    </button>
                  )}
                  {s.status === "hidden" && (
                    <button
                      onClick={() => updateStatus(s.id, "published")}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm"
                    >
                      <Check className="size-4" /> Khôi phục
                    </button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
        {list.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">Không có câu chuyện nào.</div>
        )}
      </div>
    </div>
  );
}
