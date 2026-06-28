import { useEffect, useState } from "react";
import { CheckCircle2, MapPin, Package, ShieldCheck, Sparkles } from "lucide-react";
import { previewMatches, type MatchCandidate, type MatchInput } from "@/lib/api";

interface Props {
  /** Nháp tin để chấm điểm (null nếu chưa đủ thông tin). */
  draft: MatchInput | null;
  /** Tự tải khi mount (dùng cho trang chi tiết tin đã đăng). */
  auto?: boolean;
}

export function MatchSuggestions({ draft, auto = false }: Props) {
  const [matches, setMatches] = useState<MatchCandidate[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    if (!draft) {
      setError("Cần điền danh mục, khối lượng và địa điểm trước.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await previewMatches(draft);
      setMatches(res.matches);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không lấy được gợi ý");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (auto && draft) void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto]);

  return (
    <div className="bg-card border border-border rounded-3xl p-5 lg:p-6 shadow-card">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h3 className="font-bold text-lg inline-flex items-center gap-2">
          <Sparkles className="size-5 text-primary" /> Người nhận phù hợp
        </h3>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="text-sm font-semibold text-primary hover:underline disabled:opacity-60"
        >
          {loading ? "Đang tính..." : matches ? "Tải lại" : "Xem gợi ý"}
        </button>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {matches === null && !error ? (
        <p className="text-sm text-muted-foreground">
          Hệ thống gợi ý người nhận theo khoảng cách, uy tín, sức chứa và khung giờ.
        </p>
      ) : matches && matches.length === 0 ? (
        <p className="text-sm text-muted-foreground">Chưa tìm thấy người nhận phù hợp.</p>
      ) : (
        <div className="space-y-3">
          {matches?.map((m) => (
            <div key={m.receiverId} className="flex gap-3 p-3 rounded-2xl bg-secondary/40">
              <MatchRing percent={m.matchPercent} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold truncate">{m.receiverOrg || m.receiverName}</span>
                  {m.verified && (
                    <ShieldCheck className="size-3.5 text-primary shrink-0" aria-label="Đã xác minh" />
                  )}
                  {m.autoAcceptMatch && (
                    <span className="text-[10px] font-semibold text-primary bg-primary-soft/40 px-1.5 py-0.5 rounded-full">
                      Tự động nhận
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                  {m.distanceKm !== null && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="size-3" /> {m.distanceKm} km
                    </span>
                  )}
                  {m.capacityLeftKg !== null && (
                    <span className="inline-flex items-center gap-1">
                      <Package className="size-3" /> còn {m.capacityLeftKg} kg
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="size-3" /> {m.availabilityLabel}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {m.reasons.map((r, i) => (
                    <span key={i} className="text-[11px] bg-card border border-border px-2 py-0.5 rounded-full">
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MatchRing({ percent }: { percent: number }) {
  const color =
    percent >= 80 ? "text-primary" : percent >= 60 ? "text-accent-foreground" : "text-muted-foreground";
  return (
    <div className={`shrink-0 size-12 rounded-full grid place-items-center border-2 ${color} border-current`}>
      <span className="text-sm font-bold">{percent}%</span>
    </div>
  );
}
