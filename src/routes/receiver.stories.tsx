import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, MessageCircle, Plus, Share2 } from "lucide-react";
import {
  createStory,
  getCurrentUser,
  likeStory,
  listStories,
  type StoryDTO,
} from "@/lib/api";

export const Route = createFileRoute("/receiver/stories")({
  component: StoriesPage,
});

function StoriesPage() {
  const [stories, setStories] = useState<StoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [posting, setPosting] = useState(false);
  const me = getCurrentUser();

  async function load() {
    setError(null);
    try {
      setStories(await listStories());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được câu chuyện");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function submit() {
    if (!me) {
      setError("Vui lòng đăng nhập để đăng câu chuyện.");
      return;
    }
    if (text.trim().length < 5) {
      setError("Câu chuyện cần ít nhất 5 ký tự.");
      return;
    }
    setPosting(true);
    setError(null);
    try {
      await createStory({ text: text.trim() });
      setText("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Đăng câu chuyện thất bại");
    } finally {
      setPosting(false);
    }
  }

  async function like(id: string) {
    try {
      const r = await likeStory(id);
      setStories((prev) => prev.map((s) => (s.id === id ? { ...s, likes: r.likes } : s)));
    } catch {
      /* bỏ qua lỗi like */
    }
  }

  return (
    <div className="p-6 lg:p-10 max-w-2xl mx-auto">
      <header className="mb-6 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Câu chuyện tác động</h1>
          <p className="text-muted-foreground mt-1">Chia sẻ lời cảm ơn và lan tỏa điều tử tế.</p>
        </div>
        <button
          onClick={submit}
          disabled={posting}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold disabled:opacity-60"
        >
          <Plus className="size-4" /> {posting ? "Đang đăng..." : "Đăng câu chuyện"}
        </button>
      </header>

      {/* Composer */}
      <div className="bg-card border border-border rounded-3xl p-5 shadow-card mb-6">
        <div className="flex gap-3">
          <img
            src={me?.avatarUrl ?? "https://i.pravatar.cc/80?img=44"}
            alt=""
            className="size-10 rounded-full object-cover"
          />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Chia sẻ câu chuyện của bạn..."
            className="flex-1 bg-secondary rounded-xl px-4 outline-none text-sm"
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {loading ? (
        <div className="text-sm text-muted-foreground p-10 text-center">Đang tải...</div>
      ) : stories.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-3xl p-16 text-center text-sm text-muted-foreground">
          Chưa có câu chuyện nào. Hãy là người đầu tiên chia sẻ!
        </div>
      ) : (
        <div className="space-y-5">
          {stories.map((s) => (
            <article key={s.id} className="bg-card border border-border rounded-3xl overflow-hidden shadow-card">
              <header className="flex items-center gap-3 p-5">
                <img src={s.avatar} alt="" className="size-11 rounded-full object-cover bg-muted" />
                <div className="flex-1">
                  <div className="font-semibold">{s.org || s.author}</div>
                  <div className="text-xs text-muted-foreground">
                    {s.author} · {s.daysAgo} ngày trước
                  </div>
                </div>
                {s.thanksTo && (
                  <div className="text-xs font-semibold text-primary bg-primary-soft/40 px-2.5 py-1 rounded-full">
                    ❤️ Cảm ơn {s.thanksTo}
                  </div>
                )}
              </header>
              <p className="px-5 pb-4 text-sm leading-relaxed">{s.text}</p>
              {s.image && <img src={s.image} alt="" className="w-full aspect-[16/10] object-cover" />}
              <footer className="flex items-center gap-6 px-5 py-3 border-t border-border text-sm text-muted-foreground">
                <button
                  onClick={() => like(s.id)}
                  className="inline-flex items-center gap-1.5 hover:text-destructive"
                >
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
      )}
    </div>
  );
}
