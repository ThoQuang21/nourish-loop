import { createFileRoute } from "@tanstack/react-router";
import { Heart, MessageCircle, Plus, Share2 } from "lucide-react";
import { stories } from "@/lib/mock-data";

export const Route = createFileRoute("/receiver/stories")({
  component: StoriesPage,
});

function StoriesPage() {
  return (
    <div className="p-6 lg:p-10 max-w-2xl mx-auto">
      <header className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Câu chuyện tác động</h1>
          <p className="text-muted-foreground mt-1">Chia sẻ lời cảm ơn và lan tỏa điều tử tế.</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold">
          <Plus className="size-4" /> Đăng câu chuyện
        </button>
      </header>

      {/* Composer */}
      <div className="bg-card border border-border rounded-3xl p-5 shadow-card mb-6">
        <div className="flex gap-3">
          <img src="https://i.pravatar.cc/80?img=44" alt="" className="size-10 rounded-full" />
          <input
            placeholder="Chia sẻ câu chuyện của bạn..."
            className="flex-1 bg-secondary rounded-xl px-4 outline-none text-sm"
          />
        </div>
      </div>

      <div className="space-y-5">
        {stories.map((s) => (
          <article key={s.id} className="bg-card border border-border rounded-3xl overflow-hidden shadow-card">
            <header className="flex items-center gap-3 p-5">
              <img src={s.avatar} alt="" className="size-11 rounded-full object-cover" />
              <div className="flex-1">
                <div className="font-semibold">{s.org}</div>
                <div className="text-xs text-muted-foreground">{s.author} · {s.daysAgo} ngày trước</div>
              </div>
              <div className="text-xs font-semibold text-primary bg-primary-soft/40 px-2.5 py-1 rounded-full">
                ❤️ Cảm ơn {s.thanksTo}
              </div>
            </header>
            <p className="px-5 pb-4 text-sm leading-relaxed">{s.text}</p>
            <img src={s.image} alt="" className="w-full aspect-[16/10] object-cover" />
            <footer className="flex items-center gap-6 px-5 py-3 border-t border-border text-sm text-muted-foreground">
              <button className="inline-flex items-center gap-1.5 hover:text-destructive">
                <Heart className="size-4" /> {s.likes}
              </button>
              <button className="inline-flex items-center gap-1.5 hover:text-foreground">
                <MessageCircle className="size-4" /> Bình luận
              </button>
              <button className="inline-flex items-center gap-1.5 hover:text-foreground ml-auto">
                <Share2 className="size-4" /> Chia sẻ
              </button>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
