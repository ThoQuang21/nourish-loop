import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, MoreHorizontal, Pencil, Scale, X } from "lucide-react";
import { deletePost, listMyPosts, type FoodPostDTO } from "@/lib/api";

export const Route = createFileRoute("/provider/posts")({
  component: MyPosts,
});

const STATUS: Record<string, { label: string; cls: string }> = {
  open: { label: "Đang mở", cls: "bg-primary-soft/40 text-primary" },
  matched: { label: "Đã có người nhận", cls: "bg-accent-soft text-accent-foreground" },
  completed: { label: "Hoàn thành", cls: "bg-muted text-muted-foreground" },
  expired: { label: "Hết hạn", cls: "bg-destructive/15 text-destructive" },
};

function MyPosts() {
  const [filter, setFilter] = useState<string>("all");
  const [posts, setPosts] = useState<FoodPostDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      setPosts(await listMyPosts());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được bài đăng");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onDelete(id: string) {
    try {
      await deletePost(id);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không xoá được bài đăng");
    }
  }

  const list = filter === "all" ? posts : posts.filter((p) => p.status === filter);

  return (
    <div className="p-6 lg:p-10 max-w-6xl mx-auto">
      <header className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Bài đăng của tôi</h1>
          <p className="text-muted-foreground mt-1">Quản lý tất cả thực phẩm bạn đã chia sẻ.</p>
        </div>
        <Link to="/provider/create" className="bg-primary text-primary-foreground px-4 py-2.5 rounded-xl font-semibold">
          + Đăng mới
        </Link>
      </header>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          ["all", "Tất cả"],
          ["open", "Đang mở"],
          ["matched", "Đã có người nhận"],
          ["completed", "Hoàn thành"],
          ["expired", "Hết hạn"],
        ].map(([k, l]) => (
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

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {loading ? (
        <div className="text-sm text-muted-foreground p-10 text-center">Đang tải...</div>
      ) : list.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((p) => {
            const s = STATUS[p.status] ?? STATUS.open;
            return (
              <div key={p.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
                <div className="relative aspect-[16/10]">
                  <img src={p.image} alt={p.title} className="size-full object-cover" />
                  <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${s.cls}`}>
                    {s.label}
                  </span>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold leading-tight line-clamp-1">{p.title}</h3>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                      <span className="inline-flex items-center gap-1"><Scale className="size-3" />{p.weightKg}kg</span>
                      <span>{p.pickupWindow}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Link
                      to="/receiver/food/$id"
                      params={{ id: p.id }}
                      className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-semibold py-2 rounded-lg bg-secondary hover:bg-secondary/80"
                    >
                      <Eye className="size-3.5" /> Chi tiết
                    </Link>
                    <button className="flex-1 inline-flex items-center justify-center gap-1 text-xs font-semibold py-2 rounded-lg bg-secondary hover:bg-secondary/80">
                      <Pencil className="size-3.5" /> Sửa
                    </button>
                    <button
                      onClick={() => onDelete(p.id)}
                      title="Đóng / hết hạn bài đăng"
                      className="inline-flex items-center justify-center p-2 rounded-lg bg-secondary hover:bg-destructive/15 hover:text-destructive"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-card border border-dashed border-border rounded-3xl p-16 text-center">
      <div className="size-16 mx-auto rounded-2xl bg-primary-soft/40 text-primary grid place-items-center mb-4">
        <MoreHorizontal className="size-6" />
      </div>
      <div className="font-semibold">Chưa có bài đăng nào</div>
      <p className="text-sm text-muted-foreground mt-1">Hãy đăng bài đầu tiên của bạn!</p>
    </div>
  );
}
