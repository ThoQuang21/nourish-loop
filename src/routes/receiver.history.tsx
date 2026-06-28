import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Package, Star } from "lucide-react";
import {
  createReview,
  getCurrentUser,
  listHistory,
  type ReceiverHistoryItem,
} from "@/lib/api";

export const Route = createFileRoute("/receiver/history")({
  component: HistoryPage,
});

function fmtDate(s: string | null): string {
  if (!s) return "";
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString("vi-VN");
}

function HistoryPage() {
  const [items, setItems] = useState<ReceiverHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Đánh giá
  const [ratingFor, setRatingFor] = useState<string | null>(null);
  const [score, setScore] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const me = getCurrentUser();

  async function load() {
    if (!me) {
      setLoading(false);
      setError("Vui lòng đăng nhập để xem lịch sử.");
      return;
    }
    try {
      setItems(await listHistory(me.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được lịch sử");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openRating(id: string) {
    setRatingFor(id);
    setScore(5);
    setComment("");
    setReviewError(null);
  }

  async function submitReview(transactionId: string) {
    setSubmitting(true);
    setReviewError(null);
    try {
      await createReview({ transactionId, score, comment: comment.trim() || undefined });
      setRatingFor(null);
      await load();
    } catch (e) {
      setReviewError(e instanceof Error ? e.message : "Gửi đánh giá thất bại");
    } finally {
      setSubmitting(false);
    }
  }

  const totalKg = items.reduce((sum, h) => sum + h.kg, 0);

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Lịch sử giao dịch</h1>
        <p className="text-muted-foreground mt-1">
          Tổng cộng {totalKg.toLocaleString("vi-VN")}kg thực phẩm đã được nhận.
        </p>
      </header>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {loading ? (
        <div className="text-sm text-muted-foreground p-10 text-center">Đang tải...</div>
      ) : items.length === 0 ? (
        <div className="bg-card border border-dashed border-border rounded-3xl p-16 text-center text-sm text-muted-foreground">
          Chưa có giao dịch hoàn tất nào.
        </div>
      ) : (
        <div className="relative pl-6 border-l-2 border-border space-y-6">
          {items.map((h) => (
            <div key={h.id} className="relative">
              <span className="absolute -left-[31px] size-6 rounded-full bg-primary text-primary-foreground grid place-items-center">
                <Check className="size-3.5" />
              </span>
              <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
                <div className="flex flex-wrap justify-between gap-2">
                  <div>
                    <div className="text-xs text-muted-foreground">{fmtDate(h.date)}</div>
                    <div className="font-semibold mt-1">{h.item}</div>
                    <div className="text-sm text-muted-foreground">
                      từ {h.providerOrg || h.providerName}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
                      <Package className="size-3.5" /> {h.kg}kg
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Hoàn thành</div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between text-xs">
                  {h.rated ? (
                    <span className="text-accent-foreground">
                      {"★".repeat(h.ratingScore ?? 5)} Đã đánh giá
                    </span>
                  ) : ratingFor === h.id ? (
                    <span className="text-muted-foreground">Đánh giá nhà cung cấp</span>
                  ) : (
                    <button
                      onClick={() => openRating(h.id)}
                      className="font-semibold text-primary hover:underline"
                    >
                      Đánh giá
                    </button>
                  )}
                  {h.co2SavedKg > 0 && (
                    <span className="text-primary font-semibold">
                      ↓ {h.co2SavedKg.toLocaleString("vi-VN")} kg CO₂
                    </span>
                  )}
                </div>

                {ratingFor === h.id && !h.rated && (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setScore(n)}
                          aria-label={`${n} sao`}
                        >
                          <Star
                            className={`size-6 ${n <= score ? "fill-accent text-accent" : "text-muted-foreground"}`}
                          />
                        </button>
                      ))}
                    </div>
                    <textarea
                      rows={2}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Nhận xét (tuỳ chọn)..."
                      className="w-full px-3 py-2 text-sm rounded-xl border border-input bg-background outline-none resize-none focus:border-primary"
                    />
                    {reviewError && <p className="text-xs text-destructive">{reviewError}</p>}
                    <div className="flex gap-2">
                      <button
                        onClick={() => submitReview(h.id)}
                        disabled={submitting}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-60"
                      >
                        {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                      </button>
                      <button
                        onClick={() => setRatingFor(null)}
                        className="px-4 py-2 rounded-xl border border-border text-sm font-semibold hover:bg-secondary"
                      >
                        Huỷ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
