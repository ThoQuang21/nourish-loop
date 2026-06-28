import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, Clock, MapPin, Scale, ShieldCheck, Star, X } from "lucide-react";
import { getMyPost, respondToRequest, type MatchInput, type ProviderPostDetail } from "@/lib/api";
import { MatchSuggestions } from "@/components/MatchSuggestions";

export const Route = createFileRoute("/provider/post/$id")({
  component: PostDetailPage,
});

const STATUS: Record<string, { label: string; cls: string }> = {
  open: { label: "Đang mở", cls: "bg-primary-soft/40 text-primary" },
  matched: { label: "Đã có người nhận", cls: "bg-accent-soft text-accent-foreground" },
  completed: { label: "Hoàn thành", cls: "bg-muted text-muted-foreground" },
  expired: { label: "Hết hạn", cls: "bg-destructive/15 text-destructive" },
};

function PostDetailPage() {
  const { id } = useParams({ from: "/provider/post/$id" });
  const [post, setPost] = useState<ProviderPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      setPost(await getMyPost(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được bài đăng");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function respond(reqId: string, status: "ACCEPTED" | "REJECTED") {
    setBusy(reqId);
    try {
      await respondToRequest(reqId, status);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không cập nhật được yêu cầu");
    } finally {
      setBusy(null);
    }
  }

  if (loading) {
    return <div className="p-10 text-sm text-muted-foreground">Đang tải...</div>;
  }
  if (error || !post) {
    return (
      <div className="p-10">
        <p className="text-destructive text-sm">{error ?? "Không tìm thấy bài đăng."}</p>
        <Link to="/provider/posts" className="text-primary font-semibold">
          ← Về bài đăng của tôi
        </Link>
      </div>
    );
  }

  const s = STATUS[post.status] ?? STATUS.open;

  const matchDraft: MatchInput = {
    category: post.category,
    weightKg: post.weightKg,
    address: post.address,
    ...(post.title.length >= 3 ? { title: post.title } : {}),
    ...(post.pickupWindow ? { pickupWindow: post.pickupWindow } : {}),
  };

  return (
    <div className="p-6 lg:p-10 max-w-5xl mx-auto">
      <Link
        to="/provider/posts"
        className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground mb-5"
      >
        <ArrowLeft className="size-4" /> Bài đăng của tôi
      </Link>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div>
          <div className="relative rounded-3xl overflow-hidden aspect-[16/10] bg-muted shadow-card">
            <img src={post.image} alt={post.title} className="size-full object-cover" />
            <span className={`absolute top-4 left-4 text-xs font-semibold px-2.5 py-1 rounded-full ${s.cls}`}>
              {s.label}
            </span>
          </div>

          <div className="mt-6">
            <div className="text-xs font-semibold text-primary bg-primary-soft/40 inline-block px-2.5 py-1 rounded-full">
              {post.category}
            </div>
            <h1 className="text-3xl font-bold mt-3">{post.title}</h1>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1"><Scale className="size-4" /> {post.weightKg} kg</span>
              <span className="inline-flex items-center gap-1"><Clock className="size-4" /> {post.pickupWindow}</span>
              <span className="inline-flex items-center gap-1"><MapPin className="size-4" /> {post.address}</span>
            </div>
            {post.description && (
              <p className="mt-5 text-foreground/80 leading-relaxed">{post.description}</p>
            )}
          </div>
        </div>

        {/* Requests on this post */}
        <aside>
          <h2 className="font-bold text-lg mb-3">Yêu cầu nhận ({post.requests.length})</h2>
          {post.requests.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-2xl p-8 text-center text-sm text-muted-foreground">
              Chưa có yêu cầu nào.
            </div>
          ) : (
            <div className="space-y-3">
              {post.requests.map((r) => (
                <div key={r.id} className="bg-card border border-border rounded-2xl p-4 shadow-card">
                  <div className="font-semibold">{r.receiverName}</div>
                  <div className="text-xs text-muted-foreground">{r.receiverOrg}</div>
                  <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><MapPin className="size-3" /> {r.distanceKm} km</span>
                    <span className="inline-flex items-center gap-1"><Star className="size-3 fill-accent text-accent" /> {r.trustScore}</span>
                    {r.verified && (
                      <span className="inline-flex items-center gap-1 text-primary font-semibold">
                        <ShieldCheck className="size-3" /> Verified
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    {r.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => respond(r.id, "ACCEPTED")}
                          disabled={busy === r.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-60"
                        >
                          <Check className="size-3.5" /> Chấp nhận
                        </button>
                        <button
                          onClick={() => respond(r.id, "REJECTED")}
                          disabled={busy === r.id}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-destructive/10 hover:text-destructive disabled:opacity-60"
                        >
                          <X className="size-3.5" /> Từ chối
                        </button>
                      </div>
                    ) : r.status === "accepted" ? (
                      <span className="text-xs font-semibold text-primary">
                        Đã chấp nhận{r.qrCode ? ` · QR: ${r.qrCode}` : ""}
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground capitalize">{r.status}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6">
            <MatchSuggestions draft={matchDraft} auto />
          </div>
        </aside>
      </div>
    </div>
  );
}
